import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  PlayCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  lessons: LessonRow[];
};

export default async function ModuloPage(props: PageProps<"/modulo/[slug]">) {
  const { slug } = await props.params;
  const supabase = await createClient();

  const { data: mod } = await supabase
    .from("modules")
    .select(
      "id, slug, title, description, position, lessons(id, slug, title, position, duration_seconds)",
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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o dashboard
      </Link>

      {/* Header */}
      <header className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Módulo {mod.position.toString().padStart(2, "0")}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">{mod.title}</h1>
        {mod.description && (
          <p className="max-w-2xl text-sm text-foreground-muted">
            {mod.description}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium tabular-nums text-foreground">
              {done}/{total} aulas
            </span>
            <span className="rounded-full border border-accent/20 bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-soft-fg">
              {pct}%
            </span>
          </div>
          <Progress value={pct} className="max-w-md" />
        </div>
      </header>

      {/* Lista de aulas */}
      <Card>
        <CardHeader>
          <CardTitle>Aulas do módulo</CardTitle>
          <p className="text-sm text-foreground-muted">
            Avance na ordem para melhor aproveitamento.
          </p>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {mod.lessons?.map((lesson) => {
              const isDone = completedSet.has(lesson.id);
              const minutes = lesson.duration_seconds
                ? Math.round(lesson.duration_seconds / 60)
                : null;

              return (
                <li key={lesson.id}>
                  <Link
                    href={`/aula/${lesson.slug}`}
                    className="group flex items-center gap-4 py-3 transition hover:bg-surface-muted/50 -mx-5 px-5 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full border",
                        isDone
                          ? "border-accent/30 bg-accent-soft text-accent-soft-fg"
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
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-muted">
                        Aula {lesson.position.toString().padStart(2, "0")}
                      </div>
                      <div className="truncate text-sm font-medium">
                        {lesson.title}
                      </div>
                    </div>

                    {minutes && (
                      <span className="hidden items-center gap-1 text-xs text-foreground-muted sm:inline-flex">
                        <Clock className="h-3.5 w-3.5" />
                        {minutes} min
                      </span>
                    )}

                    <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
