import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Infinity as InfinityIcon,
  Layers,
  PlayCircle,
  Radio,
  Wrench,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { ModuleCard } from "@/components/dashboard/module-card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Meu curso — TDC CURSOS",
};

type LessonLite = {
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
  position: number;
  lessons: LessonLite[];
};
type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  modules: ModuleRow[];
};

function formatTotalHours(totalSeconds: number): string {
  if (totalSeconds <= 0) return "—";
  const hours = Math.round(totalSeconds / 3600);
  return `${hours}h`;
}

export default async function CursoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Curso (assume único curso do MVP; busca o primeiro publicado em que o user tem matrícula)
  const { data: course } = await supabase
    .from("courses")
    .select(
      "id, slug, title, description, cover_url, modules(id, slug, title, position, lessons(id, slug, title, position, duration_seconds))",
    )
    .order("position", { referencedTable: "modules", ascending: true })
    .order("position", { referencedTable: "modules.lessons", ascending: true })
    .limit(1)
    .maybeSingle()
    .returns<CourseRow | null>();

  if (!course) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
        <GraduationCap className="mx-auto h-10 w-10 text-foreground-muted" />
        <h2 className="mt-3 text-lg font-semibold tracking-tight">
          Sem matrícula ativa
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Aguarde a liberação de acesso ao curso.
        </p>
      </div>
    );
  }

  // Flat list de lessons + agregados
  const allLessons = course.modules.flatMap((m) => m.lessons ?? []);
  const allLessonIds = allLessons.map((l) => l.id);
  const totalDurationSec = allLessons.reduce(
    (acc, l) => acc + (l.duration_seconds ?? 0),
    0,
  );

  // Progresso do user
  const { data: progress } = allLessonIds.length
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id, completed_at")
        .eq("user_id", user!.id)
        .in("lesson_id", allLessonIds)
    : { data: [] as { lesson_id: string; completed_at: string | null }[] };

  const completedLessonIds = new Set(
    (progress ?? [])
      .filter((p) => p.completed_at)
      .map((p) => p.lesson_id),
  );

  // Última aula com progresso (continuar de onde parou)
  const { data: lastTouched } = await supabase
    .from("lesson_progress")
    .select(
      "lesson_id, completed_at, updated_at, lessons!inner(slug, title, position, modules!inner(slug, title, position))",
    )
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()
    .returns<{
      lesson_id: string;
      completed_at: string | null;
      updated_at: string;
      lessons: {
        slug: string;
        title: string;
        position: number;
        modules: { slug: string; title: string; position: number };
      };
    } | null>();

  const totalLessons = allLessons.length;
  const totalDone = (progress ?? []).filter((p) => p.completed_at).length;
  const pct = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;
  const totalModules = course.modules.length;
  const isComplete = pct === 100 && totalLessons > 0;

  // CTA principal
  const nextLesson = !lastTouched?.completed_at
    ? lastTouched?.lessons
    : course.modules[0]?.lessons[0];
  const ctaLabel = isComplete
    ? "Revisar curso"
    : totalDone === 0
      ? "Começar agora"
      : "Continuar";
  const ctaHref = nextLesson ? `/aula/${nextLesson.slug}` : "/dashboard";

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="absolute inset-0">
          {course.cover_url ? (
            <>
              <Image
                src={course.cover_url}
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/80 to-surface/40" />
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
          <span className="tech-mono inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-soft-fg">
            <span className="tech-pulse h-1.5 w-1.5 rounded-full bg-accent" />
            MEU_CURSO
          </span>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              {course.title}
            </h1>
            {course.description && (
              <p className="max-w-2xl text-pretty text-sm text-foreground-muted md:text-base">
                {course.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground-muted">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              <span className="tech-mono">
                {totalModules.toString().padStart(2, "0")} módulos
              </span>
            </span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span className="tech-mono">
                {totalLessons.toString().padStart(2, "0")} aulas
              </span>
            </span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span className="tech-mono">{formatTotalHours(totalDurationSec)}</span>
            </span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              Prof. Rafael Vieira
            </span>
          </div>

          <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1 space-y-1.5 md:max-w-md">
              <div className="flex items-center justify-between text-[11px]">
                <span className="tech-mono uppercase tracking-wider text-foreground-muted">
                  Seu progresso
                </span>
                <span className="tech-mono font-semibold text-accent">
                  {totalDone.toString().padStart(2, "0")} /{" "}
                  {totalLessons.toString().padStart(2, "0")} · {pct}%
                </span>
              </div>
              <Progress value={pct} />
            </div>
            <Link href={ctaHref} className={buttonVariants({ size: "md" })}>
              <PlayCircle />
              {ctaLabel}
              <ArrowRight />
            </Link>
          </div>
        </div>
      </header>

      {/* Continuar de onde parou */}
      {lastTouched && !lastTouched.completed_at && (
        <Link
          href={`/aula/${lastTouched.lessons.slug}`}
          className="group block overflow-hidden rounded-xl border border-accent/30 bg-linear-to-br from-emerald-50 to-emerald-100 p-5 transition hover:border-accent/50 dark:from-emerald-950/40 dark:to-emerald-900/20"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-white">
                <PlayCircle className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="tech-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
                  ▸ CONTINUAR_DE_ONDE_PAROU
                </div>
                <div className="mt-0.5 truncate font-medium">
                  {lastTouched.lessons.title}
                </div>
                <div className="tech-mono mt-0.5 truncate text-xs text-foreground-muted">
                  Módulo{" "}
                  {String(lastTouched.lessons.modules.position).padStart(2, "0")} ·
                  Aula{" "}
                  {String(lastTouched.lessons.position).padStart(2, "0")}
                </div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-accent transition group-hover:translate-x-0.5" />
          </div>
        </Link>
      )}

      {/* Bônus / Inclusos */}
      <section>
        <header className="mb-4">
          <span className="tech-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
            ▸ ESTE_CURSO_INCLUI
          </span>
          <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
            O que você tem acesso
          </h2>
        </header>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              icon: BookOpen,
              label: "Videoaulas",
              value: `${totalLessons.toString().padStart(2, "0")}`,
              sub: "On-demand",
            },
            {
              icon: Radio,
              label: "Encontros ao vivo",
              value: "07",
              sub: "Tira-dúvidas gravados",
            },
            {
              icon: Wrench,
              label: "Oficinas práticas",
              value: "02",
              sub: "CT-e + CT-e OS",
            },
            {
              icon: InfinityIcon,
              label: "Acesso",
              value: "Vitalício",
              sub: "Atualizações inclusas",
            },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent-soft-fg">
                <Icon className="h-4 w-4" />
              </span>
              <div className="mt-3 text-lg font-semibold tracking-tight">
                {value}
              </div>
              <div className="text-xs font-medium">{label}</div>
              <div className="tech-mono mt-0.5 text-[10px] uppercase tracking-wider text-foreground-muted">
                {sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instrutor */}
      <section>
        <header className="mb-4">
          <span className="tech-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
            ▸ QUEM_ENSINA
          </span>
          <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
            Professor titular
          </h2>
        </header>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex flex-col gap-5 p-5 md:flex-row md:gap-6 md:p-6">
            <div className="relative aspect-square h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted">
              <div className="bg-grid-tight absolute inset-0 text-border opacity-40" />
              <div className="absolute inset-0 grid place-items-center text-foreground-muted">
                <GraduationCap className="h-10 w-10" />
              </div>
            </div>
            <div className="min-w-0 space-y-2">
              <h3 className="text-lg font-semibold tracking-tight">
                Rafael Vieira
              </h3>
              <p className="text-sm text-foreground-muted">
                Fiscal de tributos estaduais licenciado, com atuação direta na
                interpretação e aplicação da legislação do ICMS no Centro-Oeste.
                Une a experiência da fiscalização à prática consultiva, com foco
                em transportadoras e operações logísticas. Construiu este curso
                a partir da LC 214/2025, do SINIEF 24/2024 e de pesquisas de
                campo com empresas do setor.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "Direito Tributário",
                  "Reforma Tributária",
                  "Transporte",
                  "ICMS",
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

      {/* Módulos */}
      <section>
        <header className="mb-4 flex items-end justify-between gap-3">
          <div>
            <span className="tech-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
              ▸ CURRICULO
            </span>
            <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
              {totalModules.toString().padStart(2, "0")} módulos
            </h2>
          </div>
          <div
            className={cn(
              "tech-mono text-[11px] uppercase tracking-wider",
              isComplete ? "text-accent" : "text-foreground-muted",
            )}
          >
            {isComplete ? (
              <span className="inline-flex items-center gap-1">
                <Award className="h-3.5 w-3.5" />
                Curso completo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {totalDone.toString().padStart(2, "0")} /{" "}
                {totalLessons.toString().padStart(2, "0")} aulas
              </span>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {course.modules.map((m) => (
            <ModuleCard
              key={m.id}
              slug={m.slug}
              position={m.position}
              title={m.title}
              lessons={m.lessons ?? []}
              completedLessonIds={completedLessonIds}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
