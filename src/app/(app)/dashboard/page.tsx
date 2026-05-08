import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ModuleRow = { id: string; slug: string; title: string; position: number };
type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  modules: ModuleRow[];
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS já filtra para cursos que o aluno tem matrícula ativa.
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title, description, modules(id, slug, title, position)")
    .order("position", { referencedTable: "modules", ascending: true })
    .returns<CourseRow[]>();

  // Total de aulas por curso (para % de progresso)
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, modules!inner(course_id)")
    .returns<{ id: string; modules: { course_id: string } }[]>();

  const { data: completed } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed_at, lessons!inner(modules!inner(course_id))")
    .eq("user_id", user!.id)
    .not("completed_at", "is", null)
    .returns<
      {
        lesson_id: string;
        completed_at: string;
        lessons: { modules: { course_id: string } };
      }[]
    >();

  const totalsByCourse = new Map<string, number>();
  for (const l of lessons ?? []) {
    const cid = l.modules.course_id;
    totalsByCourse.set(cid, (totalsByCourse.get(cid) ?? 0) + 1);
  }
  const completedByCourse = new Map<string, number>();
  for (const c of completed ?? []) {
    const cid = c.lessons.modules.course_id;
    completedByCourse.set(cid, (completedByCourse.get(cid) ?? 0) + 1);
  }

  const totalLessons = lessons?.length ?? 0;
  const totalCompleted = completed?.length ?? 0;
  const totalModules = (courses ?? []).reduce(
    (acc, c) => acc + (c.modules?.length ?? 0),
    0,
  );
  const overallPct =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  if (!courses || courses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
        <GraduationCap className="mx-auto h-10 w-10 text-foreground-muted" />
        <h2 className="mt-3 text-lg font-semibold tracking-tight">
          Nenhum curso disponível ainda
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Você ainda não tem matrícula ativa. Aguarde a liberação de acesso.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Visão geral
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-foreground-muted">
          Acompanhe seu progresso nos cursos disponíveis.
        </p>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={BookOpen} label="Cursos" value={String(courses.length)} />
        <Stat icon={Layers} label="Módulos" value={String(totalModules)} />
        <Stat
          icon={PlayCircle}
          label="Aulas"
          value={`${totalCompleted}/${totalLessons}`}
        />
        <Stat
          icon={TrendingUp}
          label="Progresso"
          value={`${overallPct}%`}
          accent
        />
      </section>

      {/* Cursos */}
      <section className="space-y-6">
        {courses.map((course) => {
          const total = totalsByCourse.get(course.id) ?? 0;
          const done = completedByCourse.get(course.id) ?? 0;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    {course.description && (
                      <p className="mt-1 text-sm text-foreground-muted">
                        {course.description}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-soft-fg">
                    {pct}% concluído
                  </span>
                </div>

                {/* Progress bar */}
                <Progress value={pct} className="mt-4" />
                <div className="mt-1.5 flex items-center justify-between text-xs text-foreground-muted">
                  <span>
                    {done} de {total} aulas
                  </span>
                  {done === total && total > 0 && (
                    <span className="inline-flex items-center gap-1 text-accent">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Completo
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {course.modules?.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/modulo/${m.slug}`}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition hover:border-accent/40 hover:bg-accent-soft/40"
                      >
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-muted">
                            Módulo {m.position.toString().padStart(2, "0")}
                          </div>
                          <div className="truncate text-sm font-medium">
                            {m.title}
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-foreground-muted">
          {label}
        </span>
        <Icon
          className={
            accent
              ? "h-4 w-4 text-accent"
              : "h-4 w-4 text-foreground-muted"
          }
        />
      </div>
      <div
        className={
          accent
            ? "mt-2 text-2xl font-semibold tracking-tight text-accent"
            : "mt-2 text-2xl font-semibold tracking-tight"
        }
      >
        {value}
      </div>
    </Card>
  );
}
