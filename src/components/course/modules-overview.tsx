import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock, PlayCircle } from "lucide-react";
import { TechBackdrop } from "@/components/ui/tech-backdrop";

type ModuleEntry = {
  n: number;
  slug: string;
  title: string;
  lessons: number;
  /** Formato "Xh YYmin" — pré-calculado por módulo. */
  duration: string;
  /**
   * URL da capa do módulo. Sobe a imagem em /public/img/modulos/ ou hospeda
   * externamente. Quando null, mostra fallback tech (grid + glow + MOD_XX).
   */
  image?: string | null;
};

const modules: ModuleEntry[] = [
  {
    n: 1,
    slug: "tributacao-do-consumo",
    title: "A Nova Tributação do Consumo",
    lessons: 8,
    duration: "2h 50min",
    image: null,
  },
  {
    n: 2,
    slug: "cargas",
    title: "IBS e CBS no Transporte Rodoviário de Cargas",
    lessons: 11,
    duration: "4h 45min",
    image: null,
  },
  {
    n: 3,
    slug: "passageiros",
    title: "IBS e CBS no Transporte de Passageiros",
    lessons: 5,
    duration: "1h 55min",
    image: null,
  },
  {
    n: 4,
    slug: "creditos",
    title: "Gestão de Créditos e Regimes Diferenciados",
    lessons: 11,
    duration: "4h 50min",
    image: null,
  },
  {
    n: 5,
    slug: "icms-transicao",
    title: "ICMS na Transição",
    lessons: 9,
    duration: "3h 45min",
    image: null,
  },
  {
    n: 6,
    slug: "obrigacoes-acessorias",
    title: "Obrigações Acessórias e Documentos Fiscais",
    lessons: 10,
    duration: "4h 45min",
    image: null,
  },
  {
    n: 7,
    slug: "estrategia",
    title: "Estratégia e Planejamento na Transição",
    lessons: 5,
    duration: "2h 30min",
    image: null,
  },
];

export function ModulesOverview() {
  return (
    <section className="relative">
      <TechBackdrop pattern="none" glow="top" />
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <header className="mx-auto max-w-2xl text-center md:mx-0 md:text-left">
          <span className="tech-mono inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <span>▸</span>
            CONTEUDO_DO_CURSO
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            7 módulos do fundamento à decisão estratégica
          </h2>
          <p className="mt-4 text-foreground-muted">
            Da base conceitual do tributo dual à precificação do frete e à
            documentação preventiva contra autuações.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const mod = m.n.toString().padStart(2, "0");
            return (
              <article
                key={m.n}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-accent/40 hover:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.25)]"
              >
                {/* Header */}
                <div className="border-b border-border bg-surface-muted/40 px-5 py-4 md:px-6 md:py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
                        MOD_{mod}
                      </span>
                      <h3 className="mt-1 text-xl font-semibold leading-tight tracking-tight md:text-2xl">
                        {m.title}
                      </h3>
                    </div>
                    <span className="tech-mono shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground-muted">
                      <BookOpen className="h-3 w-3" />
                      {m.lessons.toString().padStart(2, "0")} aulas
                      <span className="text-border">·</span>
                      <Clock className="h-2.5 w-2.5" />
                      {m.duration}
                    </span>
                  </div>
                </div>

                {/* Imagem */}
                <Link
                  href={`/modulo/${m.slug}`}
                  className="relative block aspect-12/5 w-full overflow-hidden bg-surface-muted"
                >
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 700px"
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="absolute inset-0">
                      <div
                        aria-hidden
                        className="bg-grid-fade absolute inset-0 text-border opacity-60"
                      />
                      <div
                        aria-hidden
                        className="glow-emerald absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 opacity-50"
                      />
                      <div
                        aria-hidden
                        className="tech-mono pointer-events-none absolute inset-0 flex items-center justify-center text-7xl font-bold uppercase tracking-tighter text-accent/15 md:text-8xl"
                      >
                        MOD_{mod}
                      </div>
                    </div>
                  )}

                  {/* Play icon central */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full border border-white/40 bg-black/40 text-white shadow-lg backdrop-blur-sm transition group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/80">
                      <PlayCircle className="h-7 w-7" />
                    </span>
                  </div>
                </Link>

                {/* Footer */}
                <Link
                  href={`/modulo/${m.slug}`}
                  className="tech-mono mt-auto inline-flex items-center justify-between border-t border-border bg-surface-muted/30 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-accent transition hover:bg-accent-soft/40 md:px-6"
                >
                  <span>▸ Ver detalhes do módulo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
