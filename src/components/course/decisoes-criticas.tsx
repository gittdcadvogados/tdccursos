import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

type Capacidade = {
  title: string;
  description: string;
};

const CAPACIDADES: Capacidade[] = [
  {
    title: "Comparar regimes tributários no novo cenário.",
    description:
      "Simulação técnica entre Lucro Real, Presumido, Simples e Simples Híbrido, com critérios objetivos para a decisão de setembro de 2026.",
  },
  {
    title: "Estruturar repasse contratual da carga tributária.",
    description:
      "Cálculo do impacto da Reforma no preço cobrado, com modelo de cláusula de revisão e roteiro de renegociação com clientes.",
  },
  {
    title: "Preparar o caixa para o split payment.",
    description:
      "Mapeamento da exposição da empresa ao split, com plano de adequação do capital de giro nos doze meses anteriores à entrada em vigor.",
  },
  {
    title: "Habilitar e gerir o crédito acumulado de ICMS.",
    description:
      "Processo de habilitação dentro do prazo de 2028, com gestão do ressarcimento em 20 anos corrigido pelo IPCA.",
  },
  {
    title: "Documentar a operação contra o conflito de 2027.",
    description:
      "Construção da prova documental que sustenta a posição da empresa em caso de autuação sobre o ICMS na base do IBS e da CBS.",
  },
];

type Props = {
  /** Esconde o bloco de CTAs no final (útil em páginas que já têm CTA dedicada). */
  hideCtas?: boolean;
  /** Largura máxima do container interno. Padrão `max-w-content` (1360px). */
  maxWidth?: "content" | "narrow";
  /** Padding vertical da seção. */
  padding?: "section" | "compact";
  /** Layout 2 colunas — texto à esquerda, vídeo à direita. */
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
        <span className="inline-flex items-center gap-2 text-sm font-medium text-accent">
          <span>▸</span>
          Da norma à decisão, na operação real
        </span>
        <h2 className="tech-mono mt-3 text-balance text-2xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          O_QUE_VOCE_VAI_APRENDER
        </h2>
        <p className="mt-4 text-pretty text-foreground-muted md:text-lg">
          O programa não para na explicação da lei. Cada módulo termina em uma
          capacidade técnica que o profissional aplica na rotina da empresa ou
          do escritório, antes que cada prazo da transição vire problema.
        </p>
      </header>

      <ul
        className={
          withVisual
            ? "mt-10 grid gap-4"
            : "mt-10 grid gap-4 md:grid-cols-2"
        }
      >
        {CAPACIDADES.map((c, idx) => (
          <li
            key={idx}
            className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5 md:p-6"
          >
            <span
              className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-white"
              aria-hidden
            >
              <Check className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold leading-snug text-foreground md:text-base">
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted md:text-[15px]">
                {c.description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {!hideCtas && (
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row md:items-start md:justify-start">
          <Link
            href="/cadastro"
            className={buttonVariants({ size: "lg" })}
          >
            Se inscrever
            <ArrowRight />
          </Link>
        </div>
      )}
    </>
  );

  return (
    <section
      className={
        withVisual
          ? "relative border-y border-border bg-surface-muted"
          : "relative"
      }
    >
      <div className={`mx-auto ${containerWidth} px-6 ${sectionPadding}`}>
        {withVisual ? (
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
            <div>{content}</div>

            {/* Coluna 2 — imagem ilustrativa */}
            <div className="relative w-full md:sticky md:top-24">
              <div
                aria-hidden
                className="glow-emerald absolute -inset-6 -z-10 opacity-40"
              />
              <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl border border-border bg-zinc-950">
                <Image
                  src="/IMG/o-que-voce-aprende-v2.webp"
                  alt="O que você sai fazendo no PAT TDC"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
                {/* Brackets de canto (HUD frame) */}
                <span
                  aria-hidden
                  className="absolute left-3 top-3 h-3 w-3 border-l border-t border-accent/70"
                />
                <span
                  aria-hidden
                  className="absolute right-3 top-3 h-3 w-3 border-r border-t border-accent/70"
                />
                <span
                  aria-hidden
                  className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-accent/70"
                />
                <span
                  aria-hidden
                  className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-accent/70"
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
