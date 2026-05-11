"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { upsertCustomer, createPayment } from "@/lib/asaas/client";

// Em caso de sucesso, o action chama redirect() e nunca retorna.
// Esse tipo cobre só os caminhos de erro que voltam pro form.
export type CheckoutResult = { ok: false; error: string } | null;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validação leve de CPF/CNPJ: só conta os dígitos. Asaas rejeita formato inválido
// na criação do cliente — não precisa validar dígito verificador no front.
function cleanCpfCnpj(raw: string): string {
  return raw.replace(/\D/g, "");
}

export async function checkoutCourse(
  _prev: CheckoutResult | null,
  formData: FormData,
): Promise<CheckoutResult> {
  const courseSlug = String(formData.get("course_slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const cpfCnpjRaw = String(formData.get("cpf_cnpj") ?? "");
  const phone = String(formData.get("phone") ?? "").trim() || null;

  if (!courseSlug) return { ok: false, error: "Curso inválido." };
  if (name.length < 2) return { ok: false, error: "Informe seu nome completo." };
  if (!isValidEmail(email)) return { ok: false, error: "Email inválido." };

  const cpfCnpj = cleanCpfCnpj(cpfCnpjRaw);
  if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
    return { ok: false, error: "CPF deve ter 11 dígitos ou CNPJ 14 dígitos." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return { ok: false, error: "Configuração do servidor incompleta." };
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // 1) Busca curso e preço
  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .select("id, title, price_cents, is_published")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (courseErr || !course) {
    return { ok: false, error: "Curso não encontrado." };
  }
  if (!course.is_published) {
    return { ok: false, error: "Curso indisponível no momento." };
  }
  if (!course.price_cents || course.price_cents <= 0) {
    return { ok: false, error: "Preço do curso não configurado. Avise o administrador." };
  }

  // 2) Cria order no Supabase com status PENDING — precisamos do id antes de chamar o Asaas
  //    pra usar como externalReference (correlação no webhook).
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      course_id: course.id,
      customer_name: name,
      customer_email: email,
      customer_cpf_cnpj: cpfCnpj,
      customer_phone: phone,
      amount_cents: course.price_cents,
      gateway: "asaas",
      status: "PENDING",
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    console.error("[checkout] insert order falhou:", orderErr);
    return { ok: false, error: "Não foi possível iniciar o pedido. Tente novamente." };
  }

  // 3) Asaas: upsert cliente + cria cobrança
  let invoiceUrl: string;
  try {
    const customer = await upsertCustomer({
      name,
      email,
      cpfCnpj,
      phone: phone ?? undefined,
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
    const successUrl = siteUrl
      ? `${siteUrl}/comprar/sucesso?order_id=${order.id}`
      : undefined;

    const payment = await createPayment({
      customerId: customer.id,
      amountCents: course.price_cents,
      description: course.title,
      externalReference: order.id,
      successUrl,
    });

    invoiceUrl = payment.invoiceUrl;

    // Atualiza order com IDs Asaas
    await supabase
      .from("orders")
      .update({
        asaas_customer_id: customer.id,
        asaas_payment_id: payment.id,
        invoice_url: payment.invoiceUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);
  } catch (err) {
    console.error("[checkout] Asaas falhou:", err);
    // marca order como CANCELED pra não ficar lixo PENDING eterno
    await supabase
      .from("orders")
      .update({ status: "CANCELED", updated_at: new Date().toISOString() })
      .eq("id", order.id);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Falha ao criar cobrança.",
    };
  }

  redirect(invoiceUrl);
}
