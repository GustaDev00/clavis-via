-- CLAVIS VIA — schema inicial
--
-- Princípios:
-- 1. Cada linha de dado pessoal pertence a um usuário (user_id) e só ele a enxerga (RLS + auth.uid()).
-- 2. Conteúdo editorial (práticas, planos, dias) é somente leitura para quem está autenticado.
-- 3. Nada fica exposto na Data API sem GRANT explícito (auto_expose_new_tables = false),
--    e os GRANTs são por coluna quando o usuário só pode escrever parte da linha.

-- ---------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------

create type public.emotion as enum (
  'ansiedade',
  'cansaco',
  'desanimo',
  'irritacao',
  'sensibilidade',
  'paz',
  'esperanca',
  'outro'
);

create type public.practice_kind as enum (
  'respiracao',
  'corpo',
  'escrita',
  'pausa',
  'gratidao',
  'contemplacao'
);

-- ---------------------------------------------------------------------------
-- Usuários
-- ---------------------------------------------------------------------------

-- 1:1 com auth.users. Visitantes demo são usuários anônimos do Supabase Auth.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 40),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Conteúdo editorial (seedado)
-- ---------------------------------------------------------------------------

create table public.practices (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  kind public.practice_kind not null,
  duration_minutes smallint not null check (duration_minutes between 1 and 60),
  -- "Sua chave de hoje": reflexão curta exibida na tela Hoje
  key_title text not null,
  key_message text not null,
  summary text not null,
  steps text[] not null check (cardinality(steps) between 1 and 10),
  -- Ritmo em segundos [inspira, segura, solta, descansa] para práticas de respiração
  breath_pattern smallint[] check (breath_pattern is null or cardinality(breath_pattern) = 4),
  -- Emoções para as quais esta prática é recomendada
  emotions public.emotion[] not null check (cardinality(emotions) >= 1),
  sort_order smallint not null default 0
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null,
  theme text not null,
  minutes_per_day text not null,
  emotions public.emotion[] not null default '{}',
  -- Chave do gradiente usado na capa (a UI mapeia para tokens de cor)
  palette text not null default 'lavanda',
  sort_order smallint not null default 0
);

create table public.plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans (id) on delete cascade,
  day_number smallint not null check (day_number >= 1),
  title text not null,
  subtitle text not null,
  message text not null,
  action text not null,
  reflection_prompt text not null,
  unique (plan_id, day_number),
  -- Permite FK composta em plan_day_completions garantindo que o dia é do plano informado
  unique (id, plan_id)
);

create index plan_days_plan_idx on public.plan_days (plan_id, day_number);

-- ---------------------------------------------------------------------------
-- Dados do usuário
-- ---------------------------------------------------------------------------

create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  emotion public.emotion not null,
  note text check (note is null or char_length(note) <= 280),
  created_at timestamptz not null default now(),
  constraint check_ins_outro_requires_note
    check (emotion <> 'outro' or char_length(btrim(coalesce(note, ''))) >= 2)
);

create index check_ins_user_created_idx on public.check_ins (user_id, created_at desc);

create table public.practice_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  practice_id uuid not null references public.practices (id) on delete cascade,
  check_in_id uuid references public.check_ins (id) on delete set null,
  completed_at timestamptz not null default now()
);

create index practice_completions_user_idx on public.practice_completions (user_id, completed_at desc);

create table public.plan_enrollments (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  plan_id uuid not null references public.plans (id) on delete cascade,
  started_at timestamptz not null default now(),
  primary key (user_id, plan_id)
);

create table public.plan_day_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  plan_id uuid not null,
  plan_day_id uuid not null,
  reflection text check (reflection is null or char_length(reflection) <= 1000),
  completed_at timestamptz not null default now(),
  unique (user_id, plan_day_id),
  -- Só conclui dia de plano em que está inscrito
  foreign key (user_id, plan_id) references public.plan_enrollments (user_id, plan_id) on delete cascade,
  -- O dia precisa pertencer ao plano
  foreign key (plan_day_id, plan_id) references public.plan_days (id, plan_id) on delete cascade
);

create index plan_day_completions_user_idx on public.plan_day_completions (user_id, completed_at desc);

-- Os dias são sequenciais: não é possível concluir o dia N sem ter concluído o dia N-1.
-- SECURITY INVOKER (padrão): a checagem enxerga apenas as linhas do próprio usuário.
create function public.ensure_previous_plan_day_completed()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_day_number smallint;
begin
  select d.day_number into v_day_number
  from public.plan_days d
  where d.id = new.plan_day_id and d.plan_id = new.plan_id;

  -- Dia de outro plano: deixa a FK composta recusar com o erro correto
  if v_day_number is null then
    return new;
  end if;

  if v_day_number > 1 and not exists (
    select 1
    from public.plan_day_completions c
    join public.plan_days d on d.id = c.plan_day_id
    where c.user_id = new.user_id
      and d.plan_id = new.plan_id
      and d.day_number = v_day_number - 1
  ) then
    raise exception 'Conclua o dia % antes de avançar.', v_day_number - 1
      using errcode = 'P0001', hint = 'previous_day_required';
  end if;

  return new;
end;
$$;

create trigger plan_day_completions_sequential
  before insert on public.plan_day_completions
  for each row execute function public.ensure_previous_plan_day_completed();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.practices enable row level security;
alter table public.plans enable row level security;
alter table public.plan_days enable row level security;
alter table public.check_ins enable row level security;
alter table public.practice_completions enable row level security;
alter table public.plan_enrollments enable row level security;
alter table public.plan_day_completions enable row level security;

-- Conteúdo: leitura para qualquer sessão autenticada (inclui visitantes anônimos)
create policy "Conteúdo legível por usuários autenticados"
  on public.practices for select to authenticated using (true);

create policy "Conteúdo legível por usuários autenticados"
  on public.plans for select to authenticated using (true);

create policy "Conteúdo legível por usuários autenticados"
  on public.plan_days for select to authenticated using (true);

-- Perfil: cada um só vê e edita o próprio
create policy "Usuário lê o próprio perfil"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Usuário cria o próprio perfil"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "Usuário atualiza o próprio perfil"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Check-ins
create policy "Usuário lê os próprios check-ins"
  on public.check_ins for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Usuário registra check-ins para si"
  on public.check_ins for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Usuário apaga os próprios check-ins"
  on public.check_ins for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Práticas concluídas
create policy "Usuário lê as próprias práticas concluídas"
  on public.practice_completions for select to authenticated
  using ((select auth.uid()) = user_id);

-- O check-in vinculado (se houver) também precisa ser do usuário — evita referenciar dado alheio
create policy "Usuário registra práticas concluídas para si"
  on public.practice_completions for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and (
      check_in_id is null
      or exists (
        select 1 from public.check_ins c
        where c.id = check_in_id and c.user_id = (select auth.uid())
      )
    )
  );

create policy "Usuário apaga as próprias práticas concluídas"
  on public.practice_completions for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Inscrições em planos
create policy "Usuário lê as próprias inscrições"
  on public.plan_enrollments for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Usuário se inscreve em planos"
  on public.plan_enrollments for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Usuário cancela as próprias inscrições"
  on public.plan_enrollments for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Dias concluídos
create policy "Usuário lê os próprios dias concluídos"
  on public.plan_day_completions for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Usuário conclui dias para si"
  on public.plan_day_completions for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Usuário apaga os próprios dias concluídos"
  on public.plan_day_completions for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- GRANTs (Data API). Nada para o papel anon: sem sessão, sem acesso.
-- Colunas como user_id, id e created_at não são graváveis pelo cliente:
-- vêm de defaults (auth.uid(), now()).
-- ---------------------------------------------------------------------------

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
