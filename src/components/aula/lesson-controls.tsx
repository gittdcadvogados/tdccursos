"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { markLessonCompleted } from "@/app/(player)/aula/actions";
import { cn } from "@/lib/utils";

type Props = {
  lessonId: string;
  lessonSlug: string;
  isCompleted: boolean;
  nextLesson: { slug: string; title: string } | null;
  /** O <BunnyPlayer /> renderizado no server. */
  children: React.ReactNode;
};

// Threshold em fração (0–1) — 80% do vídeo precisa estar assistido pra
// liberar o botão "Marcar concluída".
const THRESHOLD = 0.8;

export function LessonControls({
  lessonId,
  lessonSlug,
  isCompleted,
  nextLesson,
  children,
}: Props) {
  const [watchedPct, setWatchedPct] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  // Listener global pros eventos postMessage que o iframe do Bunny emite
  // enquanto o vídeo toca. Formato varia entre versões — tratamos defensivo.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const allowed = ["iframe.mediadelivery.net", "mediadelivery.net"];
      try {
        const origin = new URL(event.origin).hostname;
        if (!allowed.some((a) => origin.endsWith(a))) return;
      } catch {
        return;
      }

      const raw = event.data;
      if (!raw) return;

      // Bunny pode mandar string JSON ou objeto direto
      let payload: Record<string, unknown> | null = null;
      if (typeof raw === "string") {
        try {
          payload = JSON.parse(raw);
        } catch {
          return;
        }
      } else if (typeof raw === "object") {
        payload = raw as Record<string, unknown>;
      }
      if (!payload) return;

      const eventName = (payload.event ?? payload.name ?? "") as string;
      let currentTime: number | undefined;
      let duration: number | undefined;

      // Formato 1: { event: 'time' | 'timeupdate', time: 12.3, duration: 100 }
      if (typeof payload.time === "number") currentTime = payload.time;
      if (typeof payload.duration === "number") duration = payload.duration;

      // Formato 2: { event: 'timeupdate', data: { currentTime, duration } }
      const inner = payload.data as Record<string, unknown> | undefined;
      if (inner) {
        if (currentTime === undefined && typeof inner.currentTime === "number")
          currentTime = inner.currentTime;
        if (duration === undefined && typeof inner.duration === "number")
          duration = inner.duration;
      }

      // ended sempre considera 100%
      if (eventName === "ended" || eventName === "complete") {
        setWatchedPct(100);
        return;
      }

      if (
        currentTime !== undefined &&
        duration !== undefined &&
        duration > 0
      ) {
        const pct = Math.min(100, (currentTime / duration) * 100);
        setWatchedPct((prev) => Math.max(prev, pct));
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const canComplete = isCompleted || watchedPct >= THRESHOLD * 100;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!canComplete) {
      e.preventDefault();
      setShowWarning(true);
      // Auto-hide depois de 6s
      setTimeout(() => setShowWarning(false), 6000);
    }
  }

  return (
    <div className="space-y-4">
      {/* Player */}
      {children}

      {/* Barra de ações abaixo do player */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Esquerda — Próxima aula */}
        {nextLesson ? (
          <Link
            href={`/aula/${nextLesson.slug}`}
            className={cn(
              buttonVariants({ variant: "secondary", size: "md" }),
              "justify-between",
            )}
            title={nextLesson.title}
          >
            <span className="tech-mono text-xs uppercase tracking-wider opacity-80">
              Próxima aula
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span
            className={cn(
              buttonVariants({ variant: "secondary", size: "md" }),
              "cursor-default justify-center opacity-50",
            )}
          >
            <span className="tech-mono text-xs uppercase tracking-wider">
              Última aula do módulo
            </span>
          </span>
        )}

        {/* Direita — Marcar concluída */}
        {isCompleted ? (
          <span
            className={cn(
              buttonVariants({ size: "md" }),
              "cursor-default justify-center bg-accent-soft text-accent-soft-fg hover:bg-accent-soft",
            )}
          >
            <CheckCircle2 className="h-4 w-4" />
            Aula concluída
          </span>
        ) : (
          <form action={markLessonCompleted} onSubmit={handleSubmit}>
            <input type="hidden" name="lesson_id" value={lessonId} />
            <input type="hidden" name="lesson_slug" value={lessonSlug} />
            <Button
              type="submit"
              size="md"
              className={cn(
                "w-full justify-center",
                !canComplete && "opacity-60",
              )}
              title={
                canComplete
                  ? "Marcar aula como concluída"
                  : `Você precisa assistir pelo menos 80% (${Math.round(watchedPct)}% assistido)`
              }
            >
              <CheckCircle2 className="h-4 w-4" />
              Marcar concluída
            </Button>
          </form>
        )}
      </div>

      {/* Aviso quando tenta marcar sem 80% */}
      {showWarning && (
        <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">
              Assista pelo menos {Math.round(THRESHOLD * 100)}% da aula
            </p>
            <p className="text-xs opacity-90">
              Você assistiu {Math.round(watchedPct)}% até agora. Continue a
              aula até atingir {Math.round(THRESHOLD * 100)}% pra marcá-la
              como concluída.
            </p>
          </div>
        </div>
      )}

      {/* Indicador de progresso de visualização (somente se ainda não concluída) */}
      {!isCompleted && watchedPct > 0 && (
        <div className="flex items-center gap-2 text-[11px] text-foreground-muted">
          <span className="tech-mono uppercase tracking-wider">
            ▸ assistido:
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                canComplete ? "bg-accent" : "bg-foreground-muted",
              )}
              style={{ width: `${watchedPct}%` }}
            />
          </div>
          <span className="tech-mono w-10 text-right tabular-nums">
            {Math.round(watchedPct)}%
          </span>
        </div>
      )}
    </div>
  );
}
