import Image from "next/image";
import { BookOpen, PlayCircle } from "lucide-react";
import { TechBackdrop } from "@/components/ui/tech-backdrop";

type ModuleEntry = {
  n: number;
  title: string;
  summary: string;
  lessons: number;
  /**
   * URL da capa do módulo. Sobe a imagem em /public/img/modulos/ ou hospeda
   * externamente. Quando null, mostra fallback tech (grid + glow + MOD_XX).
   */
  image?: string | null;
};

const modules: ModuleEntry[] = [
  {
    n: 1,
    title: "A Nova Tributação do Consumo",
    summary:
      "Da CF/88 ao IBS/CBS: arquitetura do tributo dual, não cumulatividade ampla e cronograma 2026–2033.",
    lessons: 8,
    image: null,
  },
  {
    n: 2,
    title: "IBS e CBS no Transporte Rodoviário de Cargas",
    summary:
      "Incidência sobre frete, subcontratação, redespacho, exportação e multimodal — com split payment e o fim da informalidade no setor.",
    lessons: 11,
    image: null,
  },
  {
    n: 3,
    title: "IBS e CBS no Transporte de Passageiros",
    summary:
      "Incidência no transporte intermunicipal, interestadual, internacional e urbano — com imunidade do transporte público, fretamento e revisão de contratos de longo prazo.",
    lessons: 5,
    image: null,
  },
  {
    n: 4,
    title: "Gestão de Créditos e Regimes Diferenciados",
    summary:
      "Crédito presumido do TAC pessoa física e MEI, bens de capital, Simples Nacional, cooperativas e gestão do crédito acumulado na transição.",
    lessons: 11,
    image: null,
  },
  {
    n: 5,
    title: "ICMS na Transição",
    summary:
      "Coexistência com IBS/CBS, benefícios sem equivalente, ressarcimento em 20 anos e o ICMS na base do novo imposto em 2027.",
    lessons: 9,
    image: null,
  },
  {
    n: 6,
    title: "Obrigações Acessórias e Documentos Fiscais",
    summary:
      "CT-e e CT-e OS no padrão SINIEF 24/2024, MDF-e, GTV-e, EFD e a extinção do EFD-Contribuições. Inclui 2 oficinas práticas.",
    lessons: 10,
    image: null,
  },
  {
    n: 7,
    title: "Estratégia e Planejamento na Transição",
    summary:
      "Lucro Real, Presumido e Simples; Simples Híbrido; precificação do frete; split payment no caixa; blindagem jurídica contra autuação.",
    lessons: 5,
    image: null,
  },
];

export function ModulesOverview() {
  return (
    <section className="relative">
      <TechBackdrop pattern="none" glow="top" />
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <header className="mx-auto max-w-2xl text-center">
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

        <div className="mx-auto mt-12 max-w-4xl space-y-6">
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
                    </span>
                  </div>
                </div>

                {/* Imagem grande */}
                <div className="relative aspect-12/5 w-full overflow-hidden bg-surface-muted">
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
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
                        className="tech-mono pointer-events-none absolute inset-0 flex items-center justify-center text-8xl font-bold uppercase tracking-tighter text-accent/15"
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
                </div>

                {/* Summary */}
                <div className="px-5 py-5 md:px-6 md:py-6">
                  <p className="text-sm text-foreground-muted md:text-[15px]">
                    {m.summary}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
