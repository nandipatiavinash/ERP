alter table public.looms
  add column if not exists description text;

alter table public.fabric_types
  add column if not exists description text;
