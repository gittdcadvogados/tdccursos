-- Seed do curso: Tributação do Transporte Rodoviário na Reforma Tributária
-- Cronograma oficial: maio/2026. Datas em BRT (UTC-03).
-- Aula inaugural (03/ago) é pública e NÃO entra na tabela lessons — vive em /aula-inaugural.
-- Aulas regulares: 57 numeradas + 2 oficinas práticas no Módulo 6.
-- Sessões ao vivo: 7 (uma por módulo, a última é encerramento).
-- Vídeos do Bunny Stream (bunny_video_guid) são preenchidos depois do upload.

-- =========================
-- Curso
-- =========================
insert into public.courses (slug, title, description)
values (
  'reforma-tributaria-transporte',
  'Tributação do Transporte Rodoviário na Reforma Tributária',
  'IBS, CBS, ICMS e a transição — impactos e estratégias para transportadoras. Conduzido pelo Prof. Rafael Vieira (TDC Cursos e Eventos).'
)
on conflict (slug) do update
  set title = excluded.title,
      description = excluded.description;

-- =========================
-- Módulos (slugs batem com src/components/course/modules-overview.tsx)
-- =========================
with c as (select id from public.courses where slug = 'reforma-tributaria-transporte')
insert into public.modules (course_id, slug, title, position)
select c.id, m.slug, m.title, m.position
from c, (values
  ('tributacao-do-consumo',   'A Nova Tributação do Consumo',                    1),
  ('cargas',                  'IBS e CBS no Transporte Rodoviário de Cargas',    2),
  ('passageiros',             'IBS e CBS no Transporte de Passageiros',          3),
  ('creditos',                'Gestão de Créditos e Regimes Diferenciados',      4),
  ('icms-transicao',          'ICMS na Transição',                               5),
  ('obrigacoes-acessorias',   'Obrigações Acessórias e Documentos Fiscais',      6),
  ('estrategia',              'Estratégia e Planejamento na Transição',          7)
) as m(slug, title, position)
on conflict (course_id, slug) do update
  set title = excluded.title,
      position = excluded.position;

-- =========================
-- Aulas — Módulo 1 (8 aulas, libera 03/ago e 10/ago)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'tributacao-do-consumo'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('aula-1-1', 'Aula 1.1', 1, '2026-08-03 00:00:00-03'),
  ('aula-1-2', 'Aula 1.2', 2, '2026-08-03 00:00:00-03'),
  ('aula-1-3', 'Aula 1.3', 3, '2026-08-03 00:00:00-03'),
  ('aula-1-4', 'Aula 1.4', 4, '2026-08-03 00:00:00-03'),
  ('aula-1-5', 'Aula 1.5', 5, '2026-08-10 00:00:00-03'),
  ('aula-1-6', 'Aula 1.6', 6, '2026-08-10 00:00:00-03'),
  ('aula-1-7', 'Aula 1.7', 7, '2026-08-10 00:00:00-03'),
  ('aula-1-8', 'Aula 1.8', 8, '2026-08-10 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set release_at = excluded.release_at, position = excluded.position;

-- =========================
-- Aulas — Módulo 2 (11 aulas, libera 17/ago, 24/ago, 31/ago)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'cargas'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('aula-2-1',  'Aula 2.1',  1,  '2026-08-17 00:00:00-03'),
  ('aula-2-2',  'Aula 2.2',  2,  '2026-08-17 00:00:00-03'),
  ('aula-2-3',  'Aula 2.3',  3,  '2026-08-17 00:00:00-03'),
  ('aula-2-4',  'Aula 2.4',  4,  '2026-08-17 00:00:00-03'),
  ('aula-2-5',  'Aula 2.5',  5,  '2026-08-24 00:00:00-03'),
  ('aula-2-6',  'Aula 2.6',  6,  '2026-08-24 00:00:00-03'),
  ('aula-2-7',  'Aula 2.7',  7,  '2026-08-24 00:00:00-03'),
  ('aula-2-8',  'Aula 2.8',  8,  '2026-08-24 00:00:00-03'),
  ('aula-2-9',  'Aula 2.9',  9,  '2026-08-31 00:00:00-03'),
  ('aula-2-10', 'Aula 2.10', 10, '2026-08-31 00:00:00-03'),
  ('aula-2-11', 'Aula 2.11', 11, '2026-08-31 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set release_at = excluded.release_at, position = excluded.position;

-- =========================
-- Aulas — Módulo 3 (5 aulas, libera 08/set — terça, feriado 7/set deslocou)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'passageiros'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('aula-3-1', 'Aula 3.1', 1, '2026-09-08 00:00:00-03'),
  ('aula-3-2', 'Aula 3.2', 2, '2026-09-08 00:00:00-03'),
  ('aula-3-3', 'Aula 3.3', 3, '2026-09-08 00:00:00-03'),
  ('aula-3-4', 'Aula 3.4', 4, '2026-09-08 00:00:00-03'),
  ('aula-3-5', 'Aula 3.5', 5, '2026-09-08 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set release_at = excluded.release_at, position = excluded.position;

-- =========================
-- Aulas — Módulo 4 (11 aulas, libera 14/set, 21/set, 28/set)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'creditos'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('aula-4-1',  'Aula 4.1',  1,  '2026-09-14 00:00:00-03'),
  ('aula-4-2',  'Aula 4.2',  2,  '2026-09-14 00:00:00-03'),
  ('aula-4-3',  'Aula 4.3',  3,  '2026-09-14 00:00:00-03'),
  ('aula-4-4',  'Aula 4.4',  4,  '2026-09-14 00:00:00-03'),
  ('aula-4-5',  'Aula 4.5',  5,  '2026-09-21 00:00:00-03'),
  ('aula-4-6',  'Aula 4.6',  6,  '2026-09-21 00:00:00-03'),
  ('aula-4-7',  'Aula 4.7',  7,  '2026-09-21 00:00:00-03'),
  ('aula-4-8',  'Aula 4.8',  8,  '2026-09-21 00:00:00-03'),
  ('aula-4-9',  'Aula 4.9',  9,  '2026-09-28 00:00:00-03'),
  ('aula-4-10', 'Aula 4.10', 10, '2026-09-28 00:00:00-03'),
  ('aula-4-11', 'Aula 4.11', 11, '2026-09-28 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set release_at = excluded.release_at, position = excluded.position;

-- =========================
-- Aulas — Módulo 5 (9 aulas, libera 05/out e 13/out — terça, feriado 12/out)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'icms-transicao'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('aula-5-1', 'Aula 5.1', 1, '2026-10-05 00:00:00-03'),
  ('aula-5-2', 'Aula 5.2', 2, '2026-10-05 00:00:00-03'),
  ('aula-5-3', 'Aula 5.3', 3, '2026-10-05 00:00:00-03'),
  ('aula-5-4', 'Aula 5.4', 4, '2026-10-05 00:00:00-03'),
  ('aula-5-5', 'Aula 5.5', 5, '2026-10-05 00:00:00-03'),
  ('aula-5-6', 'Aula 5.6', 6, '2026-10-13 00:00:00-03'),
  ('aula-5-7', 'Aula 5.7', 7, '2026-10-13 00:00:00-03'),
  ('aula-5-8', 'Aula 5.8', 8, '2026-10-13 00:00:00-03'),
  ('aula-5-9', 'Aula 5.9', 9, '2026-10-13 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set release_at = excluded.release_at, position = excluded.position;

-- =========================
-- Aulas — Módulo 6 (8 aulas + 2 oficinas, libera 19/out e 26/out)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'obrigacoes-acessorias'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('aula-6-1',  'Aula 6.1', 1,  '2026-10-19 00:00:00-03'),
  ('aula-6-2',  'Aula 6.2', 2,  '2026-10-19 00:00:00-03'),
  ('aula-6-3',  'Aula 6.3', 3,  '2026-10-19 00:00:00-03'),
  ('aula-6-4',  'Aula 6.4', 4,  '2026-10-19 00:00:00-03'),
  ('aula-6-5',  'Aula 6.5', 5,  '2026-10-26 00:00:00-03'),
  ('aula-6-6',  'Aula 6.6', 6,  '2026-10-26 00:00:00-03'),
  ('aula-6-7',  'Aula 6.7', 7,  '2026-10-26 00:00:00-03'),
  ('aula-6-8',  'Aula 6.8', 8,  '2026-10-26 00:00:00-03'),
  ('oficina-1', 'Oficina 1 — Preenchimento do CT-e',                9, '2026-10-26 00:00:00-03'),
  ('oficina-2', 'Oficina 2 — CT-e OS e cenários de subcontratação', 10,'2026-10-26 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set release_at = excluded.release_at, position = excluded.position;

-- =========================
-- Aulas — Módulo 7 (5 aulas, libera 02/nov)
-- =========================
with m as (
  select mod.id from public.modules mod
  join public.courses c on c.id = mod.course_id
  where c.slug = 'reforma-tributaria-transporte' and mod.slug = 'estrategia'
)
insert into public.lessons (module_id, slug, title, position, release_at)
select m.id, l.slug, l.title, l.position, l.release_at::timestamptz
from m, (values
  ('aula-7-1', 'Aula 7.1', 1, '2026-11-02 00:00:00-03'),
  ('aula-7-2', 'Aula 7.2', 2, '2026-11-02 00:00:00-03'),
  ('aula-7-3', 'Aula 7.3', 3, '2026-11-02 00:00:00-03'),
  ('aula-7-4', 'Aula 7.4', 4, '2026-11-02 00:00:00-03'),
  ('aula-7-5', 'Aula 7.5', 5, '2026-11-02 00:00:00-03')
) as l(slug, title, position, release_at)
on conflict (module_id, slug) do update
  set release_at = excluded.release_at, position = excluded.position;

-- =========================
-- Sessões ao vivo — 7 tira-dúvidas (19:30 BRT, sempre quinta)
-- starts_at ajustável depois pelo admin sem perder seed (on conflict do nothing).
-- =========================
with ctx as (
  select c.id as course_id from public.courses c
  where c.slug = 'reforma-tributaria-transporte'
)
insert into public.live_sessions (course_id, module_id, slug, title, starts_at, duration_minutes, position)
select
  ctx.course_id,
  (select m.id from public.modules m
    where m.course_id = ctx.course_id and m.slug = ls.module_slug),
  ls.slug,
  ls.title,
  ls.starts_at::timestamptz,
  ls.duration_minutes,
  ls.position
from ctx, (values
  ('tira-duvidas-modulo-1', 'tributacao-do-consumo',   'Tira-dúvidas — A Nova Tributação do Consumo',     '2026-08-13 19:30:00-03', 90, 1),
  ('tira-duvidas-modulo-2', 'cargas',                  'Tira-dúvidas — IBS/CBS no Transporte de Cargas',  '2026-09-03 19:30:00-03', 90, 2),
  ('tira-duvidas-modulo-3', 'passageiros',             'Tira-dúvidas — Transporte de Passageiros',        '2026-09-10 19:30:00-03', 90, 3),
  ('tira-duvidas-modulo-4', 'creditos',                'Tira-dúvidas — Gestão de Créditos',               '2026-10-01 19:30:00-03', 90, 4),
  ('tira-duvidas-modulo-5', 'icms-transicao',          'Tira-dúvidas — ICMS na Transição',                '2026-10-15 19:30:00-03', 90, 5),
  ('tira-duvidas-modulo-6', 'obrigacoes-acessorias',   'Tira-dúvidas — Obrigações Acessórias',            '2026-10-29 19:30:00-03', 90, 6),
  ('tira-duvidas-encerramento', 'estrategia',          'Tira-dúvidas Final + Encerramento',               '2026-11-05 19:30:00-03', 90, 7)
) as ls(slug, module_slug, title, starts_at, duration_minutes, position)
on conflict (course_id, slug) do update
  set starts_at = excluded.starts_at,
      title = excluded.title,
      position = excluded.position;
