create index if not exists idx_production_loom_created
on public.loom_production_entries (loom_id, created_at desc)
where deleted_at is null;

create index if not exists idx_raw_materials_department
on public.raw_materials (department, material_name)
where deleted_at is null;

create index if not exists idx_sales_orders_roll_ids
on public.sales_orders using gin (selected_roll_ids)
where deleted_at is null and status = 'confirmed';

create index if not exists idx_sales_order_items_roll_ids
on public.sales_order_items using gin (selected_roll_ids);

create index if not exists idx_role_permissions_role
on public.role_permissions (role_id);

create index if not exists idx_users_auth_lookup
on public.users (id, role_id, status)
where deleted_at is null;

create or replace function public.get_last_end_meters_by_loom()
returns table (
  loom_id uuid,
  end_meters numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (lpe.loom_id)
    lpe.loom_id,
    lpe.end_meters
  from public.loom_production_entries lpe
  where lpe.deleted_at is null
  order by lpe.loom_id, lpe.created_at desc;
$$;

create or replace function public.get_roll_allocations_for_fabric(p_fabric_type_id uuid)
returns table (
  roll_id uuid,
  dispatch_date date,
  client_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (allocation.roll_id)
    allocation.roll_id,
    allocation.dispatch_date,
    allocation.client_name
  from (
    select
      fr.id as roll_id,
      so.order_date as dispatch_date,
      coalesce(c.customer_name, 'Unknown') as client_name
    from public.fabric_rolls fr
    join public.sales_orders so on so.selected_roll_ids @> array[fr.id]::uuid[]
    left join public.customers c on c.id = so.customer_id
    where fr.fabric_type_id = p_fabric_type_id
      and fr.deleted_at is null
      and so.deleted_at is null
      and so.status = 'confirmed'

    union all

    select
      fr.id as roll_id,
      so.order_date as dispatch_date,
      coalesce(c.customer_name, 'Unknown') as client_name
    from public.fabric_rolls fr
    join public.sales_order_items soi on soi.selected_roll_ids @> array[fr.id]::uuid[]
    join public.sales_orders so on so.id = soi.sales_order_id
    left join public.customers c on c.id = so.customer_id
    where fr.fabric_type_id = p_fabric_type_id
      and fr.deleted_at is null
      and so.deleted_at is null
      and so.status = 'confirmed'
  ) allocation
  order by allocation.roll_id, allocation.dispatch_date desc;
$$;
