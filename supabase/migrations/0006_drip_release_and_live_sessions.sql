-- Drip release + encontros ao vivo
-- 1) lessons.release_at: data a partir da qual a aula fica liberada. Null = libera imediato.
-- 2) live_sessions: tira-dúvidas / encontros ao vivo do curso (Zoom, Meet, etc.).

alter table public.lessons
  add column if not exists release_at timestamptz;

create index if not exists lessons_release_at_idx
  on public.lessons (release_at);

create table if not exists public.live_sessions (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid references public.modules(id) on delete set null,
  slug text not null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  duration_minutes int not null default 90,
  zoom_url text,
  recording_url text,
  position int not null default 0,
  created_at timestamptz not null default now(),
  unique (course_id, slug)
);

create index if not exists live_sessions_course_starts_idx
  on public.live_sessions (course_id, starts_at);

alter table public.live_sessions enable row level security;

drop policy if exists "live_sessions read enrolled" on public.live_sessions;
create policy "live_sessions read enrolled" on public.live_sessions
  for select using (
    exists (
      select 1 from public.enrollments e
      where e.user_id = auth.uid()
        and e.course_id = live_sessions.course_id
        and (e.expires_at is null or e.expires_at > now())
    )
  );
