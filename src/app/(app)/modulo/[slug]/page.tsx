import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Infinity as InfinityIcon,
  Layers,
  PlayCircle,
  Scale,
  Target,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Progress } from "@/components/ui/progress";
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
  courses: { slug: string; title: string; cover_url: string | null };
  lessons: LessonRow[];
};

export default async function ModuloPage(props: PageProps<"/modulo/[slug]">) {
  const { slug } = await props.params;
  const supabase = await createClient();

  const { data: mod } = await supabase
    .from("modules")
    .select(
      "id, slug, title, description, position, course_id, courses!inner(slug, title, cover_url), lessons(id, slug, title, position, duration_seconds)",
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

  // Total de módulos no curso (pra mostrar "X de N")
  const { count: courseModulesCount } = await supabase
    .from("modules")
    .select("id", { count: "exact", head: true })
    .eq("course_id", mod.course_id);

  const completedSet = new Set(
    (progressRows ?? [])
      .filter((p) => p.completed_at)
      .map((p) => p.lesson_id),
  );

  const total = mod.lessons?.length ?? 0;
  const done = (mod.lessons ?? []).filter((l) => completedSet.has(l.id)).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const isComplete = pct === 100 && total > 0;
  const totalDuration = (mod.lessons ?? []).reduce(
    (acc, l) => acc + (l.duration_seconds ?? 0),
    0,
  );
  const totalHours = Math.floor(totalDuration / 3600);
  const totalMins = Math.round((totalDuration % 3600) / 60);
  const durationLabel =
    totalHours > 0
      ? `${totalHours}h ${totalMins.toString().padStart(2, "0")}m`
      : `${totalMins} min`;

  const nextToWatch = (mod.lessons ?? []).find((l) => !completedSet.has(l.id));
  const ctaLabel = isComplete
    ? "Revisar módulo"
    : done === 0
      ? "Iniciar módulo"
      : "Continuar";
  const ctaHref = nextToWatch
    ? `/aula/${nextToWatch.slug}`
    : mod.lessons?.[0]
      ? `/aula/${mod.lessons[0].slug}`
      : `/dashboard`;

  const moduleNumber = mod.position.toString().padStart(2, "0");
  const cleanTitle = mod.title.replace(/^M[oó]dulo\s+\d+\s*[—-]\s*/i, "").trim();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="tech-mono flex items-center gap-2 text-[11px] uppercase tracking-wider text-foreground-muted">
        <Link href="/dashboard" className="hover:text-foreground">
          dashboard
        </Link>
        <span className="text-border">/</span>
        <span className="text-accent">modulo_{moduleNumber}</span>
      </nav>

      {/* Hero / breadcrumb-area */}
      <header className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Background image ou padrão tech */}
        <div className="absolute inset-0">
          {mod.courses.cover_url ? (
            <>
              <Image
                src={mod.courses.cover_url}
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/70 to-surface/30" />
            </>
          ) : (
            <>
              <div className="bg-grid-fade absolute inset-0 text-border opacity-60" />
              <div
                aria-hidden
                className="glow-emerald absolute -right-32 top-0 h-96 w-96 opacity-40"
              />
            </>
          )}
        </div>

        <div className="relative space-y-5 p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tech-mono inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-soft-fg">
              <span className="tech-pulse h-1.5 w-1.5 rounded-full bg-accent" />
              MODULO_{moduleNumber} · {(courseModulesCount ?? 7)
                .toString()
                .padStart(2, "0")}
            </span>
            {isComplete && (
              <span className="tech-mono inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                <CheckCircle2 className="h-3 w-3" />
                Completo
              </span>
            )}
          </div>

          <div className="max-w-3xl space-y-3">
            <p className="tech-mono text-xs uppercase tracking-wider text-foreground-muted">
              {mod.courses.title}
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              {cleanTitle}
            </h1>
            {mod.description && (
              <p className="max-w-2xl text-pretty text-sm text-foreground-muted md:text-base">
                {mod.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground-muted">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span className="tech-mono tabular-nums">
                {total.toString().padStart(2, "0")} aulas
              </span>
            </span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span className="tech-mono">{durationLabel}</span>
            </span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              Prof. Rafael Vieira
            </span>
          </div>

          {/* Progress + CTA */}
          <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1 space-y-1.5 md:max-w-md">
              <div className="flex items-center justify-between text-[11px]">
                <span className="tech-mono uppercase tracking-wider text-foreground-muted">
                  Progresso do módulo
                </span>
                <span className="tech-mono font-semibold text-accent">
                  {done.toString().padStart(2, "0")} /{" "}
                  {total.toString().padStart(2, "0")} · {pct}%
                </span>
              </div>
              <Progress value={pct} />
            </div>
            <Link href={ctaHref} className={buttonVariants({ size: "md" })}>
              {ctaLabel}
              <ArrowRight />
            </Link>
          </div>
        </div>
      </header>

      {/* Grid 2-col: conteúdo + sidebar */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Coluna esquerda */}
        <div className="min-w-0 space-y-10">
          {/* Anchor nav */}
          <nav className="sticky top-16 z-10 -mx-1 flex overflow-x-auto border-b border-border bg-background/80 backdrop-blur">
            <ul className="tech-mono flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">
              {[
                { id: "visao-geral", label: "Visão_geral" },
                { id: "curriculo", label: "Currículo" },
                { id: "instrutor", label: "Instrutor" },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block border-b-2 border-transparent px-3 py-3 text-foreground-muted transition hover:border-accent/30 hover:text-foreground"
                  >
                    ▸ {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Visão geral */}
          <section id="visao-geral" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              Sobre este módulo
            </h2>
            {mod.description ? (
              <p className="text-foreground-muted">{mod.description}</p>
            ) : (
              <p className="text-foreground-muted">
                Conteúdo do módulo {moduleNumber} do curso{" "}
                <span className="font-medium text-foreground">
                  {mod.courses.title}
                </span>
                .
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Target,
                  title: "O que você vai dominar",
                  text: "Aplicação prática dos conceitos no dia a dia da transportadora.",
                },
                {
                  icon: Scale,
                  title: "Base legal coberta",
                  text: "LC 214/2025, Regulamento IBS/CBS e jurisprudência aplicável.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent-soft-fg">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                  <p className="mt-1 text-xs text-foreground-muted">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Currículo */}
          <section id="curriculo" className="scroll-mt-24 space-y-3">
            <div className="flex items-end justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                Currículo
              </h2>
              <span className="tech-mono text-[11px] uppercase tracking-wider text-foreground-muted">
                {done.toString().padStart(2, "0")} /{" "}
                {total.toString().padStart(2, "0")} concluídas
              </span>
            </div>

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
                    className={cn("border-border", !isLast && "border-b")}
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

          {/* Instrutor */}
          <section id="instrutor" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              Quem ensina este módulo
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="flex flex-col gap-5 p-5 md:flex-row md:gap-6 md:p-6">
                <div className="relative aspect-square h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted">
                  <div className="bg-grid-tight absolute inset-0 text-border opacity-40" />
                  <div className="absolute inset-0 grid place-items-center text-foreground-muted">
                    <GraduationCap className="h-10 w-10" />
                  </div>
                </div>
                <div className="min-w-0 space-y-2">
                  <div>
                    <span className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
                      ▸ PROFESSOR_TITULAR
                    </span>
                    <h3 className="mt-1 text-lg font-semibold tracking-tight">
                      Rafael Vieira
                    </h3>
                  </div>
                  <p className="text-sm text-foreground-muted">
                    Fiscal de tributos estaduais licenciado, com atuação direta
                    na interpretação e aplicação da legislação do ICMS no
                    Centro-Oeste. Une a experiência da fiscalização à prática
                    consultiva, com foco em transportadoras e operações
                    logísticas.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      "Direito Tributário",
                      "Reforma Tributária",
                      "Transporte",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="tech-mono rounded-md border border-border bg-surface-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-foreground-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar direito */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-surface-muted">
              {mod.courses.cover_url ? (
                <Image
                  src={mod.courses.cover_url}
                  alt={cleanTitle}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0">
                  <div className="bg-grid-fade absolute inset-0 text-border opacity-50" />
                  <div
                    aria-hidden
                    className="glow-emerald absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 opacity-60"
                  />
                  <div className="tech-mono pointer-events-none absolute inset-0 flex items-center justify-center text-5xl font-bold tracking-tighter text-accent/15">
                    MOD_{moduleNumber}
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>

            {/* CTA */}
            <div className="space-y-4 p-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="tech-mono uppercase tracking-wider text-foreground-muted">
                    Seu progresso
                  </span>
                  <span className="tech-mono font-semibold text-accent">
                    {pct}%
                  </span>
                </div>
                <Progress value={pct} />
                <p className="tech-mono text-[11px] uppercase tracking-wider text-foreground-muted">
                  {done.toString().padStart(2, "0")} /{" "}
                  {total.toString().padStart(2, "0")} aulas concluídas
                </p>
              </div>

              <Link
                href={ctaHref}
                className={cn(
                  buttonVariants({ size: "md" }),
                  "w-full justify-center",
                )}
              >
                <PlayCircle />
                {ctaLabel}
              </Link>

              <div className="space-y-2.5 border-t border-border pt-4">
                <h4 className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                  ▸ ESTE_MODULO_INCLUI
                </h4>
                <ul className="space-y-2 text-sm">
                  {[
                    {
                      icon: BookOpen,
                      label: "Aulas",
                      value: total.toString().padStart(2, "0"),
                    },
                    {
                      icon: Clock,
                      label: "Duração",
                      value: durationLabel,
                    },
                    {
                      icon: Layers,
                      label: "Posição",
                      value: `${moduleNumber} de ${(courseModulesCount ?? 7).toString().padStart(2, "0")}`,
                    },
                    {
                      icon: Award,
                      label: "Material",
                      value: "PDF + ementa",
                    },
                    {
                      icon: InfinityIcon,
                      label: "Acesso",
                      value: "Vitalício",
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <li
                      key={label}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="inline-flex items-center gap-2 text-foreground-muted">
                        <Icon className="h-4 w-4" />
                        {label}
                      </span>
                      <span className="tech-mono text-xs font-medium">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-foreground-muted transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar a todos os módulos
          </Link>
        </aside>
      </div>
    </div>
  );
}
