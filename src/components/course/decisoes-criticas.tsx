import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const BULLETS = [
  "Comparar Lucro Real, Presumido e Simples para transportadoras à luz da Reforma — critérios e simulação",
  "Decidir pela adesão ao Simples Híbrido até setembro/2026 com base em cálculo de impacto",
  "Calcular o aumento de carga tributária no frete e estruturar o repasse contratual antes da renegociação",
  "Mapear a exposição ao split payment e preparar o capital de giro com 12 meses de antecedência",
  "Avaliar a continuidade dos benefícios de ICMS no Centro-Oeste e o crédito outorgado do TRC em Mato Grosso",
  "Construir documentação preventiva para o conflito do ICMS na base do IBS/CBS em 2027",
];

type Props = {
  /** Esconde o bloco de CTAs no final (útil em páginas que já têm CTA dedicada). */
  hideCtas?: boolean;
  /** Largura máxima do container interno. Padrão `max-w-content` (1360px). */
  maxWidth?: "content" | "narrow";
  /** Padding vertical da seção. */
  padding?: "section" | "compact";
  /** Layout 2 colunas — texto à esquerda, slot pra GIF à direita. */
  withVisual?: boolean;
};

export function DecisoesCriticas({
  hideCtas = false,
  maxWidth = "content",
  padding = "section",
  withVisual = false,
}: Props) {
  const containerWidth =
    maxWidth === "narrow" ? "max-w-4xl" : "max-w-content";
  const sectionPadding =
    padding === "compact" ? "py-12 md:py-16" : "py-20 md:py-24";

  const content = (
    <>
      <header
        className={
          withVisual
            ? "text-center md:text-left"
            : "mx-auto max-w-3xl text-center md:mx-0 md:text-left"
        }
      >
        <span className="tech-mono inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          <span>▸</span>
          DECISÕES_2026_2027
        </span>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          As decisões críticas da transição que você vai dominar
        </h2>
        <p className="mt-4 text-pretty text-foreground-muted md:text-lg">
          Setembro/2026 marca a opção pelo Simples Híbrido; 2027 inicia o
          split payment. Cada escolha aqui define a carga tributária da
          transportadora pelos próximos sete anos.
        </p>
      </header>

      <ul
        className={
          withVisual
            ? "mt-10 grid gap-3 md:gap-4"
            : "mt-10 grid gap-3 md:grid-cols-2 md:gap-4"
        }
      >
        {BULLETS.map((b, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 md:p-5"
          >
            <span
              className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-soft-fg"
              aria-hidden
            >
              <Check className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm leading-snug text-foreground md:text-base">
              {b}
            </p>
          </li>
        ))}
      </ul>

      {!hideCtas && (
        <>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row md:items-start md:justify-start">
            <Link
              href="/cadastro"
              className={buttonVariants({ size: "lg" })}
            >
              Inscrever-se no curso
              <ArrowRight />
            </Link>
            <Link
              href="/sobre"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Ver grade completa
            </Link>
          </div>
          <p className="tech-mono mt-4 text-center text-xs text-foreground-muted md:text-left">
            <span className="text-accent">▸</span> módulo_07 · estratégia ·
            5_aulas · ao_vivo
          </p>
        </>
      )}
    </>
  );

  return (
    <section className="relative">
      <div className={`mx-auto ${containerWidth} px-6 ${sectionPadding}`}>
        {withVisual ? (
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
            <div>{content}</div>

            {/* Coluna 2 — slot pro GIF */}
            <div className="relative w-full md:sticky md:top-24">
              <div
                aria-hidden
                className="glow-emerald absolute -inset-6 -z-10 opacity-40"
              />
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-dashed border-border bg-surface-muted/40">
                <div
                  aria-hidden
                  className="bg-grid-fade absolute inset-0 text-border/50"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <span className="tech-mono block text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted opacity-70">
                      ▸ GIF_PENDENTE
                    </span>
                    <span className="tech-mono mt-2 block text-[9px] uppercase tracking-wider text-foreground-muted opacity-50">
                      decisões_2026_2027.gif
                    </span>
                  </div>
                </div>
                {/* Brackets de canto */}
                <span
                  aria-hidden
                  className="absolute left-3 top-3 h-3 w-3 border-l border-t border-accent/60"
                />
                <span
                  aria-hidden
                  className="absolute right-3 top-3 h-3 w-3 border-r border-t border-accent/60"
                />
                <span
                  aria-hidden
                  className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-accent/60"
                />
                <span
                  aria-hidden
                  className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-accent/60"
                />
              </div>
            </div>
          </div>
        ) : (
          content
        )}
      </div>
    </section>
  );
}
