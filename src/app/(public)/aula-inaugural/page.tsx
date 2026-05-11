import type { Metadata } from "next";
import { PlayCircle } from "lucide-react";
import { DecisoesCriticas } from "@/components/course/decisoes-criticas";
import { AulaGate } from "./aula-gate";
import { isAulaInauguralUnlocked } from "./actions";

export const metadata: Metadata = {
  title: "Aula Inaugural Gratuita — TDC CURSOS",
  description:
    "Aula aberta ao público: por que esse curso, por que agora — o Regulamento IBS/CBS e o transporte rodoviário.",
};

type SearchParams = Promise<{ utm_source?: string; source?: string }>;

export default async function AulaInauguralPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const source = params.utm_source || params.source || null;

  const unlocked = await isAulaInauguralUnlocked();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-medium text-accent-soft-fg">
          <span className="tech-pulse h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="tech-mono uppercase tracking-wider">
            AULA_GRATUITA
          </span>
          <span className="opacity-60">·</span>
          <span>25 minutos</span>
        </span>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          Por que esse curso, por que agora
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-foreground-muted md:text-lg">
          O Regulamento IBS/CBS e o transporte rodoviário — uma introdução ao
          que muda, ao que urge e ao que ainda dá tempo de planejar.
        </p>
      </header>

      {unlocked ? <UnlockedState /> : <AulaGate source={source} />}
    </div>
  );
}

function UnlockedState() {
  return (
    <>
      {/* Player */}
      <div className="mt-10 aspect-video overflow-hidden rounded-2xl border border-border bg-surface-muted">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <PlayCircle className="mx-auto h-12 w-12 text-foreground-muted" />
            <p className="mt-3 text-sm text-foreground-muted">
              Player de vídeo (placeholder · Bunny Stream)
            </p>
            <p className="tech-mono mt-1 text-[11px] text-foreground-muted">
              ▸ video_guid · TODO
            </p>
          </div>
        </div>
      </div>

      {/* Decisões críticas — bloco do que o curso completo entrega */}
      <DecisoesCriticas maxWidth="narrow" padding="compact" />
    </>
  );
}
