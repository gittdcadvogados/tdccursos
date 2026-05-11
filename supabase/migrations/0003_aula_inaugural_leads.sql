-- 0003_aula_inaugural_leads.sql
-- Tabela de leads capturados pelo gate da aula inaugural gratuita.
-- Visitante anônimo informa nome + email pra desbloquear o vídeo.
-- Mais tarde, esses leads podem virar pipeline de nurturing por email.

create table if not exists public.aula_inaugural_leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  source text,                                -- de onde veio (utm_source, etc.)
  user_agent text,
  ip inet,
  created_at timestamptz not null default now()
);

-- Email único: se a pessoa voltar com o mesmo email, atualizamos em vez de duplicar.
create unique index if not exists aula_inaugural_leads_email_idx
  on public.aula_inaugural_leads (lower(email));

-- RLS: NINGUÉM lê via API pública. Inserts só via service_role (server action).
alter table public.aula_inaugural_leads enable row level security;

-- Nenhuma policy de SELECT/INSERT/UPDATE pro role `anon` ou `authenticated`,
-- então só o service_role consegue mexer. Isso é o que queremos: o form envia
-- via server action que usa service role pra inserir; ninguém consegue ler a
-- lista de leads pelo browser.

create index if not exists aula_inaugural_leads_created_at_idx
  on public.aula_inaugural_leads (created_at desc);
