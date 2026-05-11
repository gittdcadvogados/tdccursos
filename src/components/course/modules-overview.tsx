import { Card, CardContent } from "@/components/ui/card";
import { TechBackdrop } from "@/components/ui/tech-backdrop";

const modules = [
  {
    n: 1,
    title: "A Nova Tributação do Consumo",
    summary:
      "Fundamentos do IBS e da CBS — base conceitual para os módulos de incidência específica.",
    lessons: 8,
  },
  {
    n: 2,
    title: "IBS e CBS no Transporte Rodoviário de Cargas",
    summary:
      "Módulo central — incidência, operações especiais, split payment e formalização.",
    lessons: 11,
  },
  {
    n: 3,
    title: "IBS e CBS no Transporte de Passageiros",
    summary:
      "Intermunicipal, interestadual, internacional, urbano, fretamento e impacto contratual.",
    lessons: 5,
  },
  {
    n: 4,
    title: "Gestão de Créditos e Regimes Diferenciados",
    summary:
      "TAC PF e MEI, bens de capital, Simples Nacional, cooperativas, acúmulo e ressarcimento.",
    lessons: 11,
  },
  {
    n: 5,
    title: "ICMS na Transição",
    summary:
      "O que sobrevive, benefícios sem equivalente, litigiosidade de 2027 e Centro-Oeste.",
    lessons: 9,
  },
  {
    n: 6,
    title: "Obrigações Acessórias e Documentos Fiscais",
    summary:
      "CT-e, CT-e OS, MDF-e, GTV-e, EFD e governança fiscal. Inclui 2 oficinas práticas.",
    lessons: 10,
  },
  {
    n: 7,
    title: "Estratégia e Planejamento na Transição",
    summary:
      "Módulo de ação — Lucro Real x Presumido x Simples, precificação e blindagem jurídica.",
    lessons: 5,
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
            Da base conceitual da Reforma Tributária à precificação do frete e
            documentação preventiva contra autuações.
          </p>
        </header>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {modules.map((m) => (
            <Card
              key={m.n}
              className="group relative overflow-hidden p-6 transition hover:border-accent/40"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-accent/0 to-transparent transition group-hover:via-accent/60"
              />
              <CardContent className="p-0">
                <div className="flex items-start justify-between gap-4">
                  <span className="tech-mono text-2xl font-semibold tracking-tight text-foreground-muted transition group-hover:text-accent">
                    {m.n.toString().padStart(2, "0")}
                  </span>
                  <span className="tech-mono rounded-full border border-border bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground-muted">
                    {m.lessons.toString().padStart(2, "0")} aulas
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm text-foreground-muted">{m.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
