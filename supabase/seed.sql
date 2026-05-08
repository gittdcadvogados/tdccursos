-- Seed do curso TDC — Bases da Oratória (4 módulos)
-- Os bunny_library_id / bunny_video_guid devem ser preenchidos depois que os vídeos
-- forem subidos no Bunny Stream.

insert into public.courses (slug, title, description)
values (
  'oratoria-tdc',
  'Oratória para Advogados — TDC',
  'Curso completo de oratória aplicada à advocacia, com bases teóricas, exercícios práticos e técnicas de troca inteligente.'
)
on conflict (slug) do nothing;

-- Módulos
with c as (select id from public.courses where slug = 'oratoria-tdc')
insert into public.modules (course_id, slug, title, position)
select c.id, m.slug, m.title, m.position
from c, (values
  ('bases-da-oratoria',     'Módulo 01 — Bases da oratória',         1),
  ('exercicios-praticos',   'Módulo 02 — Exercícios práticos',       2),
  ('conhecimentos-fund',    'Módulo 03 — Conhecimentos fundamentais', 3),
  ('trocas-inteligentes',   'Módulo 04 — Trocas inteligentes',        4)
) as m(slug, title, position)
on conflict (course_id, slug) do nothing;

-- Aulas placeholder (uma por módulo) — preencha bunny_video_guid depois
with mods as (
  select m.id, m.slug
  from public.modules m
  join public.courses c on c.id = m.course_id
  where c.slug = 'oratoria-tdc'
)
insert into public.lessons (module_id, slug, title, position)
select mods.id, 'aula-1', 'Aula 1 — Introdução', 1
from mods
on conflict (module_id, slug) do nothing;
