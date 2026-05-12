import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TechBackdrop } from "@/components/ui/tech-backdrop";
import { TerminalLog } from "@/components/ui/terminal-log";

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
    <section className="dark-zone relative isolate overflow-hidden bg-zinc-950 text-zinc-50">
      {/* Vídeo de fundo (MP4 local auto-hospedado, 1MB) — blur + scale pra esconder bordas borradas */}
      <video
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/IMG/hero-bg-poster.webp"
        className="pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover"
      >
        <source src="/IMG/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* Lente escura por cima */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-zinc-950/85"
      />
      {/* Vinheta — escurece bordas pra dar foco ao centro */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-radial-[ellipse_at_center] from-zinc-950/40 via-zinc-950/75 to-zinc-950"
      />
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
            <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-linear-to-l from-background to-transparent" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* Coluna 1 — info principal */}
          <div className="text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-medium text-accent-soft-fg">
              <span className="tech-pulse h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="tech-mono uppercase tracking-wider">
                PAT_2026
              </span>
              <span className="opacity-60">·</span>
              <span>Programa de Adaptação Tributária</span>
            </span>

            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Programa de{" "}
              <span className="text-accent">Adaptação Tributária</span>
            </h1>

            <p className="tech-mono mt-3 text-[11px] uppercase tracking-[0.18em] text-foreground-muted">
              ▸ Programa de Adaptação Tributária — <span className="text-accent">PAT TDC</span>
            </p>

            <p className="mt-5 max-w-2xl text-pretty text-base text-foreground-muted md:text-lg">
              IBS, CBS e ICMS aplicados à operação real, da incidência ao
              CT-e, do crédito ao planejamento da transição 2026–2033. São
              sete módulos que vão do fundamento conceitual à decisão
              estratégica, com aprofundamento no transporte rodoviário de
              cargas e de passageiros.
            </p>

            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
              <Link
                href="/cadastro"
                className={buttonVariants({ size: "lg" })}
              >
                Inscrever-se no programa
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

          {/* Coluna 2 — TerminalLog */}
          <div className="w-full">
            <TerminalLog />
          </div>
        </div>
      </div>
    </section>
  );
}
