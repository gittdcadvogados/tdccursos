import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BunnyPlayer } from "@/components/bunny-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { markLessonCompleted } from "../actions";

type LessonRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  bunny_library_id: string | null;
  bunny_video_guid: string | null;
  position: number;
  modules: { id: string; slug: string; title: string };
};

export default async function AulaPage(props: PageProps<"/aula/[slug]">) {
  const { slug } = await props.params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      "id, slug, title, description, bunny_library_id, bunny_video_guid, position, modules!inner(id, slug, title)",
    )
    .eq("slug", slug)
    .maybeSingle()
    .returns<LessonRow | null>();

  if (!lesson) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Aulas do mesmo módulo + progresso de cada uma (sidebar)
  const { data: siblings } = await supabase
    .from("lessons")
    .select("id, slug, title, position")
    .eq("module_id", lesson.modules.id)
    .order("position", { ascending: true })
    .returns<{ id: string; slug: string; title: string; position: number }[]>();

  const siblingIds = (siblings ?? []).map((s) => s.id);
  const { data: progressRows } = siblingIds.length
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id, completed_at")
        .eq("user_id", user!.id)
        .in("lesson_id", siblingIds)
    : { data: [] as { lesson_id: string; completed_at: string | null }[] };

  const completedSet = new Set(
    (progressRows ?? [])
      .filter((p) => p.completed_at)
      .map((p) => p.lesson_id),
  );

  const isCompleted = completedSet.has(lesson.id);
  const hasVideo = !!lesson.bunny_library_id && !!lesson.bunny_video_guid;

  // Próxima aula
  const currentIdx = (siblings ?? []).findIndex((s) => s.id === lesson.id);
  const nextLesson =
    currentIdx >= 0 && siblings ? siblings[currentIdx + 1] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-foreground-muted">
        <Link href="/dashboard" className="transition hover:text-foreground">
          Dashboard
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/modulo/${lesson.modules.slug}`}
          className="inline-flex items-center gap-1.5 transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {lesson.modules.title}
        </Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Coluna principal */}
        <div className="space-y-6">
          <header>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Aula {lesson.position.toString().padStart(2, "0")}
            </span>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {lesson.title}
            </h1>
          </header>

          {hasVideo ? (
            <BunnyPlayer
              libraryId={lesson.bunny_library_id!}
              videoGuid={lesson.bunny_video_guid!}
              title={lesson.title}
            />
          ) : (
            <div className="aspect-video w-full rounded-xl border border-dashed border-border bg-surface p-8 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-foreground-muted" />
              <p className="mt-3 text-sm text-foreground-muted">
                Vídeo desta aula ainda não foi publicado.
              </p>
              <p className="mt-1 text-xs text-foreground-muted">
                Configure <code>bunny_library_id</code> e{" "}
                <code>bunny_video_guid</code> na tabela <code>lessons</code>.
              </p>
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-soft-fg">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Aula concluída
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground-muted">
                  <Circle className="h-3.5 w-3.5" />
                  Em andamento
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isCompleted && (
                <form action={markLessonCompleted}>
                  <input type="hidden" name="lesson_id" value={lesson.id} />
                  <input type="hidden" name="lesson_slug" value={lesson.slug} />
                  <Button type="submit" variant="primary" size="sm">
                    <CheckCircle2 />
                    Marcar como concluída
                  </Button>
                </form>
              )}
              {nextLesson && (
                <Link href={`/aula/${nextLesson.slug}`}>
                  <Button variant="secondary" size="sm">
                    Próxima aula
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {lesson.description && (
            <Card>
              <CardHeader>
                <CardTitle>Sobre esta aula</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-zinc dark:prose-invert max-w-none text-sm">
                  {lesson.description}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar — outras aulas do módulo */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Aulas deste módulo</CardTitle>
              <p className="text-xs text-foreground-muted">
                {completedSet.size} de {siblings?.length ?? 0} concluídas
              </p>
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <ul className="space-y-1">
                {siblings?.map((s) => {
                  const active = s.id === lesson.id;
                  const done = completedSet.has(s.id);
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/aula/${s.slug}`}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                          active
                            ? "bg-accent-soft text-accent-soft-fg ring-1 ring-accent/20"
                            : "hover:bg-surface-muted text-foreground",
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                        ) : active ? (
                          <PlayCircle className="h-4 w-4 shrink-0 text-accent" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-foreground-muted" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-muted">
                            Aula {s.position.toString().padStart(2, "0")}
                          </div>
                          <div className="truncate font-medium">{s.title}</div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
