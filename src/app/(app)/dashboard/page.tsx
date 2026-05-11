import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Clock,
  GraduationCap,
  Layers,
  PlayCircle,
  Radio,
  Wrench,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProfileBanner } from "@/components/dashboard/profile-banner";
import { ModuleCard } from "@/components/dashboard/module-card";
import { buttonVariants } from "@/components/ui/button";

type ModuleRow = { id: string; slug: string; title: string; position: number };
type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  modules: ModuleRow[];
};

function initials(name: string | null | undefined, email: string) {
  const source = (name?.trim() || email).trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, display_name, avatar_url")
    .eq("id", user!.id)
    .maybeSingle();

  const { data: courses } = await supabase
    .from("courses")
    .select(
      "id, slug, title, description, cover_url, modules(id, slug, title, position)",
    )
    .order("position", { referencedTable: "modules", ascending: true })
    .returns<CourseRow[]>();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, module_id, modules!inner(course_id)")
    .returns<
      { id: string; module_id: string; modules: { course_id: string } }[]
    >();

  const { data: completed } = await supabase
    .from("lesson_progress")
    .select(
      "lesson_id, completed_at, lessons!inner(module_id, modules!inner(course_id))",
    )
    .eq("user_id", user!.id)
    .not("completed_at", "is", null)
    .returns<
      {
        lesson_id: string;
        completed_at: string;
        lessons: { module_id: string; modules: { course_id: string } };
      }[]
    >();

  // Última aula com progresso (para "continuar de onde parou")
  const { data: lastTouched } = await supabase
    .from("lesson_progress")
    .select(
      "lesson_id, last_position_seconds, completed_at, updated_at, lessons!inner(slug, title, position, modules!inner(slug, title, position))",
    )
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()
    .returns<{
      lesson_id: string;
      last_position_seconds: number;
      completed_at: string | null;
      updated_at: string;
      lessons: {
        slug: string;
        title: string;
        position: number;
        modules: { slug: string; title: string; position: number };
      };
    } | null>();

  const totalsByCourse = new Map<string, number>();
  const totalsByModule = new Map<string, number>();
  for (const l of lessons ?? []) {
    const cid = l.modules.course_id;
    totalsByCourse.set(cid, (totalsByCourse.get(cid) ?? 0) + 1);
    totalsByModule.set(l.module_id, (totalsByModule.get(l.module_id) ?? 0) + 1);
  }
  const completedByCourse = new Map<string, number>();
  const completedByModule = new Map<string, number>();
  for (const c of completed ?? []) {
    const cid = c.lessons.modules.course_id;
    const mid = c.lessons.module_id;
    completedByCourse.set(cid, (completedByCourse.get(cid) ?? 0) + 1);
    completedByModule.set(mid, (completedByModule.get(mid) ?? 0) + 1);
  }

  const totalLessons = lessons?.length ?? 0;
  const totalCompleted = completed?.length ?? 0;
  const totalModules = (courses ?? []).reduce(
    (acc, c) => acc + (c.modules?.length ?? 0),
    0,
  );
  const overallPct =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const display =
    profile?.display_name?.trim() ||
    profile?.full_name?.trim() ||
    user!.email!;
  const userInitials = initials(profile?.full_name, user!.email!);

  if (!courses || courses.length === 0) {
    return (
      <div className="space-y-8">
        <ProfileBanner
          fullName={display}
          email={user!.email!}
          initials={userInitials}
          avatarUrl={profile?.avatar_url}
          progressDone={0}
          progressTotal={0}
        />
        <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-foreground-muted" />
          <h2 className="mt-3 text-lg font-semibold tracking-tight">
            Nenhum curso disponível ainda
          </h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Você ainda não tem matrícula ativa. Aguarde a liberação de acesso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <ProfileBanner
        fullName={display}
        email={user!.email!}
        initials={userInitials}
        avatarUrl={profile?.avatar_url}
        progressDone={totalCompleted}
        progressTotal={totalLessons}
      />

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
                  Módulo {String(lastTouched.lessons.modules.position).padStart(2, "0")} · Aula {String(lastTouched.lessons.position).padStart(2, "0")}
                </div>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-accent transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Link>
      )}

      {/* Stats grid */}
      <section>
        <header className="mb-4 flex items-center justify-between">
          <div>
            <span className="tech-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              ▸ DASHBOARD
            </span>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Visão geral do curso
            </h1>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard
            icon={PlayCircle}
            label="AULAS_CONCLUIDAS"
            value={`${totalCompleted}/${totalLessons}`}
            hint="Videoaulas marcadas como vistas"
            tone="emerald"
          />
          <StatCard
            icon={Layers}
            label="MODULOS"
            value={String(totalModules)}
            hint="Do fundamento à estratégia"
            tone="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="PROGRESSO"
            value={`${overallPct}%`}
            hint="Média geral do curso"
            tone="violet"
          />
          <StatCard
            icon={Radio}
            label="ENCONTROS_AO_VIVO"
            value="07"
            hint="Tira-dúvidas com o professor"
            tone="rose"
          />
          <StatCard
            icon={Wrench}
            label="OFICINAS"
            value="02"
            hint="CT-e e CT-e OS na prática"
            tone="amber"
          />
          <StatCard
            icon={Clock}
            label="CARGA_HORARIA"
            value="25h"
            hint="Tempo total de videoaulas"
            tone="cyan"
          />
        </div>
      </section>

      {/* Cursos */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold tracking-tight">Seus cursos</h2>
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
                  <span className="tech-mono rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-soft-fg">
                    {pct}% concluído
                  </span>
                </div>

                <Progress value={pct} className="mt-4" />
                <div className="mt-1.5 flex items-center justify-between text-xs text-foreground-muted">
                  <span className="tech-mono">
                    {done.toString().padStart(2, "0")} / {total.toString().padStart(2, "0")} aulas
                  </span>
                  {done === total && total > 0 && (
                    <span className="inline-flex items-center gap-1 text-accent">
                      <Award className="h-3.5 w-3.5" />
                      Completo
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {course.modules?.map((m) => (
                    <ModuleCard
                      key={m.id}
                      slug={m.slug}
                      position={m.position}
                      title={m.title}
                      lessonsTotal={totalsByModule.get(m.id) ?? 0}
                      lessonsDone={completedByModule.get(m.id) ?? 0}
                      coverUrl={course.cover_url}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
