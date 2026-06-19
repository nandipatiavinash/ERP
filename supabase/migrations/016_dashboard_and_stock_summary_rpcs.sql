create or replace function public.get_dashboard_summary(p_entry_date date)
returns table (
  production_entries bigint,
  total_weight numeric,
  total_meters numeric,
  available_rolls bigint,
  material_stock numeric,
  present_employees bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as production_entries,
    (select coalesce(sum(net_weight), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_weight,
    (select coalesce(sum(net_meters), 0) from public.loom_production_entries where entry_date = p_entry_date and deleted_at is null) as total_meters,
    (select count(*) from public.fabric_rolls where status = 'available' and deleted_at is null) as available_rolls,
    (select coalesce(sum(current_stock), 0) from public.raw_materials where deleted_at is null) as material_stock,
    (select count(*) from public.attendance where attendance_date = p_entry_date and status = 'present' and deleted_at is null) as present_employees;
$$;

create or replace function public.get_daily_fabric_output(p_entry_date date)
returns table (
  name text,
  meters numeric,
  weight numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(ft.fabric_name, 'Fabric') as name,
    coalesce(sum(lpe.net_meters), 0) as meters,
    coalesce(sum(lpe.net_weight), 0) as weight
  from public.loom_production_entries lpe
  left join public.fabric_types ft on ft.id = lpe.fabric_type_id
  where lpe.entry_date = p_entry_date
    and lpe.deleted_at is null
  group by ft.fabric_name
  order by ft.fabric_name;
$$;

create or replace function public.get_fabric_stock_summary()
returns table (
  fabric_type_id uuid,
  fabric_name text,
  rolls bigint,
  weight numeric,
  meters numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    fr.fabric_type_id,
    ft.fabric_name,
    count(*) as rolls,
    coalesce(sum(fr.weight), 0) as weight,
    coalesce(sum(fr.meters), 0) as meters
  from public.fabric_rolls fr
  left join public.fabric_types ft on ft.id = fr.fabric_type_id
  where fr.status = 'available'
    and fr.deleted_at is null
  group by fr.fabric_type_id, ft.fabric_name
  order by ft.fabric_name;
$$;
