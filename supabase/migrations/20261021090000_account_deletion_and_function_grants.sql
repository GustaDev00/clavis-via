-- CLAVIS VIA — exclusão de conta, reset atômico e privilégios de funções
--
-- 1. Funções em `public` deixam de ser executáveis por padrão (a nuvem concede EXECUTE a
--    anon/authenticated em toda função nova). Só o que o app usa recebe GRANT explícito.
-- 2. `delete_my_account()`: o titular apaga a própria conta (LGPD, art. 18, VI). Apagar
--    `auth.users` remove em cascata perfil, check-ins, práticas e progresso.
-- 3. `reset_my_demo()`: "Reiniciar demo" numa única transação, sem estado parcial.
-- 4. Retenção: visitantes anônimos inativos há 30 dias são apagados por um job diário
--    (pg_cron), quando a extensão estiver disponível.

-- ---------------------------------------------------------------------------
-- 1. Funções: nada executável sem GRANT explícito
-- ---------------------------------------------------------------------------

revoke execute on all functions in schema public from public, anon, authenticated;

alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

-- A função do trigger de sequência continua disponível para quem dispara o trigger.
-- Ela devolve `trigger`, então a Data API não a expõe como RPC.
grant execute on function public.ensure_previous_plan_day_completed() to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Exclusão da própria conta
-- ---------------------------------------------------------------------------

-- SECURITY DEFINER é necessário: só o dono do banco pode apagar em auth.users.
-- Por isso a função é mínima, com search_path vazio, e só alcança o próprio auth.uid().
create function public.delete_my_account()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = (select auth.uid());
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Reiniciar a demonstração (atômico)
-- ---------------------------------------------------------------------------

-- SECURITY INVOKER: roda com os privilégios de quem chama, então o RLS continua valendo.
-- Apagar as inscrições remove os dias concluídos em cascata.
create function public.reset_my_demo()
returns void
language sql
security invoker
set search_path = ''
as $$
  delete from public.practice_completions where user_id = (select auth.uid());
  delete from public.plan_enrollments where user_id = (select auth.uid());
  delete from public.check_ins where user_id = (select auth.uid());
$$;

revoke execute on function public.reset_my_demo() from public, anon;
grant execute on function public.reset_my_demo() to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Retenção de visitantes anônimos inativos
-- ---------------------------------------------------------------------------

do $$
begin
  create extension if not exists pg_cron;
  perform cron.schedule(
    'purge-anonymous-visitors',
    '0 4 * * *',
    $job$
      delete from auth.users
      where is_anonymous
        and coalesce(last_sign_in_at, created_at) < now() - interval '30 days'
    $job$
  );
exception when others then
  raise notice 'pg_cron indisponível neste ambiente; limpeza de visitantes não agendada (%)', sqlerrm;
end
$$;
