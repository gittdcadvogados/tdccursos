import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, PlayCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { AulaGate } from "./aula-gate";
import { isAulaInauguralUnlocked } from "./actions";

export const metadata: Metadata = {
  title: "Aula Inaugural Gratuita — TDC CURSOS",
  description:
    "Aula aberta ao público: por que esse curso, por que agora — o Regulamento IBS/CBS e o transporte rodoviário.",
};

type SearchParams = Promise<{ utm_source?: string; source?: string }>;

export default async function AulaInauguralPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const source = params.utm_source || params.source || null;

  const unlocked = await isAulaInauguralUnlocked();

  // Bullets do curso completo — vêm dos módulos reais do Supabase.
  // Fallback estático caso a query falhe ou esteja vazia.
  const supabase = await createClient();
  const { data: modules } = await supabase
    .from("modules")
    .select("title, description, position")
    .order("position", { ascending: true });

  const bullets =
    modules && modules.length > 0
      ? modules.map((m) => ({
          title: m.title.replace(/^Módulo \d+ — /, ""),
          description: m.description ?? "",
        }))
      : FALLBACK_BULLETS;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-medium text-accent-soft-fg">
          <span className="tech-pulse h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="tech-mono uppercase tracking-wider">
            AULA_GRATUITA
          </span>
          <span className="opacity-60">·</span>
          <span>25 minutos</span>
        </span>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Por que esse curso, por que agora
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-foreground-muted md:text-lg">
          O Regulamento IBS/CBS e o transporte rodoviário — uma introdução ao
          que muda, ao que urge e ao que ainda dá tempo de planejar.
        </p>
      </header>

      {unlocked ? (
        <UnlockedState bullets={bullets} />
      ) : (
        <AulaGate source={source} />
      )}
    </div>
  );
}

function UnlockedState({
  bullets,
}: {
  bullets: { title: string; description: string }[];
}) {
  return (
    <>
      {/* Player */}
      <div className="mt-10 aspect-video overflow-hidden rounded-2xl border border-border bg-surface-muted">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <PlayCircle className="mx-auto h-12 w-12 text-foreground-muted" />
            <p className="mt-3 text-sm text-foreground-muted">
              Player de vídeo (placeholder · Bunny Stream)
            </p>
            <p className="tech-mono mt-1 text-[11px] text-foreground-muted">
              ▸ video_guid · TODO
            </p>
          </div>
        </div>
      </div>

      {/* O que você vai aprender no curso completo */}
      <section className="mt-14">
        <header className="mb-6">
          <span className="tech-mono text-xs font-semibold uppercase tracking-wider text-accent">
            ▸ CURSO_COMPLETO
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            O que você vai dominar na grade completa
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-foreground-muted md:text-base">
            A aula gratuita é só o gancho. O curso completo entra no detalhe
            técnico de cada peça da Reforma aplicada ao transporte rodoviário.
          </p>
        </header>

        <ul className="grid gap-3 md:grid-cols-2">
          {bullets.map((b, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-soft-fg">
                <Check className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">{b.title}</p>
                {b.description && (
                  <p className="mt-1 text-xs text-foreground-muted">
                    {b.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA final */}
      <div className="mt-14 rounded-2xl border border-accent/20 bg-accent-soft p-6 text-center md:p-10">
        <p className="tech-mono text-xs font-semibold uppercase tracking-wider text-accent">
          ▸ PROXIMO_PASSO
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Pronto pra ir além da introdução?
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/80 md:text-base">
          O curso completo destrincha cada artigo da LC 214/2025 aplicado ao
          frete, com casos práticos e encontros ao vivo com o Rafael.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/cadastro" className={buttonVariants({ size: "lg" })}>
            Inscrever-se no curso completo
            <ArrowRight />
          </Link>
          <Link
            href="/sobre"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Ver grade detalhada
          </Link>
        </div>
      </div>
    </>
  );
}

const FALLBACK_BULLETS = [
  {
    title: "Fundamentos da Reforma Tributária",
    description:
      "Visão geral do IBS, CBS, ICMS e o cronograma de transição 2026–2033.",
  },
  {
    title: "LC 214/2025 aplicada ao transporte rodoviário",
    description:
      "Artigos relevantes, hipóteses de incidência e base de cálculo no frete.",
  },
  {
    title: "SINIEF 24/2024 e o CT-e na nova ordem",
    description:
      "Como o conhecimento de transporte eletrônico se ajusta ao novo regime.",
  },
  {
    title: "Split Payment no frete interestadual",
    description:
      "Operacionalização, prazos e impacto no fluxo de caixa da transportadora.",
  },
  {
    title: "TAC PF/MEI e regimes específicos",
    description:
      "Tratamento tributário do transportador autônomo de cargas e enquadramentos.",
  },
  {
    title: "Planejamento e oportunidades estratégicas",
    description:
      "O que decidir agora, o que esperar, e onde estão as janelas de planejamento.",
  },
];
