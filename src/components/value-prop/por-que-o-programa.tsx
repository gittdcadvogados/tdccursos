import Link from "next/link";
import { ArrowDown, ArrowRight, Check, PlayCircle, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

type Pair = {
  topic: string;
  risk: string;
  fix: string;
};

const PAIRS: Pair[] = [
  {
    topic: "CT-e",
    risk: "CT-e preenchido no padrão antigo, com risco de glosa do crédito a partir de 2027.",
    fix: "CT-e e CT-e OS preenchidos no padrão SINIEF 24/2024, campo a campo, em oficina prática gravada.",
  },
  {
    topic: "Crédito de ICMS",
    risk: "Crédito acumulado de ICMS sem habilitação até 2028, perdido no ressarcimento de 20 anos.",
    fix: "Crédito acumulado de ICMS habilitado até 2028, com ressarcimento em 20 anos corrigido pelo IPCA.",
  },
  {
    topic: "Frete",
    risk: "Frete precificado sem ajuste de carga tributária, com margem corroída em 2027.",
    fix: "Cálculo do aumento de carga tributária, repasse contratual estruturado e renegociação preparada antes de 2027.",
  },
  {
    topic: "Simples Híbrido",
    risk: "Decisão pelo Simples Híbrido tomada no escuro, no prazo de setembro de 2026.",
    fix: "Simulação dos três regimes antes de setembro de 2026, com critério técnico de escolha pelo Simples Híbrido.",
  },
];

export function PorQueOPrograma() {
  return (
    <section className="relative border-y border-border bg-surface-muted/30">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <header className="mx-auto max-w-3xl text-center md:mx-0 md:text-left">
          <span className="tech-mono inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <span>▸</span>
            POR_QUE_O_PROGRAMA
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            A transição não perdoa improviso
          </h2>
          <p className="mt-4 text-pretty text-foreground-muted md:text-lg">
            Entre 2026 e 2033, cada decisão fiscal do seu cliente, ou do seu
            caixa, passa por IBS, CBS e pelo que sobra do ICMS. O Programa de
            Adaptação Tributária organiza essas decisões em sete módulos.
          </p>
        </header>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 md:gap-6">
          {PAIRS.map((p, i) => (
            <li
              key={p.topic}
              className="relative flex flex-col rounded-2xl border border-border bg-surface p-5 md:p-6"
            >
              {/* Header do card */}
              <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
                <span className="tech-mono inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  <span>▸</span>
                  {p.topic}
                </span>
                <span className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-foreground-muted opacity-60">
                  {String(i + 1).padStart(2, "0")} / {String(PAIRS.length).padStart(2, "0")}
                </span>
              </div>

              {/* Antes — sem o PAT */}
              <div className="mt-4">
                <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
                  <span
                    aria-hidden
                    className="grid h-5 w-5 place-items-center rounded-full bg-surface-muted ring-1 ring-border"
                  >
                    <X className="h-3 w-3" />
                  </span>
                  Sem o PAT
                </span>
                <p className="text-[15px] leading-relaxed text-foreground-muted">
                  {p.risk}
                </p>
              </div>

              {/* Conector de transformação */}
              <div
                aria-hidden
                className="my-4 flex items-center gap-3"
              >
                <span className="h-px flex-1 bg-border" />
                <span className="tech-mono inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-soft-fg">
                  <ArrowDown className="h-3 w-3" />
                  vira
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              {/* Depois — com o PAT */}
              <div className="rounded-xl border border-accent/30 bg-accent-soft/50 p-4">
                <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-soft-fg">
                  <span
                    aria-hidden
                    className="grid h-5 w-5 place-items-center rounded-full bg-accent text-white"
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  Com o PAT TDC
                </span>
                <p className="text-[15px] font-medium leading-relaxed text-foreground">
                  {p.fix}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row md:items-start md:justify-start">
          <Link href="/sobre" className={buttonVariants({ size: "lg" })}>
            Ver grade completa
            <ArrowRight />
          </Link>
          <Link
            href="/aula-inaugural"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            <PlayCircle />
            Assistir aula gratuita
          </Link>
        </div>
      </div>
    </section>
  );
}
