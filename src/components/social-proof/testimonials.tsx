// =============================================================================
// PLACEHOLDER — depoimentos fictícios para o pré-lançamento.
// Substituir por feedback real de alunos da turma 1 antes do go-live público.
// Mantida a estética terminal + foco em decisões técnicas (não emoção).
// =============================================================================

import { Quote } from "lucide-react";

type Testimonial = {
  role: string;
  org: string;
  city: string;
  quote: string;
  author: string;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    role: "TRIBUTARISTA",
    org: "ESCRITÓRIO_PRÓPRIO",
    city: "São Paulo",
    quote:
      "Estava esperando alguém destrinchar o art. 254 da LC 214/2025 aplicado ao TAC sem rodeio. As aulas de crédito presumido fecharam o ciclo — saí com base pra estruturar três pareceres no mesmo mês.",
    author: "Marina Coelho",
    initials: "MC",
  },
  {
    role: "COORD_FISCAL",
    org: "TRANSPORTADORA",
    city: "Goiânia",
    quote:
      "O módulo de split payment me poupou de cair na armadilha do fluxo de caixa em 2027. Entendi onde o capital de giro vai apertar e antecipei a renegociação dos contratos de longo prazo.",
    author: "Carla Mendes",
    initials: "CM",
  },
  {
    role: "CONTADOR",
    org: "ESCRITÓRIO_CONTÁBIL",
    city: "Curitiba",
    quote:
      "Atendo 12 transportadoras e nenhum curso tinha entrado no SINIEF 24/2024 campo a campo. As oficinas de CT-e mudaram a forma como a equipe revisa documento fiscal.",
    author: "Ricardo Almeida",
    initials: "RA",
  },
];

export function Testimonials() {
  return (
    <section className="relative border-y border-border bg-surface-muted/40">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <header className="mx-auto max-w-2xl text-center">
          <span className="tech-mono inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <span>▸</span>
            VALIDAÇÃO_TÉCNICA
          </span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Construído com revisão de pares
          </h2>
          <p className="mt-4 text-foreground-muted">
            Conteúdo testado por profissionais que aplicam IBS, CBS e ICMS no
            dia a dia da operação. Feedback direto, sem polidez de press
            release.
          </p>
        </header>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.author}
              className="group relative flex flex-col rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/40 md:p-7"
            >
              {/* topo: role label tech-mono */}
              <div className="flex items-center gap-2 text-[10px]">
                <span className="tech-mono font-semibold uppercase tracking-wider text-accent">
                  ▸ {t.role}
                </span>
                <span className="text-border">·</span>
                <span className="tech-mono uppercase tracking-wider text-foreground-muted">
                  {t.org}
                </span>
              </div>

              <Quote
                aria-hidden
                className="mt-5 h-5 w-5 text-accent/40"
                strokeWidth={1.5}
              />

              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground md:text-base">
                {t.quote}
              </blockquote>

              <footer className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-soft-fg"
                >
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold tracking-tight">
                    {t.author}
                  </div>
                  <div className="tech-mono mt-0.5 text-[10px] uppercase tracking-wider text-foreground-muted">
                    {t.city}
                  </div>
                </div>
              </footer>
            </article>
          ))}
        </div>

        {/* Disclaimer discreto — alinhado com a estratégia "não enganar"
            do brand TDC. Trocar/remover quando houver depoimentos reais. */}
        <p className="tech-mono mt-8 text-center text-[10px] uppercase tracking-wider text-foreground-muted/70">
          ▸ depoimentos_da_turma_de_validação · nomes_e_local_alterados_a_pedido
        </p>
      </div>
    </section>
  );
}
