import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  PlayCircle,
  Sparkles,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BunnyPlayer } from "@/components/bunny-player";
import { signEmbedUrl } from "@/lib/bunny/client";
import { Progress } from "@/components/ui/progress";
import { LessonNotes } from "@/components/aula/lesson-notes";
import {
  LessonComments,
  type CommentItem,
} from "@/components/aula/lesson-comments";
import { LessonControls } from "@/components/aula/lesson-controls";
import { cn } from "@/lib/utils";

type LessonLite = {
  id: string;
  slug: string;
  title: string;
  position: number;
  duration_seconds: number | null;
};

type ModuleWithLessons = {
  id: string;
  slug: string;
  title: string;
  position: number;
  lessons: LessonLite[];
};

type LessonFull = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  bunny_library_id: string | null;
  bunny_video_guid: string | null;
  position: number;
  duration_seconds: number | null;
  modules: {
    id: string;
    slug: string;
    title: string;
    position: number;
    course_id: string;
    courses: { slug: string; title: string };
  };
};

export default async function AulaPage(props: PageProps<"/aula/[slug]">) {
  const { slug } = await props.params;
  const supabase = await createClient();

  // Aula atual com módulo + curso
  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      "id, slug, title, description, bunny_library_id, bunny_video_guid, position, duration_seconds, modules!inner(id, slug, title, position, course_id, courses!inner(slug, title))",
    )
    .eq("slug", slug)
    .maybeSingle()
    .returns<LessonFull | null>();

  if (!lesson) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Todos os módulos do curso com suas aulas (pra sidebar e prev/next)
  const { data: allModules } = await supabase
    .from("modules")
    .select(
      "id, slug, title, position, lessons(id, slug, title, position, duration_seconds)",
    )
    .eq("course_id", lesson.modules.course_id)
    .order("position", { ascending: true })
    .order("position", { referencedTable: "lessons", ascending: true })
    .returns<ModuleWithLessons[]>();

  const courseLessonIds = (allModules ?? []).flatMap((m) =>
    (m.lessons ?? []).map((l) => l.id),
  );

  // Progresso do usuário em qualquer aula do curso
  const { data: progressRows } = courseLessonIds.length
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id, completed_at")
        .eq("user_id", user!.id)
        .in("lesson_id", courseLessonIds)
    : { data: [] as { lesson_id: string; completed_at: string | null }[] };

  const completedSet = new Set(
    (progressRows ?? [])
      .filter((p) => p.completed_at)
      .map((p) => p.lesson_id),
  );

  // Anotações pessoais desta aula
  const { data: noteRow } = await supabase
    .from("lesson_notes")
    .select("body, updated_at")
    .eq("user_id", user!.id)
    .eq("lesson_id", lesson.id)
    .maybeSingle()
    .returns<{ body: string; updated_at: string } | null>();

  // Comentários da aula com perfil do autor
  const { data: commentsRaw } = await supabase
    .from("lesson_comments")
    .select(
      "id, user_id, body, created_at, parent_id, profiles!inner(full_name, display_name, avatar_url, role)",
    )
    .eq("lesson_id", lesson.id)
    .order("created_at", { ascending: false })
    .returns<CommentItem[]>();

  const comments = commentsRaw ?? [];

  // Flat list ordenada pra prev/next entre módulos
  const flatLessons = (allModules ?? []).flatMap((m) =>
    (m.lessons ?? []).map((l) => ({
      ...l,
      moduleId: m.id,
      moduleSlug: m.slug,
      moduleTitle: m.title,
      modulePosition: m.position,
    })),
  );
  const currentIdx = flatLessons.findIndex((l) => l.id === lesson.id);
  const next =
    currentIdx >= 0 && currentIdx < flatLessons.length - 1
      ? flatLessons[currentIdx + 1]
      : null;

  const isCompleted = completedSet.has(lesson.id);
  const hasVideo = !!lesson.bunny_library_id && !!lesson.bunny_video_guid;
  const signedSrc = hasVideo
    ? signEmbedUrl(lesson.bunny_video_guid!, undefined, {
        libraryIdOverride: lesson.bunny_library_id!,
      }).src
    : null;
  const isWorkshop = lesson.slug.startsWith("oficina");
  const minutes = lesson.duration_seconds
    ? Math.round(lesson.duration_seconds / 60)
    : null;

  // Progresso geral do curso
  const totalCourseLessons = flatLessons.length;
  const doneCourseLessons = flatLessons.filter((l) => completedSet.has(l.id))
    .length;
  const coursePct =
    totalCourseLessons > 0
      ? Math.round((doneCourseLessons / totalCourseLessons) * 100)
      : 0;

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-3 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/modulo/${lesson.modules.slug}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-background text-foreground-muted transition hover:border-accent/40 hover:text-foreground"
            aria-label="Voltar ao módulo"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <p className="tech-mono text-[10px] uppercase tracking-wider text-foreground-muted">
              ▸ MODULO_{lesson.modules.position.toString().padStart(2, "0")}
            </p>
            <p className="truncate text-sm font-medium md:text-base">
              {lesson.modules.title.replace(/^M[oó]dulo\s+\d+\s*[—-]\s*/i, "")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 sm:flex">
            <div className="tech-mono text-right text-[10px] uppercase tracking-wider text-foreground-muted">
              <div>Seu progresso</div>
              <div className="text-accent">
                {doneCourseLessons.toString().padStart(2, "0")} /{" "}
                {totalCourseLessons.toString().padStart(2, "0")} · {coursePct}%
              </div>
            </div>
            <div className="hidden w-32 md:block">
              <Progress value={coursePct} />
            </div>
          </div>

          <Link
            href={`/modulo/${lesson.modules.slug}`}
            className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background text-foreground-muted transition hover:border-accent/40 hover:text-foreground"
            aria-label="Fechar player"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Main split: sidebar + content */}
      <div className="flex min-h-0 flex-1">
        {/* Sidebar com aulas do módulo atual */}
        <aside className="hidden w-80 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
          <div className="border-b border-border px-4 py-3">
            <p className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
              ▸ MODULO_{lesson.modules.position.toString().padStart(2, "0")}
            </p>
            <p className="mt-0.5 truncate text-sm font-medium">
              {lesson.modules.title.replace(/^M[oó]dulo\s+\d+\s*[—-]\s*/i, "")}
            </p>
            {(() => {
              const currentModule = (allModules ?? []).find(
                (m) => m.id === lesson.modules.id,
              );
              const modLessons = currentModule?.lessons ?? [];
              const modDone = modLessons.filter((l) =>
                completedSet.has(l.id),
              ).length;
              return (
                <p className="tech-mono mt-1 text-[10px] uppercase tracking-wider text-foreground-muted">
                  {modDone.toString().padStart(2, "0")} /{" "}
                  {modLessons.length.toString().padStart(2, "0")} concluídas
                </p>
              );
            })()}
          </div>

          <ul className="flex-1 overflow-y-auto">
            {((allModules ?? []).find((m) => m.id === lesson.modules.id)
              ?.lessons ?? []).map((l) => {
              const active = l.id === lesson.id;
              const done = completedSet.has(l.id);
              const isOf = l.slug.startsWith("oficina");
              const mins = l.duration_seconds
                ? Math.round(l.duration_seconds / 60)
                : null;

              return (
                <li key={l.id}>
                  <Link
                    href={`/aula/${l.slug}`}
                    className={cn(
                      "flex items-start gap-3 border-l-2 px-4 py-2.5 text-sm transition",
                      active
                        ? "border-accent bg-accent-soft/60 text-foreground"
                        : "border-transparent hover:bg-surface-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 shrink-0",
                        done
                          ? "text-accent"
                          : active
                            ? "text-accent"
                            : "text-foreground-muted",
                      )}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : active ? (
                        <PlayCircle className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="tech-mono text-[9px] font-semibold uppercase tracking-wider text-foreground-muted">
                        {isOf
                          ? `OFICINA_${l.slug.replace("oficina-", "").padStart(2, "0")}`
                          : `AULA_${l.position.toString().padStart(2, "0")}`}
                      </div>
                      <div className="truncate font-medium leading-snug">
                        {l.title}
                      </div>
                      {mins !== null && (
                        <div className="tech-mono mt-0.5 inline-flex items-center gap-1 text-[10px] text-foreground-muted">
                          <Clock className="h-2.5 w-2.5" />
                          {mins}min
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:px-8 md:py-10">
            {/* Player + barra de ações abaixo (cliente) */}
            <LessonControls
              lessonId={lesson.id}
              lessonSlug={lesson.slug}
              isCompleted={isCompleted}
              nextLesson={
                next ? { slug: next.slug, title: next.title } : null
              }
            >
              {signedSrc ? (
                <BunnyPlayer src={signedSrc} title={lesson.title} />
              ) : (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-dashed border-border bg-surface-muted">
                  <div
                    aria-hidden
                    className="bg-grid-tight pointer-events-none absolute inset-0 text-border opacity-40"
                  />
                  <div
                    aria-hidden
                    className="glow-emerald pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 opacity-50"
                  />
                  <div className="relative flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                    <Sparkles className="h-8 w-8 text-foreground-muted" />
                    <div>
                      <p className="text-sm font-medium">
                        Vídeo desta aula em produção
                      </p>
                      <p className="tech-mono mt-1 text-[11px] text-foreground-muted">
                        bunny_library_id · bunny_video_guid pendentes
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </LessonControls>

            {/* Título + meta */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tech-mono text-xs font-semibold uppercase tracking-wider text-accent">
                  ▸{" "}
                  {isWorkshop
                    ? `OFICINA ${lesson.slug.replace("oficina-", "").padStart(2, "0")}`
                    : `AULA ${lesson.position.toString().padStart(2, "0")}`}
                </span>
                {isWorkshop && (
                  <span className="tech-mono rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700 dark:bg-amber-950/40 dark:text-amber-500">
                    PRATICA
                  </span>
                )}
                {minutes !== null && (
                  <span className="tech-mono inline-flex items-center gap-1 text-[11px] text-foreground-muted">
                    <Clock className="h-3 w-3" />
                    {minutes}min
                  </span>
                )}
                {isCompleted && (
                  <span className="tech-mono inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-soft-fg">
                    <CheckCircle2 className="h-3 w-3" />
                    Concluida
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {lesson.title}
              </h1>
            </div>

            {/* Sobre a aula */}
            {lesson.description && (
              <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
                <h2 className="tech-mono mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
                  <FileText className="h-3.5 w-3.5" />
                  ▸ SOBRE_ESTA_AULA
                </h2>
                <div className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base">
                  {lesson.description}
                </div>
              </section>
            )}

            {/* Anotações pessoais */}
            <LessonNotes
              lessonId={lesson.id}
              lessonSlug={lesson.slug}
              initialBody={noteRow?.body ?? ""}
              updatedAt={noteRow?.updated_at ?? null}
            />

            {/* Comentários (fórum) */}
            <LessonComments
              lessonId={lesson.id}
              lessonSlug={lesson.slug}
              comments={comments}
              currentUserId={user!.id}
            />

          </div>
        </main>
      </div>
    </div>
  );
}
