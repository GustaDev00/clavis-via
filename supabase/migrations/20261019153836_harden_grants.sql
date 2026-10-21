-- Endurece os privilégios da Data API.
--
-- Em projetos Supabase com a exposição automática ligada (caso do projeto provisionado pela
-- Vercel), toda tabela nova em `public` nasce com ALL para `anon` e `authenticated`.
-- O RLS já impedia acesso às linhas de outras pessoas, mas aqui deixamos o banco
-- igual ao desenho original (defesa em profundidade):
--   - `anon` (sem sessão) não acessa nada;
--   - `authenticated` só faz o que o app precisa, com INSERT/UPDATE restritos por coluna;
--   - tabelas criadas no futuro não ficam expostas por padrão.

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;

-- Os GRANTs abaixo repetem os de *_init_schema.sql de propósito: o `revoke all` acima
-- os apagou junto com a exposição automática, e esta migration precisa ser autossuficiente.
grant select on public.practices, public.plans, public.plan_days to authenticated;

grant select on public.profiles to authenticated;
grant insert (id, display_name) on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

grant select, delete on public.check_ins to authenticated;
grant insert (emotion, note) on public.check_ins to authenticated;

grant select, delete on public.practice_completions to authenticated;
grant insert (practice_id, check_in_id) on public.practice_completions to authenticated;

grant select, delete on public.plan_enrollments to authenticated;
grant insert (plan_id) on public.plan_enrollments to authenticated;

grant select, delete on public.plan_day_completions to authenticated;
grant insert (plan_id, plan_day_id, reflection) on public.plan_day_completions to authenticated;
