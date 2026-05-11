import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
} from "lucide-react";
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
  defaultOpen?: boolean;
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
  defaultOpen = false,
}: Props) {
  const lessonsTotal = lessons.length;
  const lessonsDone = lessons.filter((l) => completedLessonIds.has(l.id)).length;
  const isComplete = lessonsTotal > 0 && lessonsDone === lessonsTotal;
  const totalSeconds = lessons.reduce(
    (acc, l) => acc + (l.duration_seconds ?? 0),
    0,
  );
  const cleanTitle = stripModulePrefix(title);
  const mod = position.toString().padStart(2, "0");

  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent/40"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 md:gap-4 md:px-5 md:py-4">
        {/* Toggle */}
        <span
          aria-hidden
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border bg-background text-foreground-muted transition group-open:rotate-45 group-open:border-accent/40 group-open:text-accent"
        >
          <Plus className="h-3.5 w-3.5" />
        </span>

        {/* Título */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
              MOD_{mod}
            </span>
            {isComplete && (
              <span className="tech-mono inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent-soft px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent-soft-fg">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Completo
              </span>
            )}
          </div>
          <h3 className="mt-0.5 truncate text-sm font-semibold tracking-tight md:text-base">
            {cleanTitle}
          </h3>
        </div>

        {/* Pill: aulas · duração */}
        <span className="tech-mono inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground-muted md:text-[11px]">
          <span>
            {lessonsTotal.toString().padStart(2, "0")} aulas
          </span>
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {formatTotalDuration(totalSeconds)}
          </span>
        </span>
      </summary>

      {/* Aulas */}
      {lessonsTotal > 0 && (
        <ul className="border-t border-border bg-background/40">
          {lessons.map((l) => {
            const done = completedLessonIds.has(l.id);
            const isWorkshop = l.slug.startsWith("oficina");
            const mins = l.duration_seconds
              ? Math.round(l.duration_seconds / 60)
              : null;

            return (
              <li key={l.id} className="border-b border-border last:border-b-0">
                <Link
                  href={`/aula/${l.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-surface-muted md:gap-4 md:px-5"
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
          <li className="border-t border-border bg-surface/50 px-4 py-2.5 md:px-5">
            <Link
              href={`/modulo/${slug}`}
              className="tech-mono inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent transition hover:text-accent/80"
            >
              ▸ Ver detalhes do módulo →
            </Link>
          </li>
        </ul>
      )}
    </details>
  );
}
