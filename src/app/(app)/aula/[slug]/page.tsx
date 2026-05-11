import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BunnyPlayer } from "@/components/bunny-player";
import { signEmbedUrl } from "@/lib/bunny/client";
import { buttonVariants } from "@/components/ui/button";
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
  duration_seconds: number | null;
  modules: { id: string; slug: string; title: string; position: number };
};

export default async function AulaPage(props: PageProps<"/aula/[slug]">) {
  const { slug } = await props.params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      "id, slug, title, description, bunny_library_id, bunny_video_guid, position, duration_seconds, modules!inner(id, slug, title, position)",
    )
    .eq("slug", slug)
    .maybeSingle()
    .returns<LessonRow | null>();

  if (!lesson) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: siblings } = await supabase
    .from("lessons")
    .select("id, slug, title, position, duration_seconds")
    .eq("module_id", lesson.modules.id)
    .order("position", { ascending: true })
    .returns<
      {
        id: string;
        slug: string;
        title: string;
        position: number;
        duration_seconds: number | null;
      }[]
    >();

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
  const signedSrc = hasVideo
    ? signEmbedUrl(lesson.bunny_video_guid!, undefined, {
        libraryIdOverride: lesson.bunny_library_id!,
      }).src
    : null;
  const isWorkshop = lesson.slug.startsWith("oficina");
  const minutes = lesson.duration_seconds
    ? Math.round(lesson.duration_seconds / 60)
    : null;

  const currentIdx = (siblings ?? []).findIndex((s) => s.id === lesson.id);
  const prevLesson =
    currentIdx > 0 && siblings ? siblings[currentIdx - 1] : null;
  const nextLesson =
    currentIdx >= 0 && siblings ? siblings[currentIdx + 1] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb tech */}
      <nav className="tech-mono flex items-center gap-2 text-[11px] uppercase tracking-wider text-foreground-muted">
        <Link href="/dashboard" className="hover:text-foreground">
          dashboard
        </Link>
        <span className="text-border">/</span>
        <Link
          href={`/modulo/${lesson.modules.slug}`}
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          modulo_{lesson.modules.position.toString().padStart(2, "0")}
        </Link>
        <span className="text-border">/</span>
        <span className="text-accent">
          {isWorkshop
            ? `oficina_${lesson.slug.replace("oficina-", "").padStart(2, "0")}`
            : `aula_${lesson.position.toString().padStart(2, "0")}`}
        </span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Coluna principal */}
        <div className="space-y-5">
          {/* Header */}
          <header className="space-y-2">
            <div className="flex items-center gap-2">
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
            </div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {lesson.title}
            </h1>
          </header>

          {/* Player */}
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

          {/* Barra de ações */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <span className="tech-mono inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-accent-soft-fg">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Concluida
                </span>
              ) : (
                <span className="tech-mono inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground-muted">
                  <Circle className="h-3.5 w-3.5" />
                  Em_andamento
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link
                  href={`/aula/${prevLesson.slug}`}
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                  title={prevLesson.title}
                >
                  <ArrowLeft />
                  <span className="hidden sm:inline">Anterior</span>
                </Link>
              )}
              {!isCompleted && (
                <form action={markLessonCompleted}>
                  <input type="hidden" name="lesson_id" value={lesson.id} />
                  <input type="hidden" name="lesson_slug" value={lesson.slug} />
                  <button
                    type="submit"
                    className={buttonVariants({ size: "sm" })}
                  >
                    <CheckCircle2 />
                    Marcar concluída
                  </button>
                </form>
              )}
              {nextLesson && (
                <Link
                  href={`/aula/${nextLesson.slug}`}
                  className={buttonVariants({
                    variant: isCompleted ? "primary" : "secondary",
                    size: "sm",
                  })}
                  title={nextLesson.title}
                >
                  <span className="hidden sm:inline">Próxima</span>
                  <ArrowRight />
                </Link>
              )}
            </div>
          </div>

          {/* Descrição */}
          {lesson.description && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="tech-mono text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
                ▸ SOBRE_ESTA_AULA
              </h3>
              <div className="prose prose-zinc dark:prose-invert mt-2 max-w-none text-sm">
                {lesson.description}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — outras aulas do módulo */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-4 py-3">
              <Link
                href={`/modulo/${lesson.modules.slug}`}
                className="group block"
              >
                <span className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
                  ▸ MODULO_{lesson.modules.position.toString().padStart(2, "0")}
                </span>
                <h3 className="mt-1 truncate text-sm font-medium transition group-hover:text-accent">
                  {lesson.modules.title.replace(/^Módulo \d+ — /, "")}
                </h3>
              </Link>
              <p className="tech-mono mt-2 text-[10px] uppercase tracking-wider text-foreground-muted">
                {completedSet.size.toString().padStart(2, "0")} /{" "}
                {(siblings?.length ?? 0).toString().padStart(2, "0")} concluídas
              </p>
            </div>
            <ul className="max-h-[calc(100vh-12rem)] overflow-y-auto p-2">
              {siblings?.map((s) => {
                const active = s.id === lesson.id;
                const done = completedSet.has(s.id);
                const isOf = s.slug.startsWith("oficina");
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
                        <div className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                          {isOf
                            ? `OFICINA_${s.slug.replace("oficina-", "").padStart(2, "0")}`
                            : `AULA_${s.position.toString().padStart(2, "0")}`}
                        </div>
                        <div className="truncate font-medium">{s.title}</div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
