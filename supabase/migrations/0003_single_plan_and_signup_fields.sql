-- ============================================================================
-- PostFlow — Plano único (R$37,90/mês, tudo liberado), CPF/telefone no
-- cadastro, trial de 7 dias, e infraestrutura de posts/mídia.
-- Rodar no SQL Editor do Supabase depois da 0001_init.sql (a 0002 pode ter
-- sido rodada ou não — esta migration já deixa o schema no estado final).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- plan_limits — um único plano, tudo ilimitado.
-- IMPORTANTE: insere/atualiza o plano 'pro' e corrige quem ainda referencia
-- os planos antigos ANTES de apagá-los — senão a FK impede o delete.
-- ----------------------------------------------------------------------------
insert into public.plan_limits (plan_id, max_posts_per_month, max_instagram_accounts, has_analytics, has_bulk_schedule, has_ai_caption, has_priority_support)
values ('pro', -1, -1, true, true, true, true)
on conflict (plan_id) do update set
  max_posts_per_month = excluded.max_posts_per_month,
  max_instagram_accounts = excluded.max_instagram_accounts,
  has_analytics = excluded.has_analytics,
  has_bulk_schedule = excluded.has_bulk_schedule,
  has_ai_caption = excluded.has_ai_caption,
  has_priority_support = excluded.has_priority_support;

-- Corrige linhas de teste que apontavam pra planos que deixaram de existir
-- (em profiles e subscriptions, ambas com FK pra plan_limits).
update public.profiles set plan_id = 'pro' where plan_id != 'pro';
update public.subscriptions set plan_id = 'pro' where plan_id != 'pro';

delete from public.plan_limits where plan_id != 'pro';

-- ----------------------------------------------------------------------------
-- profiles — CPF/telefone únicos, trial de 7 dias, plano único 'pro'
-- ----------------------------------------------------------------------------
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists cpf text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_phone_key'
  ) then
    alter table public.profiles add constraint profiles_phone_key unique (phone);
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_cpf_key'
  ) then
    alter table public.profiles add constraint profiles_cpf_key unique (cpf);
  end if;
end $$;

alter table public.profiles alter column plan_id set default 'pro';
alter table public.profiles alter column plan_status set default 'trial';
alter table public.profiles alter column trial_ends_at set default (now() + interval '7 days');

-- ----------------------------------------------------------------------------
-- handle_new_user() — também grava phone/cpf vindos do cadastro
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, cpf, marketing_opt_in)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'cpf',
    coalesce((new.raw_user_meta_data ->> 'marketing_opt_in')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- scheduled_posts — permite rascunho/agendamento sem conta do Instagram
-- conectada ainda (o fluxo de conexão OAuth é um passo futuro)
-- ----------------------------------------------------------------------------
alter table public.scheduled_posts alter column account_id drop not null;

-- ----------------------------------------------------------------------------
-- Bucket de mídia (Supabase Storage) — leitura pública é necessária pra API
-- do Instagram conseguir buscar a URL da mídia quando o publish for
-- implementado; escrita restrita à própria pasta do usuário.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read post-media" on storage.objects;
create policy "Public read post-media" on storage.objects
  for select using (bucket_id = 'post-media');

drop policy if exists "Users upload own post-media" on storage.objects;
create policy "Users upload own post-media" on storage.objects
  for insert with check (
    bucket_id = 'post-media' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users update own post-media" on storage.objects;
create policy "Users update own post-media" on storage.objects
  for update using (
    bucket_id = 'post-media' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own post-media" on storage.objects;
create policy "Users delete own post-media" on storage.objects
  for delete using (
    bucket_id = 'post-media' and (storage.foldername(name))[1] = auth.uid()::text
  );
