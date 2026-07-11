-- ============================================================================
-- PostFlow — Suporte a publicação automática no Instagram (containers
-- assíncronos de vídeo/reels/carrossel) + correção de bug de cascade delete.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Colunas para rastrear containers do Graph API entre execuções do cron.
-- Vídeo/reels não processam instantaneamente — o cron cria o container numa
-- execução e faz polling do status nas execuções seguintes usando estas
-- colunas. Ausência de status novo é proposital: se deve criar ou fazer
-- polling de um container é decidido por media_container_id IS NULL, não
-- por uma mudança de status — o índice parcial idx_scheduled_posts_due
-- (status, scheduled_at) where status = 'scheduled' já cobre os dois casos.
-- ----------------------------------------------------------------------------
alter table public.scheduled_posts
  add column if not exists media_container_id text,
  add column if not exists carousel_child_container_ids text[],
  add column if not exists container_created_at timestamptz;

comment on column public.scheduled_posts.media_container_id is
  'ID do container do Graph API (feed/reel/story, ou container pai de carrossel) enquanto aguarda status FINISHED';
comment on column public.scheduled_posts.carousel_child_container_ids is
  'IDs dos containers filhos de um carrossel com vídeo, enquanto aguardam FINISHED antes de criar o container pai';
comment on column public.scheduled_posts.container_created_at is
  'Timestamp de criação do container em andamento — usado para timeout (30min) caso o processamento trave';

-- ----------------------------------------------------------------------------
-- Bug fix: account_id tinha ON DELETE CASCADE — desconectar uma conta do
-- Instagram apagava silenciosamente todo o histórico de posts vinculados a
-- ela (inclusive já publicados). Troca para ON DELETE SET NULL: o post e seu
-- histórico permanecem, só perdem a referência à conta.
-- ----------------------------------------------------------------------------
do $$
declare
  fk_name text;
begin
  select conname into fk_name
  from pg_constraint
  where conrelid = 'public.scheduled_posts'::regclass
    and contype = 'f'
    and confrelid = 'public.instagram_accounts'::regclass;

  if fk_name is not null then
    execute format('alter table public.scheduled_posts drop constraint %I', fk_name);
  end if;
end $$;

alter table public.scheduled_posts
  add constraint scheduled_posts_account_id_fkey
  foreign key (account_id) references public.instagram_accounts (id) on delete set null;
