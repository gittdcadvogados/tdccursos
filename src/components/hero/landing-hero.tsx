import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TechBackdrop } from "@/components/ui/tech-backdrop";

const tickerItems = [
  "IBS",
  "CBS",
  "ICMS",
  "LC 214/2025",
  "SINIEF 24/2024",
  "CT-e",
  "Split Payment",
  "TAC PF/MEI",
  "Reforma 2026–2033",
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <TechBackdrop pattern="grid-fade" glow="center" />

      {/* ticker tech no topo */}
      <div className="border-b border-border/60 bg-background/40 backdrop-blur">
        <div className="mx-auto flex max-w-content items-center gap-3 px-6 py-2 text-xs">
          <span className="tech-pulse inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="tech-mono shrink-0 text-foreground-muted">
            CURSO_v2.0
          </span>
          <span className="text-border">·</span>
          <div className="relative flex flex-1 overflow-hidden">
            <div className="tech-marquee flex shrink-0 gap-6 whitespace-nowrap pr-6">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="tech-mono text-foreground-muted">
                  {item}
                </span>
              ))}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-medium text-accent-soft-fg">
            <span className="tech-pulse h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="tech-mono uppercase tracking-wider">
              Curso completo
            </span>
            <span className="opacity-60">·</span>
            <span>Reforma Tributária 2026–2033</span>
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Tributação do Transporte Rodoviário na{" "}
            <span className="text-accent">Reforma Tributária</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-foreground-muted md:text-lg">
            IBS, CBS e ICMS aplicados ao transporte de cargas e passageiros —
            da incidência ao CT-e, do crédito ao planejamento da transição
            2026–2033. Com Rafael Vieira, fiscal de tributos estaduais
            licenciado.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/cadastro"
              className={buttonVariants({ size: "lg" })}
            >
              Inscrever-se no curso
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

          <p className="tech-mono mt-4 text-xs text-foreground-muted">
            <span className="text-accent">▸</span> aula_inaugural · sem_cadastro
            · 25min
          </p>
        </div>
      </div>
    </section>
  );
}
