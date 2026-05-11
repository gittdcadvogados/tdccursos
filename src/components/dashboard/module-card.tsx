import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Props = {
  slug: string;
  position: number;
  title: string;
  lessonsTotal: number;
  lessonsDone: number;
  coverUrl?: string | null;
};

// Remove o prefixo "Módulo X — " do título pra deixar só o tema.
function stripModulePrefix(title: string) {
  return title.replace(/^M[oó]dulo\s+\d+\s*[—-]\s*/i, "").trim();
}

export function ModuleCard({
  slug,
  position,
  title,
  lessonsTotal,
  lessonsDone,
  coverUrl,
}: Props) {
  const pct = lessonsTotal > 0 ? Math.round((lessonsDone / lessonsTotal) * 100) : 0;
  const isComplete = pct === 100 && lessonsTotal > 0;
  const cleanTitle = stripModulePrefix(title);
  const mod = position.toString().padStart(2, "0");

  return (
    <Link
      href={`/modulo/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent/40 hover:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.25)]"
    >
      {/* Capa */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface-muted">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={cleanTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0">
            <div
              aria-hidden
              className="bg-grid-fade absolute inset-0 text-border opacity-50"
            />
            <div
              aria-hidden
              className="glow-emerald absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 opacity-60"
            />
          </div>
        )}

        {/* Overlay com identificador do módulo */}
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

        {/* MOD_XX gigante quando não há capa */}
        {!coverUrl && (
          <div
            aria-hidden
            className="tech-mono pointer-events-none absolute inset-0 flex items-center justify-center text-7xl font-bold uppercase tracking-tighter text-accent/15"
          >
            MOD_{mod}
          </div>
        )}
      </div>

      {/* Corpo */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight">
            {cleanTitle}
          </h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>

        <div className="tech-mono inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-foreground-muted">
          <BookOpen className="h-3 w-3" />
          {lessonsTotal.toString().padStart(2, "0")} aulas
        </div>

        <div className="mt-auto space-y-1.5">
          <Progress value={pct} />
          <div className="flex items-center justify-between text-[11px]">
            <span className="tech-mono text-foreground-muted">
              {lessonsDone.toString().padStart(2, "0")} / {lessonsTotal.toString().padStart(2, "0")}
            </span>
            <span
              className={
                isComplete
                  ? "tech-mono font-semibold text-accent"
                  : "tech-mono text-foreground-muted"
              }
            >
              {pct}% concluído
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
