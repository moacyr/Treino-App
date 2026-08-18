-- Ficha Trekking — schema do backup em nuvem.
-- Rode uma vez no SQL Editor do projeto Supabase.

create table if not exists public.sessoes (
  user_id       uuid        not null references auth.users (id) on delete cascade,
  -- mesmo id do IndexedDB: `${diaId}-${segundaISO}` (uma sessão por dia da semana)
  id            text        not null,
  dia_id        text        not null,
  data          date        not null,
  semana        date        not null,
  cargas        jsonb       not null default '{}'::jsonb,
  concluidos    jsonb       not null default '[]'::jsonb,
  -- relógio do aparelho: critério de last-write-wins entre dispositivos
  atualizado_em timestamptz not null default now(),
  -- relógio do servidor: cursor de paginação do pull (imune a relógio errado)
  servidor_em   timestamptz not null default now(),
  primary key (user_id, id)
);

-- O pull busca `servidor_em > cursor` ordenado por `servidor_em`.
create index if not exists sessoes_servidor_em_idx
  on public.sessoes (user_id, servidor_em);

-- `servidor_em` é sempre do servidor, nunca do cliente.
create or replace function public.sessoes_carimbar()
returns trigger
language plpgsql
as $$
begin
  new.servidor_em := now();
  return new;
end;
$$;

drop trigger if exists sessoes_carimbar on public.sessoes;
create trigger sessoes_carimbar
  before insert or update on public.sessoes
  for each row execute function public.sessoes_carimbar();

-- Cada pessoa enxerga e escreve apenas as próprias sessões.
alter table public.sessoes enable row level security;

drop policy if exists "sessoes_select_proprias" on public.sessoes;
create policy "sessoes_select_proprias" on public.sessoes
  for select using (auth.uid() = user_id);

drop policy if exists "sessoes_insert_proprias" on public.sessoes;
create policy "sessoes_insert_proprias" on public.sessoes
  for insert with check (auth.uid() = user_id);

drop policy if exists "sessoes_update_proprias" on public.sessoes;
create policy "sessoes_update_proprias" on public.sessoes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "sessoes_delete_proprias" on public.sessoes;
create policy "sessoes_delete_proprias" on public.sessoes
  for delete using (auth.uid() = user_id);
