-- 001_schema.sql
-- MAIN, ALL-INCLUSIVE schema. DESTRUCTIVE: drops and recreates everything,
-- including all data. Run this to start from scratch at any point.
-- Later migrations (002+) are incremental additions on top of this file;
-- whenever one is added, fold it into this file too so 001 stays complete.

-- ---------------------------------------------------------------------------
-- Teardown
-- ---------------------------------------------------------------------------
drop table if exists public.rental_data_applicants cascade;
drop function if exists public.rental_data_set_updated_at() cascade;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create function public.rental_data_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- rental_data_applicants: one row per prospective tenant
-- ---------------------------------------------------------------------------
create table public.rental_data_applicants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,

  -- Contact
  full_name text not null,
  phone text,
  email text,
  source text,                     -- where they found the listing (Idealista, Fotocasa, ...)

  -- Pipeline
  status text not null default 'nuevo'
    check (status in ('nuevo', 'contactado', 'visita', 'aceptado', 'descartado')),
  rating smallint check (rating between 1 and 5),
  contacted_at date,
  visit_at timestamptz,

  -- Questionnaire
  job text,                        -- Trabajo: a que se dedica y desde cuando
  income_monthly_net text,         -- Ingresos: netos mensuales totales (texto libre)
  documents_ok text not null default 'pendiente'
    check (documents_ok in ('pendiente', 'si', 'no')),   -- Justificantes
  occupants text not null default 'Una persona',         -- Ocupantes
  move_in_date date,               -- Fecha de entrada
  long_stay text,                  -- Duracion del alquiler / larga estancia
  can_afford text not null default 'pendiente'
    check (can_afford in ('pendiente', 'si', 'no')),     -- Capacidad economica (950 EUR + gastos)

  -- Free-form
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index rental_data_applicants_owner_idx on public.rental_data_applicants (owner_id);
create index rental_data_applicants_status_idx on public.rental_data_applicants (status);
create index rental_data_applicants_created_idx on public.rental_data_applicants (created_at desc);

create trigger rental_data_applicants_set_updated_at
  before update on public.rental_data_applicants
  for each row execute function public.rental_data_set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: private tracker, each user only sees their own rows
-- ---------------------------------------------------------------------------
alter table public.rental_data_applicants enable row level security;

create policy "rental_data_applicants_select_own"
  on public.rental_data_applicants for select to authenticated
  using (owner_id = (select auth.uid()));

create policy "rental_data_applicants_insert_own"
  on public.rental_data_applicants for insert to authenticated
  with check (owner_id = (select auth.uid()));

create policy "rental_data_applicants_update_own"
  on public.rental_data_applicants for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "rental_data_applicants_delete_own"
  on public.rental_data_applicants for delete to authenticated
  using (owner_id = (select auth.uid()));

revoke all on public.rental_data_applicants from anon;
grant select, insert, update, delete on public.rental_data_applicants to authenticated;
