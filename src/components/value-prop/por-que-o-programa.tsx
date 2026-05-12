import Link from "next/link";
import { ArrowRight, Check, PlayCircle, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

type Pair = {
  problem: string;
  solution: string;
};

const PAIRS: Pair[] = [
  {
    problem:
      "CT-e preenchido no padrão antigo, com risco de glosa do crédito a partir de 2027.",
    solution:
      "CT-e e CT-e OS preenchidos no padrão SINIEF 24/2024, campo a campo, em oficina prática gravada.",
  },
  {
    problem:
      "Crédito acumulado de ICMS sem habilitação até 2028, perdido no ressarcimento de 20 anos.",
    solution:
      "Crédito acumulado de ICMS habilitado até 2028, com ressarcimento em 20 anos corrigido pelo IPCA.",
  },
  {
    problem:
      "Frete precificado sem ajuste de carga tributária, com margem corroída em 2027.",
    solution:
      "Cálculo do aumento de carga tributária, repasse contratual estruturado e renegociação preparada antes de 2027.",
  },
  {
    problem:
      "Decisão pelo Simples Híbrido tomada no escuro, no prazo de setembro de 2026.",
    solution:
      "Simulação dos três regimes antes de setembro de 2026, com critério técnico de escolha pelo Simples Híbrido.",
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

        {/* Cabeçalho das colunas */}
        <div className="mt-12 hidden grid-cols-[1fr_auto_1fr] items-center gap-4 md:grid">
          <div className="tech-mono inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
            <X className="h-3.5 w-3.5" />
            Sem preparo
          </div>
          <div aria-hidden className="h-px w-6 bg-border" />
          <div className="tech-mono inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            <Check className="h-3.5 w-3.5" />
            Com o PAT
          </div>
        </div>

        {/* Pares */}
        <ul className="mt-4 space-y-4 md:space-y-3">
          {PAIRS.map((p, i) => (
            <li
              key={i}
              className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]"
            >
              {/* Problema */}
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background/60 p-4 md:p-5">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface text-foreground-muted ring-1 ring-border"
                >
                  <X className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="tech-mono mb-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-foreground-muted md:hidden">
                    ▸ SEM_PREPARO
                  </span>
                  <p className="text-sm text-foreground-muted md:text-[15px]">
                    {p.problem}
                  </p>
                </div>
              </div>

              {/* Conector seta (só desktop) */}
              <div
                aria-hidden
                className="hidden items-center justify-center md:flex"
              >
                <ArrowRight className="h-5 w-5 text-accent/70" />
              </div>

              {/* Solução */}
              <div className="flex items-start gap-3 rounded-xl border border-accent/30 bg-accent-soft/40 p-4 md:p-5">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-white"
                >
                  <Check className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="tech-mono mb-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-accent md:hidden">
                    ▸ COM_O_PAT
                  </span>
                  <p className="text-sm font-medium text-foreground md:text-[15px]">
                    {p.solution}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row md:items-start md:justify-start">
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
