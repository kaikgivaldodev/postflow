# PostFlow

Ferramenta de agendamento de posts para Instagram. Ver
`../POSTFLOW_MASTER_BLUEPRINT.md` para o blueprint completo do produto.

## Status atual

Implementado até aqui (seção 16 do blueprint, passos 1–4):

1. ✅ Setup Next.js 14 (App Router) + Tailwind CSS + shadcn/ui (Radix UI)
2. ✅ Schema do Supabase + RLS (`supabase/migrations/0001_init.sql`)
3. ✅ Auth completo: login, cadastro, recuperação/redefinição de senha,
   botão de login com Google (requer configurar o provider no Supabase)
4. ✅ Landing page completa (hero, prova social, como funciona, recursos,
   preços com toggle mensal/anual, FAQ, CTA final, footer, banner de cookies)
   + páginas legais (Termos, Privacidade, Cookies)

Também já aplicados: headers de segurança (`next.config.mjs`), tokens de
design da seção 3 (`app/globals.css`) e a estrutura de pastas da seção 13.

Ainda não implementado (próximos passos do blueprint): conexão OAuth com o
Instagram, formulário/calendário de posts, cron de publicação, integração
SyncPay, emails transacionais, rate limiting com Upstash, fluxo LGPD de
exportar/excluir dados.

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No SQL Editor do projeto, rode o conteúdo de
   `supabase/migrations/0001_init.sql` (cria todas as tabelas, triggers e
   políticas de RLS da seção 4 do blueprint).
3. Em **Authentication → URL Configuration**, defina a Site URL como
   `http://localhost:3000` (ou seu domínio em produção) e adicione
   `http://localhost:3000/auth/callback` em Redirect URLs.
4. (Opcional) Em **Authentication → Providers**, ative o provider **Google**
   para o botão "Continuar com Google" funcionar.
5. Copie `Project URL`, `anon public key` e `service_role key` (Settings →
   API) para o `.env.local`.

### 3. Variáveis de ambiente

Copie `.env.local.example` e preencha com suas credenciais reais:

```bash
cp .env.local.example .env.local
```

Um `.env.local` com valores placeholder já está incluso para permitir rodar
`npm run build`/`npm run dev` sem credenciais reais — mas o Auth só funciona
de verdade com um projeto Supabase configurado.

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui (Radix UI) ·
React Hook Form + Zod · TanStack Query · Zustand · Supabase (Postgres + Auth
+ Storage) · `@supabase/ssr` para auth no App Router.

## Estrutura

Ver seção 13 do blueprint. Principais pastas:

- `app/(landing)` — site público (home, preços, páginas legais)
- `app/(auth)` — login, cadastro, recuperação de senha
- `app/(app)` — área logada (protegida pelo `middleware.ts`)
- `app/api` — API routes (posts, Instagram, webhooks, cron)
- `lib/supabase` — clients browser/server/admin + middleware de sessão
- `lib/actions/auth.ts` — Server Actions de autenticação
- `supabase/migrations` — schema SQL + RLS
