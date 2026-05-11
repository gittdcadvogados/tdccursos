import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Webhook Asaas — recebe eventos de pagamento e atualiza orders + cria enrollments.
//
// Configurar no painel Asaas:
//   Configurações > Integrações > Webhook
//     URL: https://<seu-dominio>/api/webhooks/asaas
//     Token: o mesmo valor de ASAAS_WEBHOOK_TOKEN (vem no header asaas-access-token)
//     Eventos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE,
//              PAYMENT_REFUNDED, PAYMENT_DELETED
//
// Doc: https://docs.asaas.com/docs/sobre-os-webhooks

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AsaasWebhookBody = {
  event: string;
  payment?: {
    id: string;
    status: string;
    customer: string;
    value: number;
    externalReference?: string;
    paymentDate?: string;
    confirmedDate?: string;
  };
};

const PAID_STATUSES = new Set(["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH"]);

// Mapeia status do Asaas pro nosso enum em orders.status
function mapStatus(asaasStatus: string): string {
  switch (asaasStatus) {
    case "CONFIRMED":
      return "CONFIRMED";
    case "RECEIVED":
    case "RECEIVED_IN_CASH":
      return "RECEIVED";
    case "OVERDUE":
      return "OVERDUE";
    case "REFUNDED":
    case "CHARGEBACK_REQUESTED":
    case "CHARGEBACK_DISPUTE":
      return "REFUNDED";
    case "DELETED":
    case "CANCELED":
      return "CANCELED";
    default:
      return "PENDING";
  }
}

export async function POST(req: Request) {
  // 1) Valida token
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;
  if (!expectedToken) {
    console.error("[webhook/asaas] ASAAS_WEBHOOK_TOKEN não configurado");
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }
  const token = req.headers.get("asaas-access-token");
  if (token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Parse
  let body: AsaasWebhookBody;
  try {
    body = (await req.json()) as AsaasWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // 3) Log bruto (idempotência + auditoria)
  const { data: logRow } = await supabase
    .from("payment_webhooks")
    .insert({
      gateway: "asaas",
      event_type: body.event,
      payment_id: body.payment?.id ?? null,
      payload: body,
    })
    .select("id")
    .single();

  // 4) Processa
  try {
    await handleEvent(body, supabase);
    if (logRow) {
      await supabase
        .from("payment_webhooks")
        .update({ processed: true })
        .eq("id", logRow.id);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("[webhook/asaas] erro processando:", err);
    if (logRow) {
      await supabase
        .from("payment_webhooks")
        .update({ processed: false, error: message })
        .eq("id", logRow.id);
    }
    // Retorna 200 mesmo assim — não queremos que o Asaas fique reenviando indefinidamente
    // por causa de um erro nosso transitório. O log fica marcado como não processado
    // pra reprocessar manualmente depois.
    return NextResponse.json({ ok: false, error: message });
  }

  return NextResponse.json({ ok: true });
}

async function handleEvent(
  body: AsaasWebhookBody,
  supabase: SupabaseClient,
) {
  const payment = body.payment;
  if (!payment) return;

  // Localiza nosso order: prioriza externalReference (que pusemos como orders.id);
  // se não veio, busca por asaas_payment_id.
  let orderQuery = supabase
    .from("orders")
    .select("id, course_id, customer_email, customer_name, status, profile_id");

  if (payment.externalReference) {
    orderQuery = orderQuery.eq("id", payment.externalReference);
  } else {
    orderQuery = orderQuery.eq("asaas_payment_id", payment.id);
  }

  const { data: order } = await orderQuery.maybeSingle();
  if (!order) {
    console.warn("[webhook/asaas] order não encontrada", {
      payment_id: payment.id,
      externalReference: payment.externalReference,
    });
    return;
  }

  const newStatus = mapStatus(payment.status);
  const wasPaid = order.status === "CONFIRMED" || order.status === "RECEIVED";
  const nowPaid = PAID_STATUSES.has(payment.status);

  // Atualiza order
  await supabase
    .from("orders")
    .update({
      status: newStatus,
      asaas_payment_id: payment.id,
      paid_at: nowPaid
        ? payment.confirmedDate || payment.paymentDate || new Date().toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  // Cria enrollment APENAS na primeira confirmação de pagamento.
  if (nowPaid && !wasPaid) {
    await ensureEnrollment(supabase, {
      orderId: order.id,
      courseId: order.course_id,
      email: order.customer_email,
      name: order.customer_name,
      existingProfileId: order.profile_id,
    });
  }
}

async function ensureEnrollment(
  supabase: SupabaseClient,
  args: {
    orderId: string;
    courseId: string;
    email: string;
    name: string;
    existingProfileId: string | null;
  },
) {
  // 1) Resolve user_id: se já temos profile_id no order, usa.
  //    Senão, tenta achar um user em auth.users pelo email.
  //    Se não existe, NÃO criamos user aqui — registramos a venda como pendente
  //    de vinculação. O cliente vai criar a conta com o mesmo email; quando ele
  //    se cadastrar, ligamos pelo email no momento do signup (ver TODO abaixo).
  let userId = args.existingProfileId;

  if (!userId) {
    // Procura user existente por email
    const { data: users } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });
    const found = users?.users?.find(
      (u) => u.email?.toLowerCase() === args.email.toLowerCase(),
    );

    if (found) {
      userId = found.id;
    } else {
      // Cria conta automaticamente. Convite por email manda definição de senha.
      const { data: created, error: createErr } =
        await supabase.auth.admin.inviteUserByEmail(args.email, {
          data: { full_name: args.name },
        });
      if (createErr || !created.user) {
        throw new Error(
          `Falha ao convidar usuário ${args.email}: ${createErr?.message ?? "unknown"}`,
        );
      }
      userId = created.user.id;
    }
  }

  if (!userId) {
    throw new Error("não foi possível resolver user_id");
  }

  // Vincula order ao profile (se ainda não estava vinculado)
  if (!args.existingProfileId) {
    await supabase
      .from("orders")
      .update({ profile_id: userId, updated_at: new Date().toISOString() })
      .eq("id", args.orderId);
  }

  // Cria enrollment (idempotente — unique (user_id, course_id))
  const { error: enrollErr } = await supabase
    .from("enrollments")
    .upsert(
      { user_id: userId, course_id: args.courseId },
      { onConflict: "user_id,course_id", ignoreDuplicates: true },
    );

  if (enrollErr) {
    throw new Error(`enrollment falhou: ${enrollErr.message}`);
  }
}
