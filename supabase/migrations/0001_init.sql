-- Plataforma TDC — schema inicial
-- Estrutura: courses → modules → lessons. Alunos se vinculam ao curso via enrollments
-- e o progresso é registrado por aula em lesson_progress.

create extension if not exists "uuid-ossp";

-- =========================
-- profiles (espelho de auth.users)
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

-- Cria profile automaticamente quando um user se registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================
-- courses
-- =========================
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  description text,
  cover_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================
-- modules
-- =========================
create table if not exists public.modules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  position int not null default 0,
  created_at timestamptz not null default now(),
  unique (course_id, slug)
);

create index if not exists modules_course_position_idx
  on public.modules (course_id, position);

-- =========================
-- lessons
-- =========================
create table if not exists public.lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  -- Bunny Stream: video library id + guid são suficientes para montar o iframe
  bunny_library_id text,
  bunny_video_guid text,
  duration_seconds int,
  position int not null default 0,
  created_at timestamptz not null default now(),
  unique (module_id, slug)
);

create index if not exists lessons_module_position_idx
  on public.lessons (module_id, position);

-- =========================
-- enrollments (quem tem acesso ao curso)
-- =========================
create table if not exists public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  expires_at timestamptz,
  unique (user_id, course_id)
);

create index if not exists enrollments_user_idx
  on public.enrollments (user_id);

-- =========================
-- lesson_progress
-- =========================
create table if not exists public.lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz,
  last_position_seconds int not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists lesson_progress_user_idx
  on public.lesson_progress (user_id);

-- =========================
-- Row Level Security
-- =========================
alter table public.profiles        enable row level security;
alter table public.courses         enable row level security;
alter table public.modules         enable row level security;
alter table public.lessons         enable row level security;
alter table public.enrollments     enable row level security;
alter table public.lesson_progress enable row level security;

-- profiles: cada um lê/atualiza o próprio perfil
drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);

-- courses/modules/lessons: leitura pública só para quem tem enrollment ativo no curso
drop policy if exists "courses read enrolled" on public.courses;
create policy "courses read enrolled" on public.courses
  for select using (
    is_published = true
    and exists (
      select 1 from public.enrollments e
      where e.user_id = auth.uid()
        and e.course_id = courses.id
        and (e.expires_at is null or e.expires_at > now())
    )
  );

drop policy if exists "modules read enrolled" on public.modules;
create policy "modules read enrolled" on public.modules
  for select using (
    exists (
      select 1 from public.enrollments e
      where e.user_id = auth.uid()
        and e.course_id = modules.course_id
        and (e.expires_at is null or e.expires_at > now())
    )
  );

drop policy if exists "lessons read enrolled" on public.lessons;
create policy "lessons read enrolled" on public.lessons
  for select using (
    exists (
      select 1
      from public.modules m
      join public.enrollments e on e.course_id = m.course_id
      where m.id = lessons.module_id
        and e.user_id = auth.uid()
        and (e.expires_at is null or e.expires_at > now())
    )
  );

-- enrollments: aluno lê os próprios; insert/delete só via service role (admin/back-office)
drop policy if exists "enrollments read own" on public.enrollments;
create policy "enrollments read own" on public.enrollments
  for select using (auth.uid() = user_id);

-- lesson_progress: aluno lê e escreve só o próprio
drop policy if exists "progress read own" on public.lesson_progress;
create policy "progress read own" on public.lesson_progress
  for select using (auth.uid() = user_id);

drop policy if exists "progress upsert own" on public.lesson_progress;
create policy "progress upsert own" on public.lesson_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "progress update own" on public.lesson_progress;
create policy "progress update own" on public.lesson_progress
  for update using (auth.uid() = user_id);
