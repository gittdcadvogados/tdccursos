-- Comentários (fórum por aula, alunos matriculados + professor) e
-- anotações pessoais (privadas) por aula.

-- =========================
-- lesson_notes — bloco de notas pessoal do aluno por aula
-- =========================
create table if not exists public.lesson_notes (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  body text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_notes enable row level security;

drop policy if exists "notes read own" on public.lesson_notes;
create policy "notes read own" on public.lesson_notes
  for select using ((select auth.uid()) = user_id);

drop policy if exists "notes insert own" on public.lesson_notes;
create policy "notes insert own" on public.lesson_notes
  for insert with check ((select auth.uid()) = user_id);

drop policy if exists "notes update own" on public.lesson_notes;
create policy "notes update own" on public.lesson_notes
  for update using ((select auth.uid()) = user_id);

drop policy if exists "notes delete own" on public.lesson_notes;
create policy "notes delete own" on public.lesson_notes
  for delete using ((select auth.uid()) = user_id);

-- =========================
-- lesson_comments — fórum por aula
-- =========================
create table if not exists public.lesson_comments (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.lesson_comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lesson_comments_lesson_idx
  on public.lesson_comments (lesson_id, created_at desc);
create index if not exists lesson_comments_parent_idx
  on public.lesson_comments (parent_id);

alter table public.lesson_comments enable row level security;

-- Leitura: só matriculado no curso da aula
drop policy if exists "comments read enrolled" on public.lesson_comments;
create policy "comments read enrolled" on public.lesson_comments
  for select using (
    exists (
      select 1
      from public.lessons l
      join public.modules m on m.id = l.module_id
      join public.enrollments e on e.course_id = m.course_id
      where l.id = lesson_comments.lesson_id
        and e.user_id = (select auth.uid())
        and (e.expires_at is null or e.expires_at > now())
    )
  );

-- Insert: matriculado e autor é o próprio usuário
drop policy if exists "comments insert enrolled" on public.lesson_comments;
create policy "comments insert enrolled" on public.lesson_comments
  for insert with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.lessons l
      join public.modules m on m.id = l.module_id
      join public.enrollments e on e.course_id = m.course_id
      where l.id = lesson_comments.lesson_id
        and e.user_id = (select auth.uid())
        and (e.expires_at is null or e.expires_at > now())
    )
  );

drop policy if exists "comments update own" on public.lesson_comments;
create policy "comments update own" on public.lesson_comments
  for update using ((select auth.uid()) = user_id);

drop policy if exists "comments delete own" on public.lesson_comments;
create policy "comments delete own" on public.lesson_comments
  for delete using ((select auth.uid()) = user_id);

-- =========================
-- profiles — permitir leitura básica de qualquer authenticated (pra autoria do fórum)
-- =========================
-- A policy "profiles read own" continua, mas adicionamos uma mais permissiva.
-- Justificativa: o fórum precisa mostrar full_name/avatar de outros matriculados.
drop policy if exists "profiles read public" on public.profiles;
create policy "profiles read public" on public.profiles
  for select using ((select auth.uid()) is not null);
