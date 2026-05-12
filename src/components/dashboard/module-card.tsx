import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  PlayCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type LessonPreview = {
  id: string;
  slug: string;
  title: string;
  position: number;
  duration_seconds: number | null;
};

type Props = {
  slug: string;
  position: number;
  title: string;
  lessons: LessonPreview[];
  completedLessonIds: Set<string>;
  coverUrl?: string | null;
};

function stripModulePrefix(title: string) {
  return title.replace(/^M[oó]dulo\s+\d+\s*[—-]\s*/i, "").trim();
}

function formatTotalDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "—";
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.round((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins.toString().padStart(2, "0")}min`;
  return `${mins}min`;
}

export function ModuleCard({
  slug,
  position,
  title,
  lessons,
  completedLessonIds,
  coverUrl,
}: Props) {
  const lessonsTotal = lessons.length;
  const lessonsDone = lessons.filter((l) => completedLessonIds.has(l.id)).length;
  const isComplete = lessonsTotal > 0 && lessonsDone === lessonsTotal;
  const totalSeconds = lessons.reduce(
    (acc, l) => acc + (l.duration_seconds ?? 0),
    0,
  );
  const pct = lessonsTotal > 0 ? Math.round((lessonsDone / lessonsTotal) * 100) : 0;
  const cleanTitle = stripModulePrefix(title);
  const mod = position.toString().padStart(2, "0");

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-accent/40 hover:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.25)]">
      {/* Header */}
      <div className="border-b border-border bg-surface-muted/40 px-5 py-4 md:px-6 md:py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
              MOD_{mod}
            </span>
            <Link href={`/modulo/${slug}`}>
              <h3 className="mt-1 text-xl font-semibold leading-tight tracking-tight transition hover:text-accent md:text-2xl">
                {cleanTitle}
              </h3>
            </Link>
          </div>
          <span className="tech-mono shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground-muted">
            <span>{lessonsTotal.toString().padStart(2, "0")} aulas</span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {formatTotalDuration(totalSeconds)}
            </span>
          </span>
        </div>

        {/* Progresso */}
        <div className="mt-4 space-y-1">
          <Progress value={pct} />
          <div className="flex items-center justify-between text-[10px]">
            <span className="tech-mono text-foreground-muted">
              {lessonsDone.toString().padStart(2, "0")} /{" "}
              {lessonsTotal.toString().padStart(2, "0")} concluídas
            </span>
            <span
              className={
                isComplete
                  ? "tech-mono font-semibold text-accent"
                  : "tech-mono text-foreground-muted"
              }
            >
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Imagem grande */}
      <Link
        href={`/modulo/${slug}`}
        className="relative block aspect-12/5 w-full overflow-hidden bg-surface-muted"
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={cleanTitle}
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

        {/* Badge "Completo" no canto */}
        {isComplete && (
          <span className="tech-mono absolute right-4 top-4 inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <CheckCircle2 className="h-3 w-3" />
            Completo
          </span>
        )}
      </Link>

      {/* Lista de aulas */}
      {lessonsTotal > 0 && (
        <ul className="divide-y divide-border">
          {lessons.map((l) => {
            const done = completedLessonIds.has(l.id);
            const isWorkshop = l.slug.startsWith("oficina");
            const mins = l.duration_seconds
              ? Math.round(l.duration_seconds / 60)
              : null;

            return (
              <li key={l.id}>
                <Link
                  href={`/aula/${l.slug}`}
                  className="flex items-center gap-3 px-5 py-3 transition hover:bg-surface-muted md:px-6"
                >
                  <span
                    className={cn(
                      "shrink-0",
                      done ? "text-accent" : "text-foreground-muted",
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </span>
                  <span className="tech-mono shrink-0 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                    {isWorkshop
                      ? `OFICINA_${l.slug.replace("oficina-", "").padStart(2, "0")}`
                      : `AULA_${l.position.toString().padStart(2, "0")}`}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {l.title}
                  </span>
                  {mins !== null && (
                    <span className="tech-mono shrink-0 inline-flex items-center gap-1 text-[11px] text-foreground-muted">
                      <Clock className="h-3 w-3" />
                      {mins}min
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer */}
      <Link
        href={`/modulo/${slug}`}
        className="tech-mono inline-flex items-center justify-between border-t border-border bg-surface-muted/30 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-accent transition hover:bg-accent-soft/40 md:px-6"
      >
        <span>▸ Ver detalhes do módulo</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
