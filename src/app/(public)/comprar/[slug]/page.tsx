import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, FileText, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "./checkout-form";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("title, description")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return { title: "Comprar curso — TDC CURSOS" };
  return {
    title: `Comprar ${data.title} — TDC CURSOS`,
    description: data.description ?? undefined,
  };
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function CheckoutPage({ params }: { params: Params }) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("slug, title, description, price_cents, is_published")
    .eq("slug", slug)
    .maybeSingle();

  if (!course || !course.is_published) {
    notFound();
  }

  const price = course.price_cents ?? 0;
  const priceUnavailable = price <= 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-medium text-accent-soft-fg">
          <span className="tech-pulse h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="tech-mono uppercase tracking-wider">CHECKOUT</span>
        </span>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          {course.title}
        </h1>
        {course.description && (
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-foreground-muted">
            {course.description}
          </p>
        )}
      </header>

      <div className="mt-12 grid gap-8 md:grid-cols-[1.1fr_1fr]">
        {/* Coluna esquerda: resumo + benefícios */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
            <p className="tech-mono text-xs uppercase tracking-wider text-foreground-muted">
              VALOR_DO_CURSO
            </p>
            {priceUnavailable ? (
              <p className="mt-2 text-2xl font-semibold text-foreground-muted">
                Preço a configurar
              </p>
            ) : (
              <p className="mt-2 text-4xl font-semibold tracking-tight">
                {formatBRL(price)}
              </p>
            )}
            <p className="mt-2 text-sm text-foreground-muted">
              Acesso vitalício · atualizações inclusas
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            <Benefit icon={<CheckCircle2 className="text-accent" />}>
              58 videoaulas + 7 encontros ao vivo gravados
            </Benefit>
            <Benefit icon={<ShieldCheck className="text-accent" />}>
              Pagamento processado pela Asaas (PCI-DSS)
            </Benefit>
            <Benefit icon={<FileText className="text-accent" />}>
              Nota fiscal emitida no CNPJ
            </Benefit>
            <Benefit icon={<Zap className="text-accent" />}>
              Liberação automática após confirmação do pagamento
            </Benefit>
          </ul>
        </aside>

        {/* Coluna direita: formulário */}
        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          {priceUnavailable ? (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Este curso ainda não tem preço configurado. Defina{" "}
              <code className="rounded bg-amber-100 px-1">price_cents</code> na
              tabela <code className="rounded bg-amber-100 px-1">courses</code>{" "}
              antes de abrir o checkout.
            </div>
          ) : (
            <CheckoutForm courseSlug={course.slug} />
          )}
        </div>
      </div>
    </div>
  );
}

function Benefit({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="[&_svg]:size-5 mt-0.5">{icon}</span>
      <span className="text-foreground">{children}</span>
    </li>
  );
}
