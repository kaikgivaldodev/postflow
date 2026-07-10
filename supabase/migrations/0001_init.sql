-- ============================================================================
-- PostFlow — Schema inicial (seção 4 do blueprint)
-- Rodar no SQL Editor do Supabase, ou via `supabase db push`.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- plan_limits — limites de uso por plano (seção 5). Criada primeiro pois
-- profiles.plan_id referencia esta tabela.
-- ----------------------------------------------------------------------------
create table if not exists public.plan_limits (
  plan_id text primary key,
  max_posts_per_month integer not null,
  max_instagram_accounts integer not null,
  has_analytics boolean not null default false,
  has_bulk_schedule boolean not null default false,
  has_ai_caption boolean not null default false,
  has_priority_support boolean not null default false
);

insert into public.plan_limits (plan_id, max_posts_per_month, max_instagram_accounts, has_analytics, has_bulk_schedule, has_ai_caption, has_priority_support)
values
  ('free', 10, 1, false, false, false, false),
  ('starter', 100, 2, true, false, false, false),
  ('pro', -1, 5, true, true, true, true),
  ('agency', -1, 15, true, true, true, true)
on conflict (plan_id) do update set
  max_posts_per_month = excluded.max_posts_per_month,
  max_instagram_accounts = excluded.max_instagram_accounts,
  has_analytics = excluded.has_analytics,
  has_bulk_schedule = excluded.has_bulk_schedule,
  has_ai_caption = excluded.has_ai_caption,
  has_priority_support = excluded.has_priority_support;

comment on column public.plan_limits.max_posts_per_month is '-1 significa ilimitado';

-- ----------------------------------------------------------------------------
-- profiles — espelha auth.users, criado automaticamente no signup (trigger)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  plan_id text not null default 'free' references public.plan_limits (plan_id),
  plan_status text not null default 'trial' check (plan_status in ('active', 'inactive', 'trial', 'cancelled')),
  timezone text not null default 'America/Sao_Paulo',
  trial_ends_at timestamptz default (now() + interval '14 days'),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Dados de perfil do usuário, 1:1 com auth.users';

-- ----------------------------------------------------------------------------
-- instagram_accounts — contas do Instagram conectadas via OAuth Meta
-- ----------------------------------------------------------------------------
create table if not exists public.instagram_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  ig_user_id text not null,
  ig_username text not null,
  access_token text not null, -- sempre armazenado criptografado (AES-256) pela camada de aplicação
  token_expires_at timestamptz,
  profile_picture_url text,
  created_at timestamptz not null default now(),
  unique (user_id, ig_user_id)
);

comment on column public.instagram_accounts.access_token is 'Criptografado com AES-256 em lib/encryption antes de gravar; nunca exposto ao frontend';

-- ----------------------------------------------------------------------------
-- scheduled_posts — posts agendados
-- ----------------------------------------------------------------------------
create table if not exists public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  account_id uuid not null references public.instagram_accounts (id) on delete cascade,
  post_type text not null check (post_type in ('feed', 'story', 'reel', 'carousel')),
  caption text default '' check (char_length(caption) <= 2200),
  hashtags text[] not null default '{}',
  media_urls text[] not null default '{}',
  scheduled_at timestamptz not null,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'failed')),
  error_message text,
  ig_post_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_scheduled_posts_user on public.scheduled_posts (user_id);
create index if not exists idx_scheduled_posts_due on public.scheduled_posts (status, scheduled_at)
  where status = 'scheduled';

-- ----------------------------------------------------------------------------
-- media_files — arquivos de mídia (Supabase Storage)
-- ----------------------------------------------------------------------------
create table if not exists public.media_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid references public.scheduled_posts (id) on delete cascade,
  file_url text not null,
  file_type text not null check (file_type in ('image', 'video')),
  file_size integer,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_media_files_post on public.media_files (post_id);

-- ----------------------------------------------------------------------------
-- subscriptions — assinaturas / pagamentos (SyncPay)
-- ----------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  syncpay_subscription_id text unique,
  plan_id text not null references public.plan_limits (plan_id),
  status text not null default 'active' check (status in ('active', 'past_due', 'cancelled', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user on public.subscriptions (user_id);

-- ----------------------------------------------------------------------------
-- updated_at triggers
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_scheduled_posts_updated_at on public.scheduled_posts;
create trigger trg_scheduled_posts_updated_at
  before update on public.scheduled_posts
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Cria profile automaticamente quando um usuário se cadastra (auth.users)
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, marketing_opt_in)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce((new.raw_user_meta_data ->> 'marketing_opt_in')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY — cada usuário só acessa seus próprios dados
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.instagram_accounts enable row level security;
alter table public.scheduled_posts enable row level security;
alter table public.media_files enable row level security;
alter table public.subscriptions enable row level security;
alter table public.plan_limits enable row level security;

-- profiles
create policy "Users view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id);

-- instagram_accounts
create policy "Users see own instagram accounts" on public.instagram_accounts
  for select using (auth.uid() = user_id);
create policy "Users insert own instagram accounts" on public.instagram_accounts
  for insert with check (auth.uid() = user_id);
create policy "Users update own instagram accounts" on public.instagram_accounts
  for update using (auth.uid() = user_id);
create policy "Users delete own instagram accounts" on public.instagram_accounts
  for delete using (auth.uid() = user_id);

-- scheduled_posts
create policy "Users see own posts" on public.scheduled_posts
  for select using (auth.uid() = user_id);
create policy "Users insert own posts" on public.scheduled_posts
  for insert with check (auth.uid() = user_id);
create policy "Users update own posts" on public.scheduled_posts
  for update using (auth.uid() = user_id);
create policy "Users delete own posts" on public.scheduled_posts
  for delete using (auth.uid() = user_id);

-- media_files
create policy "Users see own media" on public.media_files
  for select using (auth.uid() = user_id);
create policy "Users insert own media" on public.media_files
  for insert with check (auth.uid() = user_id);
create policy "Users delete own media" on public.media_files
  for delete using (auth.uid() = user_id);

-- subscriptions
create policy "Users see own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

-- plan_limits — tabela de referência pública (somente leitura para todos autenticados)
create policy "Authenticated users read plan limits" on public.plan_limits
  for select using (auth.role() = 'authenticated');

-- Nota: escrita em subscriptions/plan_limits e updates de plan_id em profiles
-- devem ocorrer via service_role key (webhooks do SyncPay, backend), nunca
-- diretamente pelo cliente autenticado.
