import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pagamento recebido — TDC CURSOS",
};

type SearchParams = Promise<{ order_id?: string }>;

// Status do order do nosso lado:
//   PENDING    -> ainda esperando confirmação do gateway (Pix gerado, boleto emitido)
//   CONFIRMED  -> cartão aprovado, aguardando liquidação
//   RECEIVED   -> dinheiro recebido (Pix/boleto) — acesso liberado
//   OVERDUE    -> boleto vencido
//   REFUNDED   -> estornado
//   CANCELED   -> cancelado
function isPaid(status: string | null | undefined) {
  return status === "RECEIVED" || status === "CONFIRMED";
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { order_id } = await searchParams;

  let status: string | null = null;
  let customerEmail: string | null = null;

  if (order_id) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false },
      });
      const { data } = await supabase
        .from("orders")
        .select("status, customer_email")
        .eq("id", order_id)
        .maybeSingle();
      status = data?.status ?? null;
      customerEmail = data?.customer_email ?? null;
    }
  }

  const paid = isPaid(status);

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center md:py-24">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
        <CheckCircle2 className="h-9 w-9 text-accent" />
      </div>

      <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {paid ? "Tudo certo! Pagamento confirmado." : "Recebemos sua solicitação."}
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-pretty text-foreground-muted md:text-lg">
        {paid ? (
          <>
            Acabamos de liberar seu acesso ao curso.{" "}
            {customerEmail && (
              <>
                Enviamos um email para{" "}
                <strong className="text-foreground">{customerEmail}</strong> com
                as instruções de acesso e definição de senha.
              </>
            )}
          </>
        ) : (
          <>
            Estamos aguardando a confirmação do pagamento pelo banco. Você vai
            receber um email assim que for processado — em geral leva alguns
            minutos para Pix e até 2 dias úteis para boleto.
          </>
        )}
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {paid ? (
          <Link href="/login" className={buttonVariants({ size: "lg" })}>
            Acessar a plataforma
          </Link>
        ) : (
          <Link href="/" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Voltar para a home
          </Link>
        )}
      </div>

      <p className="tech-mono mt-12 inline-flex items-center gap-2 text-xs text-foreground-muted">
        <Mail className="size-3.5" />
        <span>
          Dúvidas? Escreva para{" "}
          <a className="text-accent hover:underline" href="mailto:contato@tdccursos.com.br">
            contato@tdccursos.com.br
          </a>
        </span>
      </p>
    </div>
  );
}
