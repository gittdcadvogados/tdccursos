-- 0004_orders.sql
-- Tabela de pedidos para o checkout via Asaas (Pix + Cartão + Boleto no mesmo link).
-- Fluxo: visitante chega em /comprar/[slug] -> server action cria cliente + cobrança Asaas
-- -> redireciona pro invoiceUrl -> webhook /api/webhooks/asaas confirma pagamento ->
-- cria enrollment automaticamente.

-- Preço por curso (faltava no schema original)
alter table public.courses
  add column if not exists price_cents int not null default 0;

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),

  -- vínculo com aluno: pode ser null no momento da criação (compra antes do cadastro)
  -- e ser preenchido quando o webhook resolver o user_id por email
  profile_id uuid references public.profiles(id) on delete set null,
  course_id  uuid not null references public.courses(id) on delete restrict,

  -- dados do comprador (necessário pro Asaas mesmo que não tenha conta ainda)
  customer_name      text not null,
  customer_email     text not null,
  customer_cpf_cnpj  text not null,
  customer_phone     text,

  amount_cents int not null,

  gateway text not null default 'asaas' check (gateway in ('asaas', 'mercadopago')),

  asaas_customer_id text,
  asaas_payment_id  text unique,
  invoice_url       text,

  -- Espelha o ciclo de vida do pagamento no Asaas:
  -- PENDING -> CONFIRMED|RECEIVED (pago) | OVERDUE | REFUNDED | CANCELED
  status text not null default 'PENDING'
    check (status in ('PENDING','CONFIRMED','RECEIVED','OVERDUE','REFUNDED','CANCELED')),

  paid_at    timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_email_idx        on public.orders (lower(customer_email));
create index if not exists orders_status_idx       on public.orders (status);
create index if not exists orders_course_idx       on public.orders (course_id);
create index if not exists orders_asaas_payment_idx on public.orders (asaas_payment_id);

-- Log bruto dos webhooks recebidos (auditoria + debug).
-- Guardamos o payload inteiro: se algo der errado no parse ou na criação do enrollment,
-- conseguimos reprocessar manualmente.
create table if not exists public.payment_webhooks (
  id uuid primary key default uuid_generate_v4(),
  gateway text not null,
  event_type text,
  payment_id text,
  payload jsonb not null,
  processed boolean not null default false,
  error text,
  received_at timestamptz not null default now()
);

create index if not exists payment_webhooks_payment_idx on public.payment_webhooks (payment_id);
create index if not exists payment_webhooks_processed_idx on public.payment_webhooks (processed, received_at desc);

-- =========================
-- Row Level Security
-- =========================
alter table public.orders           enable row level security;
alter table public.payment_webhooks enable row level security;

-- orders: aluno lê os próprios pedidos (após cadastro). Inserts/updates só via service_role
-- (server actions e webhook).
drop policy if exists "orders read own" on public.orders;
create policy "orders read own" on public.orders
  for select using (auth.uid() = profile_id);

-- payment_webhooks: ninguém lê pela API pública. Só service_role.
-- (Nenhuma policy = nenhum acesso a anon/authenticated.)

-- =========================
-- Ajuste em courses: permitir leitura pública de cursos publicados.
-- Necessário para a página /comprar/[slug] funcionar sem login.
-- A policy original "courses read enrolled" continua existindo (para acesso ao
-- conteúdo gated), só adicionamos uma policy adicional de catálogo público.
-- =========================
drop policy if exists "courses public catalog" on public.courses;
create policy "courses public catalog" on public.courses
  for select using (is_published = true);

