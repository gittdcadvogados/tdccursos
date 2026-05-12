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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-accent/40 hover:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.25)] md:flex-row">
      {/* Imagem */}
      <Link
        href={`/modulo/${slug}`}
        className="relative block aspect-video w-full shrink-0 overflow-hidden bg-surface-muted md:aspect-auto md:h-auto md:w-72 md:self-stretch lg:w-80"
      >
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={cleanTitle}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0">
            <div
              aria-hidden
              className="bg-grid-fade absolute inset-0 text-border opacity-60"
            />
            <div
              aria-hidden
              className="glow-emerald absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 opacity-50"
            />
            <div
              aria-hidden
              className="tech-mono pointer-events-none absolute inset-0 flex items-center justify-center text-6xl font-bold uppercase tracking-tighter text-accent/20 md:text-7xl"
            >
              MOD_{mod}
            </div>
          </div>
        )}

        {/* Overlay com badges */}
        <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/65 via-black/10 to-transparent p-4">
          <div className="flex w-full items-center justify-between gap-2">
            <span className="tech-mono inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              <span className="tech-pulse h-1.5 w-1.5 rounded-full bg-accent" />
              MOD_{mod}
            </span>
            {isComplete && (
              <span className="tech-mono inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                <CheckCircle2 className="h-3 w-3" />
                Completo
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-border bg-surface-muted/40 px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <Link href={`/modulo/${slug}`} className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold leading-tight tracking-tight transition hover:text-accent md:text-xl">
                {cleanTitle}
              </h3>
            </Link>
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
          <div className="mt-3 space-y-1">
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

        {/* Lista de aulas */}
        {lessonsTotal > 0 && (
          <ul className="flex-1 divide-y divide-border">
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
                    className="flex items-center gap-3 px-5 py-2.5 transition hover:bg-surface-muted"
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
          className="tech-mono inline-flex items-center justify-between border-t border-border bg-surface-muted/30 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-accent transition hover:bg-accent-soft/40"
        >
          <span className="inline-flex items-center gap-1.5">
            <PlayCircle className="h-3.5 w-3.5" />
            Ver detalhes do módulo
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
