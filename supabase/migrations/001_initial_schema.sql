create extension if not exists pgcrypto;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (name in ('admin', 'operator')),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id),
  full_name text not null,
  email text not null unique,
  phone text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.looms (
  id uuid primary key default gen_random_uuid(),
  loom_number text not null unique,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.fabric_types (
  id uuid primary key default gen_random_uuid(),
  fabric_name text not null,
  width numeric(10,2) not null check (width > 0),
  gsm numeric(10,2) not null check (gsm > 0),
  selling_price numeric(12,2) not null default 0 check (selling_price >= 0),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.raw_materials (
  id uuid primary key default gen_random_uuid(),
  material_name text not null unique,
  unit text not null,
  opening_stock numeric(12,3) not null default 0 check (opening_stock >= 0),
  current_stock numeric(12,3) not null default 0 check (current_stock >= 0),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.raw_material_purchases (
  id uuid primary key default gen_random_uuid(),
  purchase_date date not null default current_date,
  raw_material_id uuid not null references public.raw_materials(id),
  supplier_name text,
  bill_number text,
  quantity numeric(12,3) not null check (quantity > 0),
  rate numeric(12,2) not null default 0 check (rate >= 0),
  total_amount numeric(14,2) generated always as (quantity * rate) stored,
  remarks text,
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  description text,
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  employee_code text not null unique,
  name text not null,
  department text not null,
  designation text not null,
  salary numeric(12,2) not null default 0 check (salary >= 0),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id),
  attendance_date date not null default current_date,
  check_in time,
  check_out time,
  status text not null check (status in ('present', 'absent', 'half_day', 'leave')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (employee_id, attendance_date)
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text,
  gst_number text,
  address text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.loom_production_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null default current_date,
  serial_number text not null unique,
  fabric_type_id uuid not null references public.fabric_types(id),
  loom_id uuid not null references public.looms(id),
  gross_weight numeric(12,3) not null check (gross_weight > 0),
  core_weight numeric(12,3) not null default 0 check (core_weight >= 0),
  net_weight numeric(12,3) generated always as (gross_weight - core_weight) stored,
  initial_meters numeric(12,2) not null default 0 check (initial_meters >= 0),
  end_meters numeric(12,2) not null check (end_meters >= 0),
  net_meters numeric(12,2) generated always as (end_meters - initial_meters) stored,
  average_meter_weight numeric(12,3) generated always as (
    case when (end_meters - initial_meters) > 0
      then ((gross_weight - core_weight) / (end_meters - initial_meters)) * 1000
      else null
    end
  ) stored,
  initial_meter_overridden boolean not null default false,
  remarks text,
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (gross_weight >= core_weight),
  check (end_meters >= initial_meters)
);

create table public.fabric_rolls (
  id uuid primary key default gen_random_uuid(),
  roll_number text not null unique,
  production_entry_id uuid not null unique references public.loom_production_entries(id),
  fabric_type_id uuid not null references public.fabric_types(id),
  loom_id uuid not null references public.looms(id),
  weight numeric(12,3) not null check (weight >= 0),
  meters numeric(12,2) not null check (meters >= 0),
  production_date date not null,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold', 'voided')),
  current_stage text not null default 'loom' check (current_stage in ('loom', 'roto_printing', 'lamination', 'finishing', 'offset_printing')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.sales_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  order_date date not null default current_date,
  customer_id uuid not null references public.customers(id),
  fabric_type_id uuid not null references public.fabric_types(id),
  quantity_meters numeric(12,2) not null check (quantity_meters > 0),
  rate numeric(12,2) not null check (rate >= 0),
  total_amount numeric(14,2) generated always as (quantity_meters * rate) stored,
  selected_roll_ids uuid[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'confirmed', 'cancelled')),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  action text not null,
  module text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

insert into public.roles (name, description)
values
  ('admin', 'Full ERP access'),
  ('operator', 'Production entry and report access')
on conflict (name) do nothing;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_role_name()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select r.name
  from public.users u
  join public.roles r on r.id = u.role_id
  where u.id = auth.uid()
    and u.status = 'active'
    and u.deleted_at is null
    and r.is_active = true
    and r.deleted_at is null
  limit 1
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select public.current_role_name() = 'admin' $$;

create or replace function public.is_operator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select public.current_role_name() = 'operator' $$;

create or replace function public.next_year_number(prefix text, table_name text, column_name text)
returns text
language plpgsql
as $$
declare
  yr text := to_char(current_date, 'YYYY');
  next_number int;
  sql text;
begin
  sql := format(
    'select coalesce(max((regexp_match(%I, %L))[1]::int), 0) + 1 from public.%I where %I like %L',
    column_name,
    '^' || prefix || '-' || yr || '-([0-9]+)$',
    table_name,
    column_name,
    prefix || '-' || yr || '-%'
  );
  execute sql into next_number;
  return prefix || '-' || yr || '-' || lpad(next_number::text, 6, '0');
end;
$$;

create or replace function public.prepare_production_entry()
returns trigger
language plpgsql
as $$
declare
  last_end numeric(12,2);
begin
  if new.serial_number is null or new.serial_number = '' then
    new.serial_number = public.next_year_number('PROD', 'loom_production_entries', 'serial_number');
  end if;

  if new.entry_date is null then
    new.entry_date = current_date;
  end if;

  select lpe.end_meters into last_end
  from public.loom_production_entries lpe
  where lpe.loom_id = new.loom_id
    and lpe.deleted_at is null
  order by lpe.created_at desc
  limit 1;

  if tg_op = 'INSERT' and not public.is_admin() then
    new.initial_meters = coalesce(last_end, 0);
    new.initial_meter_overridden = false;
  elsif tg_op = 'INSERT' and public.is_admin() then
    if new.initial_meters is null then
      new.initial_meters = coalesce(last_end, 0);
    else
      new.initial_meter_overridden = new.initial_meters is distinct from coalesce(last_end, 0);
    end if;
  elsif tg_op = 'UPDATE' and not public.is_admin() then
    new.initial_meters = old.initial_meters;
    new.initial_meter_overridden = old.initial_meter_overridden;
  end if;

  return new;
end;
$$;

create or replace function public.create_or_sync_fabric_roll()
returns trigger
language plpgsql
as $$
declare
  new_roll_number text;
begin
  if tg_op = 'INSERT' then
    new_roll_number = public.next_year_number('ROLL', 'fabric_rolls', 'roll_number');
    insert into public.fabric_rolls (
      roll_number,
      production_entry_id,
      fabric_type_id,
      loom_id,
      weight,
      meters,
      production_date,
      status,
      current_stage,
      created_by,
      updated_by
    )
    values (
      new_roll_number,
      new.id,
      new.fabric_type_id,
      new.loom_id,
      new.net_weight,
      new.net_meters,
      new.entry_date,
      case when new.deleted_at is null then 'available' else 'voided' end,
      'loom',
      new.created_by,
      new.updated_by
    );
  elsif tg_op = 'UPDATE' then
    update public.fabric_rolls
    set fabric_type_id = new.fabric_type_id,
        loom_id = new.loom_id,
        weight = new.net_weight,
        meters = new.net_meters,
        production_date = new.entry_date,
        status = case when new.deleted_at is not null then 'voided' else status end,
        updated_by = new.updated_by,
        updated_at = now(),
        deleted_at = case when new.deleted_at is not null then now() else deleted_at end
    where production_entry_id = new.id;
  end if;

  return new;
end;
$$;

create or replace function public.apply_raw_material_purchase()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.raw_materials
    set current_stock = current_stock + new.quantity,
        updated_at = now(),
        updated_by = new.updated_by
    where id = new.raw_material_id;
  elsif tg_op = 'UPDATE' then
    update public.raw_materials
    set current_stock = current_stock - old.quantity,
        updated_at = now(),
        updated_by = new.updated_by
    where id = old.raw_material_id;

    update public.raw_materials
    set current_stock = current_stock + new.quantity,
        updated_at = now(),
        updated_by = new.updated_by
    where id = new.raw_material_id;
  end if;

  return new;
end;
$$;

create or replace function public.prepare_sales_order()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number = public.next_year_number('ORD', 'sales_orders', 'order_number');
  end if;
  if new.order_date is null then
    new.order_date = current_date;
  end if;
  return new;
end;
$$;

create or replace function public.sync_rolls_for_sales_order()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and old.status = 'confirmed' and new.status <> 'confirmed' then
    update public.fabric_rolls
    set status = 'available', updated_at = now(), updated_by = new.updated_by
    where id = any(old.selected_roll_ids)
      and status = 'sold';
  end if;

  if new.status = 'confirmed' then
    update public.fabric_rolls
    set status = 'sold', updated_at = now(), updated_by = new.updated_by
    where id = any(new.selected_roll_ids)
      and deleted_at is null;
  elsif new.status = 'cancelled' then
    update public.fabric_rolls
    set status = 'available', updated_at = now(), updated_by = new.updated_by
    where id = any(new.selected_roll_ids)
      and status <> 'voided'
      and deleted_at is null;
  end if;

  return new;
end;
$$;

create or replace function public.audit_row_change()
returns trigger
language plpgsql
as $$
declare
  acting_user uuid := auth.uid();
  action_name text;
  old_record jsonb;
  new_record jsonb;
begin
  if tg_op = 'INSERT' then
    action_name = 'create';
    new_record = to_jsonb(new);
    insert into public.audit_logs (user_id, action, module, record_id, old_data, new_data)
    values (acting_user, action_name, tg_table_name, new.id, null, new_record);
    return new;
  end if;

  if tg_op = 'UPDATE' then
    action_name = case when old.deleted_at is null and new.deleted_at is not null then 'soft_delete' else 'update' end;
    old_record = to_jsonb(old);
    new_record = to_jsonb(new);
    insert into public.audit_logs (user_id, action, module, record_id, old_data, new_data)
    values (acting_user, action_name, tg_table_name, new.id, old_record, new_record);
    return new;
  end if;

  return null;
end;
$$;

create trigger touch_roles before update on public.roles for each row execute function public.touch_updated_at();
create trigger touch_users before update on public.users for each row execute function public.touch_updated_at();
create trigger touch_looms before update on public.looms for each row execute function public.touch_updated_at();
create trigger touch_fabric_types before update on public.fabric_types for each row execute function public.touch_updated_at();
create trigger touch_raw_materials before update on public.raw_materials for each row execute function public.touch_updated_at();
create trigger touch_raw_material_purchases before update on public.raw_material_purchases for each row execute function public.touch_updated_at();
create trigger touch_settings before update on public.settings for each row execute function public.touch_updated_at();
create trigger touch_employees before update on public.employees for each row execute function public.touch_updated_at();
create trigger touch_attendance before update on public.attendance for each row execute function public.touch_updated_at();
create trigger touch_customers before update on public.customers for each row execute function public.touch_updated_at();
create trigger touch_production before update on public.loom_production_entries for each row execute function public.touch_updated_at();
create trigger touch_rolls before update on public.fabric_rolls for each row execute function public.touch_updated_at();
create trigger touch_sales before update on public.sales_orders for each row execute function public.touch_updated_at();

create trigger prepare_production before insert or update on public.loom_production_entries for each row execute function public.prepare_production_entry();
create trigger production_creates_roll after insert or update on public.loom_production_entries for each row execute function public.create_or_sync_fabric_roll();
create trigger prepare_sales before insert on public.sales_orders for each row execute function public.prepare_sales_order();
create trigger sales_sync_rolls after insert or update on public.sales_orders for each row execute function public.sync_rolls_for_sales_order();
create trigger raw_purchase_updates_stock after insert or update on public.raw_material_purchases for each row execute function public.apply_raw_material_purchase();

create trigger audit_roles after insert or update on public.roles for each row execute function public.audit_row_change();
create trigger audit_users after insert or update on public.users for each row execute function public.audit_row_change();
create trigger audit_looms after insert or update on public.looms for each row execute function public.audit_row_change();
create trigger audit_fabric_types after insert or update on public.fabric_types for each row execute function public.audit_row_change();
create trigger audit_raw_materials after insert or update on public.raw_materials for each row execute function public.audit_row_change();
create trigger audit_raw_material_purchases after insert or update on public.raw_material_purchases for each row execute function public.audit_row_change();
create trigger audit_settings after insert or update on public.settings for each row execute function public.audit_row_change();
create trigger audit_employees after insert or update on public.employees for each row execute function public.audit_row_change();
create trigger audit_attendance after insert or update on public.attendance for each row execute function public.audit_row_change();
create trigger audit_customers after insert or update on public.customers for each row execute function public.audit_row_change();
create trigger audit_production after insert or update on public.loom_production_entries for each row execute function public.audit_row_change();
create trigger audit_rolls after insert or update on public.fabric_rolls for each row execute function public.audit_row_change();
create trigger audit_sales after insert or update on public.sales_orders for each row execute function public.audit_row_change();

create index idx_looms_active on public.looms (status) where deleted_at is null;
create index idx_fabric_types_active on public.fabric_types (status) where deleted_at is null;
create index idx_raw_material_purchases_date on public.raw_material_purchases (purchase_date desc) where deleted_at is null;
create index idx_production_recent on public.loom_production_entries (created_at desc) where deleted_at is null;
create index idx_rolls_fabric_status on public.fabric_rolls (fabric_type_id, status) where deleted_at is null;
create index idx_sales_date on public.sales_orders (order_date desc) where deleted_at is null;
create index idx_attendance_date on public.attendance (attendance_date desc) where deleted_at is null;

alter table public.roles enable row level security;
alter table public.users enable row level security;
alter table public.looms enable row level security;
alter table public.fabric_types enable row level security;
alter table public.raw_materials enable row level security;
alter table public.raw_material_purchases enable row level security;
alter table public.settings enable row level security;
alter table public.employees enable row level security;
alter table public.attendance enable row level security;
alter table public.customers enable row level security;
alter table public.loom_production_entries enable row level security;
alter table public.fabric_rolls enable row level security;
alter table public.sales_orders enable row level security;
alter table public.audit_logs enable row level security;

create policy "roles readable by active users" on public.roles for select using (auth.uid() is not null and deleted_at is null);
create policy "roles admin write" on public.roles for all using (public.is_admin()) with check (public.is_admin());

create policy "users read own or admin" on public.users for select using (id = auth.uid() or public.is_admin());
create policy "users admin insert" on public.users for insert with check (public.is_admin());
create policy "users admin update" on public.users for update using (public.is_admin()) with check (public.is_admin());

create policy "masters read active users looms" on public.looms for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write looms" on public.looms for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users fabric" on public.fabric_types for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write fabric" on public.fabric_types for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users raw" on public.raw_materials for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write raw" on public.raw_materials for all using (public.is_admin()) with check (public.is_admin());
create policy "raw purchases read active users" on public.raw_material_purchases for select using (auth.uid() is not null and deleted_at is null);
create policy "raw purchases admin write" on public.raw_material_purchases for all using (public.is_admin()) with check (public.is_admin());
create policy "settings read active users" on public.settings for select using (auth.uid() is not null and deleted_at is null);
create policy "settings admin write" on public.settings for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users employees" on public.employees for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write employees" on public.employees for all using (public.is_admin()) with check (public.is_admin());
create policy "masters read active users customers" on public.customers for select using (auth.uid() is not null and deleted_at is null);
create policy "masters admin write customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());

create policy "attendance read active users" on public.attendance for select using (auth.uid() is not null and deleted_at is null);
create policy "attendance admin write" on public.attendance for all using (public.is_admin()) with check (public.is_admin());

create policy "production read active users" on public.loom_production_entries for select using (auth.uid() is not null and deleted_at is null);
create policy "production insert admin operator" on public.loom_production_entries
for insert with check ((public.is_admin() or public.is_operator()) and created_by = auth.uid());
create policy "production update admin anytime operator own 12h" on public.loom_production_entries
for update using (
  public.is_admin()
  or (public.is_operator() and created_by = auth.uid() and created_at >= now() - interval '12 hours')
) with check (
  public.is_admin()
  or (public.is_operator() and created_by = auth.uid() and created_at >= now() - interval '12 hours')
);

create policy "rolls read active users" on public.fabric_rolls for select using (auth.uid() is not null and deleted_at is null);
create policy "rolls admin write" on public.fabric_rolls for all using (public.is_admin()) with check (public.is_admin());

create policy "sales read active users" on public.sales_orders for select using (auth.uid() is not null and deleted_at is null);
create policy "sales admin write" on public.sales_orders for all using (public.is_admin()) with check (public.is_admin());

create policy "audit read admin" on public.audit_logs for select using (public.is_admin());
create policy "audit insert active users" on public.audit_logs for insert with check (auth.uid() is not null);
