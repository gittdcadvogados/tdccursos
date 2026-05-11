import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  PlayCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Progress } from "@/components/ui/progress";
import { TechBackdrop } from "@/components/ui/tech-backdrop";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LessonRow = {
  id: string;
  slug: string;
  title: string;
  position: number;
  duration_seconds: number | null;
};

type ModuleRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  position: number;
  course_id: string;
  lessons: LessonRow[];
};

export default async function ModuloPage(props: PageProps<"/modulo/[slug]">) {
  const { slug } = await props.params;
  const supabase = await createClient();

  const { data: mod } = await supabase
    .from("modules")
    .select(
      "id, slug, title, description, position, course_id, lessons(id, slug, title, position, duration_seconds)",
    )
    .eq("slug", slug)
    .order("position", { referencedTable: "lessons", ascending: true })
    .maybeSingle()
    .returns<ModuleRow | null>();

  if (!mod) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const lessonIds = (mod.lessons ?? []).map((l) => l.id);
  const { data: progressRows } = lessonIds.length
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id, completed_at")
        .eq("user_id", user!.id)
        .in("lesson_id", lessonIds)
    : { data: [] as { lesson_id: string; completed_at: string | null }[] };

  const completedSet = new Set(
    (progressRows ?? [])
      .filter((p) => p.completed_at)
      .map((p) => p.lesson_id),
  );

  const total = mod.lessons?.length ?? 0;
  const done = (mod.lessons ?? []).filter((l) => completedSet.has(l.id)).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const totalDuration = (mod.lessons ?? []).reduce(
    (acc, l) => acc + (l.duration_seconds ?? 0),
    0,
  );
  const totalMinutes = Math.round(totalDuration / 60);

  // Encontrar primeira aula não-concluída para CTA "Continuar"
  const nextToWatch = (mod.lessons ?? []).find((l) => !completedSet.has(l.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao dashboard
      </Link>

      {/* Header com backdrop tech */}
      <header className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 md:p-8">
        <TechBackdrop pattern="grid-fade" glow="top" />
        <div className="relative space-y-3">
          <span className="tech-mono inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
            <span>▸</span>
            MODULO_{mod.position.toString().padStart(2, "0")}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {mod.title.replace(/^Módulo \d+ — /, "")}
          </h1>
          {mod.description && (
            <p className="max-w-2xl text-sm text-foreground-muted md:text-base">
              {mod.description}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="tech-mono text-2xl font-semibold tabular-nums text-foreground">
                  {done.toString().padStart(2, "0")}
                  <span className="text-foreground-muted">
                    /{total.toString().padStart(2, "0")}
                  </span>
                </span>
                <span className="text-xs text-foreground-muted">aulas</span>
              </div>
              <span className="text-border">·</span>
              <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                <Clock className="h-3.5 w-3.5" />
                <span className="tech-mono">{totalMinutes} min</span>
              </div>
              <span className="text-border">·</span>
              <span className="tech-mono rounded-full border border-accent/20 bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-soft-fg">
                {pct}%
              </span>
            </div>

            {nextToWatch && (
              <Link
                href={`/aula/${nextToWatch.slug}`}
                className={buttonVariants({ size: "sm" })}
              >
                {done === 0 ? "Iniciar módulo" : "Continuar"}
                <ArrowRight />
              </Link>
            )}
          </div>

          <Progress value={pct} className="mt-2" />
        </div>
      </header>

      {/* Lista de aulas */}
      <section>
        <header className="mb-3 flex items-center justify-between">
          <h2 className="tech-mono text-xs font-semibold uppercase tracking-wider text-foreground-muted">
            ▸ AULAS_DO_MODULO
          </h2>
        </header>

        <ul className="overflow-hidden rounded-xl border border-border bg-surface">
          {mod.lessons?.map((lesson, idx) => {
            const isDone = completedSet.has(lesson.id);
            const isWorkshop = lesson.slug.startsWith("oficina");
            const minutes = lesson.duration_seconds
              ? Math.round(lesson.duration_seconds / 60)
              : null;
            const isLast = idx === (mod.lessons?.length ?? 0) - 1;

            return (
              <li
                key={lesson.id}
                className={cn(
                  "border-border",
                  !isLast && "border-b",
                )}
              >
                <Link
                  href={`/aula/${lesson.slug}`}
                  className="group flex items-center gap-4 px-4 py-3.5 transition hover:bg-surface-muted md:px-5 md:py-4"
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-full border ring-2 ring-transparent transition group-hover:ring-accent/20",
                      isDone
                        ? "border-accent/30 bg-accent-soft text-accent"
                        : "border-border bg-surface text-foreground-muted",
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <PlayCircle className="h-4 w-4" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                        {isWorkshop
                          ? `OFICINA_${lesson.slug.replace("oficina-", "").padStart(2, "0")}`
                          : `AULA_${lesson.position.toString().padStart(2, "0")}`}
                      </span>
                      {isWorkshop && (
                        <span className="tech-mono rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-amber-700 dark:bg-amber-950/40 dark:text-amber-500">
                          PRATICA
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-sm font-medium md:text-base">
                      {lesson.title}
                    </div>
                  </div>

                  {minutes !== null && (
                    <span className="tech-mono hidden items-center gap-1 text-xs text-foreground-muted sm:inline-flex">
                      <Clock className="h-3.5 w-3.5" />
                      {minutes}min
                    </span>
                  )}

                  <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
