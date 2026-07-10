-- ============================================================================
-- PostFlow — Remove o conceito de trial automático no cadastro.
-- Todo usuário novo entra direto no plano Gratuito, sem período temporário
-- no Pro. Rodar no SQL Editor do Supabase depois da 0001_init.sql.
-- ============================================================================

-- Novos cadastros: plan_status passa a nascer 'active' (plano gratuito ativo)
-- em vez de 'trial', e trial_ends_at não é mais preenchido automaticamente.
alter table public.profiles
  alter column plan_status set default 'active';

alter table public.profiles
  alter column trial_ends_at drop default;

-- Corrige contas já criadas durante os testes com o default antigo.
update public.profiles
set plan_status = 'active',
    trial_ends_at = null
where plan_status = 'trial'
  and plan_id = 'free';
