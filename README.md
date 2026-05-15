# Plataforma TDC — Tributação do Transporte na Reforma Tributária

MVP de plataforma de cursos em **Next.js 16 (App Router) + Supabase + Tailwind 4**.
Vídeos servidos pelo **Bunny Stream**.

## O que está pronto neste MVP

- Autenticação por e-mail/senha via Supabase (login, cadastro, logout).
- Rotas protegidas por `proxy.ts` (Next.js 16 — antigo `middleware.ts`).
- Esquema Postgres com RLS: `courses`, `modules`, `lessons`, `enrollments`, `lesson_progress`, `live_sessions`.
- Drip release de aulas (`lessons.release_at`) e calendário de tira-dúvidas ao vivo.
- Dashboard listando módulos a que o aluno tem matrícula ativa.
- Página de módulo listando aulas.
- Página de aula com player Bunny Stream e botão "Marcar como concluída".
- Seed do curso de Reforma Tributária com 7 módulos, 57 aulas + 2 oficinas e 7 sessões ao vivo.

## Pré-requisitos

- Node.js **20.9+** (Next 16 não roda no 18).
- Conta Supabase grátis em <https://supabase.com>.
- Conta Bunny Stream em <https://bunny.net> (vídeo).

## Setup local

### 1. Variáveis de ambiente

```powershell
copy .env.example .env.local
```

Edite `.env.local` com as chaves do seu projeto Supabase
(painel → **Project Settings → API**).

### 2. Schema + seed no Supabase

No painel do Supabase, abra **SQL Editor** e execute, **nesta ordem**:

1. `supabase/migrations/0001_init.sql` — cria tabelas base, trigger e RLS.
2. `supabase/migrations/0002_profile_avatar_sync.sql` ... `0005_lesson_comments_notes.sql` — migrations subsequentes (avatar, leads, orders, comentários/anotações).
3. `supabase/migrations/0006_drip_release_and_live_sessions.sql` — coluna `lessons.release_at` (drip) + tabela `live_sessions` com RLS.
4. `supabase/seed.sql` — insere o curso **Tributação do Transporte Rodoviário na Reforma Tributária** (7 módulos, 57 aulas + 2 oficinas) e 7 sessões ao vivo com datas oficiais.

### 3. Subir os vídeos no Bunny Stream

1. Crie uma **Video Library** no Bunny Stream.
2. Faça upload dos vídeos das aulas.
3. Para cada aula, anote `library id` (na URL do dashboard) e `video guid`.
4. Atualize a tabela `lessons` no Supabase:

```sql
update public.lessons
set bunny_library_id = '658304',
    bunny_video_guid = 'a1b2c3d4-...'
where slug = 'aula-1-1';
```

### 4. Liberar acesso para um aluno

O cadastro pelo `/cadastro` cria o usuário em `auth.users` e o perfil correspondente,
mas **não dá acesso ao curso** automaticamente. Para liberar:

```sql
insert into public.enrollments (user_id, course_id)
select u.id, c.id
from auth.users u, public.courses c
where u.email = 'aluno@exemplo.com'
  and c.slug  = 'reforma-tributaria-transporte';
```

### 5. Rodar o app

```powershell
npm install
npm run dev
```

Acesse <http://localhost:3000>.

## Estrutura

```text
src/
├── app/
│   ├── (auth)/                login, cadastro, server actions de auth
│   ├── (app)/                 área autenticada
│   │   ├── dashboard/         lista cursos/módulos do aluno
│   │   ├── modulo/[slug]/     lista aulas do módulo
│   │   └── aula/[slug]/       player + marcar concluída
│   ├── layout.tsx
│   └── page.tsx               redireciona para /login ou /dashboard
├── components/
│   └── bunny-player.tsx       iframe do Bunny Stream
├── lib/supabase/
│   ├── client.ts              cliente browser
│   ├── server.ts              cliente server components / actions
│   └── proxy.ts               refresh de sessão + redirect
└── proxy.ts                   roda em todas as requisições
supabase/
├── migrations/0001_init.sql
└── seed.sql
```

## Próximos passos sugeridos (fora do MVP)

- **Pagamento** (Asaas / Pagar.me / Mercado Pago) → webhook que cria `enrollment` automático.
- **Página admin** (cadastro/edição de aulas, upload direto pro Bunny).
- **Progresso visual** no dashboard (% por módulo, próxima aula).
- **Certificado** após 100% das aulas concluídas.
- **Materiais complementares** (PDFs por aula via Supabase Storage).
- **Tracking de tempo assistido** via API de eventos do Bunny Stream.

## Notas importantes do Next.js 16

- `cookies()`, `headers()`, `params`, `searchParams` são **assíncronos** — sempre `await`.
- O antigo `middleware.ts` agora se chama **`proxy.ts`** e roda apenas no runtime Node.
- Gerar tipos de rotas: `npx next typegen` (já roda automaticamente em dev/build).
- Tailwind 4: nada de `tailwind.config.js`; configure via `@theme` em `globals.css`.
