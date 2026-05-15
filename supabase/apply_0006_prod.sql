-- ============================================================================
-- APLICAÇÃO EM PRODUÇÃO — curso "reforma-tributaria-transporte" já populado.
-- Este script é SEGURO e IDEMPOTENTE: só adiciona schema novo, insere as 7
-- sessões ao vivo (tabela vazia) e preenche release_at nas 59 aulas EXISTENTES
-- por módulo+posição. NÃO cria/duplica aulas. Pode rodar mais de uma vez.
--
-- Como usar: painel Supabase -> SQL Editor -> cole tudo -> Run.
-- ============================================================================

-- 1) SCHEMA — coluna de drip + tabela de encontros ao vivo --------------------
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

-- 2) SESSÕES AO VIVO — 7 tira-dúvidas, 19:30 BRT (sempre quinta) --------------
insert into public.live_sessions (course_id, module_id, slug, title, starts_at, duration_minutes, position)
select
  c.id,
  (select m.id from public.modules m where m.course_id = c.id and m.slug = ls.module_slug),
  ls.slug, ls.title, ls.starts_at::timestamptz, 90, ls.position
from public.courses c
cross join (values
  ('tira-duvidas-modulo-1',     'tributacao-do-consumo',  'Tira-dúvidas — A Nova Tributação do Consumo',     '2026-08-13 19:30:00-03', 1),
  ('tira-duvidas-modulo-2',     'cargas',                 'Tira-dúvidas — IBS/CBS no Transporte de Cargas',  '2026-09-03 19:30:00-03', 2),
  ('tira-duvidas-modulo-3',     'passageiros',            'Tira-dúvidas — Transporte de Passageiros',        '2026-09-10 19:30:00-03', 3),
  ('tira-duvidas-modulo-4',     'creditos',               'Tira-dúvidas — Gestão de Créditos',               '2026-10-01 19:30:00-03', 4),
  ('tira-duvidas-modulo-5',     'icms-transicao',         'Tira-dúvidas — ICMS na Transição',                '2026-10-15 19:30:00-03', 5),
  ('tira-duvidas-modulo-6',     'obrigacoes-acessorias',  'Tira-dúvidas — Obrigações Acessórias',            '2026-10-29 19:30:00-03', 6),
  ('tira-duvidas-encerramento', 'estrategia',             'Tira-dúvidas Final + Encerramento',               '2026-11-05 19:30:00-03', 7)
) as ls(slug, module_slug, title, starts_at, position)
where c.slug = 'reforma-tributaria-transporte'
on conflict (course_id, slug) do update
  set starts_at = excluded.starts_at,
      title     = excluded.title,
      position  = excluded.position,
      module_id = excluded.module_id;

-- 3) DRIP — release_at nas 59 aulas existentes, por módulo + faixa de posição --
-- Datas do cronograma oficial (maio/2026), com ajustes de feriado:
--   M3 deslocado p/ ter 08/set (feriado 07/set) · M5 2ª leva p/ ter 13/out (feriado 12/out)
update public.lessons l
set release_at = v.release_at
from (
  select m.id as module_id, r.pos_from, r.pos_to, r.release_at::timestamptz as release_at
  from public.modules m
  join public.courses c on c.id = m.course_id
  join (values
    ('tributacao-do-consumo',  1, 4,  '2026-08-03 00:00:00-03'),
    ('tributacao-do-consumo',  5, 8,  '2026-08-10 00:00:00-03'),
    ('cargas',                 1, 4,  '2026-08-17 00:00:00-03'),
    ('cargas',                 5, 8,  '2026-08-24 00:00:00-03'),
    ('cargas',                 9, 11, '2026-08-31 00:00:00-03'),
    ('passageiros',            1, 5,  '2026-09-08 00:00:00-03'),
    ('creditos',               1, 4,  '2026-09-14 00:00:00-03'),
    ('creditos',               5, 8,  '2026-09-21 00:00:00-03'),
    ('creditos',               9, 11, '2026-09-28 00:00:00-03'),
    ('icms-transicao',         1, 5,  '2026-10-05 00:00:00-03'),
    ('icms-transicao',         6, 9,  '2026-10-13 00:00:00-03'),
    ('obrigacoes-acessorias',  1, 4,  '2026-10-19 00:00:00-03'),
    ('obrigacoes-acessorias',  5, 10, '2026-10-26 00:00:00-03'),
    ('estrategia',             1, 5,  '2026-11-02 00:00:00-03')
  ) as r(module_slug, pos_from, pos_to, release_at) on r.module_slug = m.slug
  where c.slug = 'reforma-tributaria-transporte'
) v
where l.module_id = v.module_id
  and l.position between v.pos_from and v.pos_to;

-- Conferência rápida (opcional):
-- select m.position as mod, l.position as aula, l.title, l.release_at
-- from public.lessons l join public.modules m on m.id = l.module_id
-- join public.courses c on c.id = m.course_id
-- where c.slug = 'reforma-tributaria-transporte' order by m.position, l.position;
