-- --- START OF MIGRATION: 001_initial_schema.sql ---
create extension if not exists pgcrypto;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
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
  joining_date date,
  shift_start time,
  shift_end time,
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
  check_in_at timestamptz,
  check_out_at timestamptz,
  working_hours numeric(8,2) default 0,
  overtime_hours numeric(8,2) default 0,
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


-- --- START OF MIGRATION: 002_attendance_permissions.sql ---

-- 1. Create permissions table
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  action text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (module, action)
);

-- 2. Create role_permissions table
create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

-- 3. Create has_permission function
create or replace function public.has_permission(p_permission text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  has_perm boolean;
begin
  select exists (
    select 1
    from public.users u
    join public.role_permissions rp on rp.role_id = u.role_id
    join public.permissions p on p.id = rp.permission_id
    where u.id = auth.uid()
      and u.status = 'active'
      and u.deleted_at is null
      and p.deleted_at is null
      and (p.module || '.' || p.action) = p_permission
  ) into has_perm;
  return coalesce(has_perm, false);
end;
$$;

-- 4. Enable RLS
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;

-- --- START OF MIGRATION: 003_permission_policies.sql ---
drop policy if exists "roles admin write" on public.roles;
drop policy if exists "roles permission write" on public.roles;
create policy "roles permission write" on public.roles
for all
using (public.is_admin() or public.has_permission('roles.edit') or public.has_permission('roles.delete'))
with check (public.is_admin() or public.has_permission('roles.create') or public.has_permission('roles.edit'));

drop policy if exists "permissions admin write" on public.permissions;
drop policy if exists "permissions role managers write" on public.permissions;
create policy "permissions role managers write" on public.permissions
for all
using (public.is_admin() or public.has_permission('roles.edit'))
with check (public.is_admin() or public.has_permission('roles.edit'));

drop policy if exists "role permissions admin write" on public.role_permissions;
drop policy if exists "role permissions role managers write" on public.role_permissions;
create policy "role permissions role managers write" on public.role_permissions
for all
using (public.is_admin() or public.has_permission('roles.edit'))
with check (public.is_admin() or public.has_permission('roles.edit'));

drop policy if exists "masters admin write looms" on public.looms;
drop policy if exists "looms permission write" on public.looms;
create policy "looms permission write" on public.looms
for all
using (public.is_admin() or public.has_permission('looms.edit') or public.has_permission('looms.delete'))
with check (public.is_admin() or public.has_permission('looms.create') or public.has_permission('looms.edit'));

drop policy if exists "masters admin write fabric" on public.fabric_types;
drop policy if exists "fabric types permission write" on public.fabric_types;
create policy "fabric types permission write" on public.fabric_types
for all
using (public.is_admin() or public.has_permission('fabric_types.edit') or public.has_permission('fabric_types.delete'))
with check (public.is_admin() or public.has_permission('fabric_types.create') or public.has_permission('fabric_types.edit'));

drop policy if exists "masters admin write raw" on public.raw_materials;
drop policy if exists "raw materials permission write" on public.raw_materials;
create policy "raw materials permission write" on public.raw_materials
for all
using (public.is_admin() or public.has_permission('raw_materials.edit') or public.has_permission('raw_materials.delete'))
with check (public.is_admin() or public.has_permission('raw_materials.create') or public.has_permission('raw_materials.edit'));

drop policy if exists "raw purchases admin write" on public.raw_material_purchases;
drop policy if exists "raw purchases permission write" on public.raw_material_purchases;
create policy "raw purchases permission write" on public.raw_material_purchases
for all
using (public.is_admin() or public.has_permission('raw_materials.edit'))
with check (public.is_admin() or public.has_permission('raw_materials.edit'));

drop policy if exists "masters admin write employees" on public.employees;
drop policy if exists "employees permission write" on public.employees;
create policy "employees permission write" on public.employees
for all
using (public.is_admin() or public.has_permission('employees.edit') or public.has_permission('employees.delete'))
with check (public.is_admin() or public.has_permission('employees.create') or public.has_permission('employees.edit'));

drop policy if exists "masters admin write customers" on public.customers;
drop policy if exists "customers permission write" on public.customers;
create policy "customers permission write" on public.customers
for all
using (public.is_admin() or public.has_permission('customers.edit') or public.has_permission('customers.delete'))
with check (public.is_admin() or public.has_permission('customers.create') or public.has_permission('customers.edit'));

drop policy if exists "attendance admin write" on public.attendance;
drop policy if exists "attendance permission write" on public.attendance;
create policy "attendance permission write" on public.attendance
for all
using (public.is_admin() or public.has_permission('attendance.edit'))
with check (public.is_admin() or public.has_permission('attendance.create') or public.has_permission('attendance.edit'));

drop policy if exists "sales admin write" on public.sales_orders;
drop policy if exists "sales permission write" on public.sales_orders;
create policy "sales permission write" on public.sales_orders
for all
using (public.is_admin() or public.has_permission('sales.edit'))
with check (public.is_admin() or public.has_permission('sales.create') or public.has_permission('sales.edit'));

drop policy if exists "rolls admin write" on public.fabric_rolls;
drop policy if exists "rolls permission write" on public.fabric_rolls;
create policy "rolls permission write" on public.fabric_rolls
for all
using (public.is_admin() or public.has_permission('production.edit'))
with check (public.is_admin() or public.has_permission('production.create') or public.has_permission('production.edit'));


-- --- START OF MIGRATION: 004_employee_self_attendance_audit.sql ---
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  module text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

alter table public.employees
  add column if not exists user_id uuid references public.users(id);

create unique index if not exists idx_employees_user_id
on public.employees (user_id)
where user_id is not null and deleted_at is null;

create index if not exists idx_employees_status_name
on public.employees (status, name)
where deleted_at is null;

create index if not exists idx_attendance_date_employee
on public.attendance (attendance_date desc, employee_id)
where deleted_at is null;

create index if not exists idx_production_entry_date
on public.loom_production_entries (entry_date desc)
where deleted_at is null;

create index if not exists idx_sales_order_date_status
on public.sales_orders (order_date desc, status)
where deleted_at is null;

create index if not exists idx_raw_materials_status_name
on public.raw_materials (status, material_name)
where deleted_at is null;

create or replace function public.can_manage_attendance_for(target_employee_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or public.has_permission('employees.view')
    or exists (
      select 1
      from public.employees e
      where e.id = target_employee_id
        and e.user_id = auth.uid()
        and e.status = 'active'
        and e.deleted_at is null
    )
$$;

drop policy if exists "attendance permission write" on public.attendance;
drop policy if exists "attendance read active users" on public.attendance;
drop policy if exists "attendance read permission scoped" on public.attendance;
create policy "attendance read permission scoped" on public.attendance
for select using (
  public.has_permission('attendance.view')
  and public.can_manage_attendance_for(employee_id)
);

drop policy if exists "attendance insert permission scoped" on public.attendance;
create policy "attendance insert permission scoped" on public.attendance
for insert
with check (
  public.has_permission('attendance.create')
  and public.can_manage_attendance_for(employee_id)
);

drop policy if exists "attendance update permission scoped" on public.attendance;
create policy "attendance update permission scoped" on public.attendance
for update
using (
  public.has_permission('attendance.edit')
  and public.can_manage_attendance_for(employee_id)
)
with check (
  public.has_permission('attendance.edit')
  and public.can_manage_attendance_for(employee_id)
);

drop policy if exists "audit read admin" on public.audit_logs;
drop policy if exists "audit read permitted users" on public.audit_logs;
create policy "audit read permitted users" on public.audit_logs
for select using (public.is_admin() or public.has_permission('audit_logs.view'));

drop policy if exists "masters read active users employees" on public.employees;
drop policy if exists "employees read permission scoped" on public.employees;
create policy "employees read permission scoped" on public.employees
for select using (
  deleted_at is null
  and (
    public.has_permission('employees.view')
    or (
      public.has_permission('attendance.view')
      and public.can_manage_attendance_for(id)
    )
    or user_id = auth.uid()
  )
);

drop policy if exists "users read own or admin" on public.users;
drop policy if exists "users read own or permitted" on public.users;
create policy "users read own or permitted" on public.users
for select using (id = auth.uid() or public.is_admin() or public.has_permission('users.view'));

drop policy if exists "roles readable by active users" on public.roles;
drop policy if exists "roles readable by permitted users" on public.roles;
create policy "roles readable by permitted users" on public.roles
for select using (
  deleted_at is null
  and (
    public.has_permission('roles.view')
    or exists (select 1 from public.users u where u.id = auth.uid() and u.role_id = roles.id)
  )
);

drop policy if exists "role permissions readable by active users" on public.role_permissions;
drop policy if exists "role permissions readable by permitted users" on public.role_permissions;
create policy "role permissions readable by permitted users" on public.role_permissions
for select using (
  public.has_permission('roles.view')
  or exists (select 1 from public.users u where u.id = auth.uid() and u.role_id = role_permissions.role_id)
);

drop policy if exists "masters read active users looms" on public.looms;
drop policy if exists "looms read permitted users" on public.looms;
create policy "looms read permitted users" on public.looms
for select using (
  deleted_at is null
  and (
    public.has_permission('looms.view')
    or public.has_permission('production.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);

drop policy if exists "masters read active users fabric" on public.fabric_types;
drop policy if exists "fabric types read permitted users" on public.fabric_types;
create policy "fabric types read permitted users" on public.fabric_types
for select using (
  deleted_at is null
  and (
    public.has_permission('fabric_types.view')
    or public.has_permission('production.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);

drop policy if exists "masters read active users raw" on public.raw_materials;
drop policy if exists "raw materials read permitted users" on public.raw_materials;
create policy "raw materials read permitted users" on public.raw_materials
for select using (
  deleted_at is null
  and (
    public.has_permission('raw_materials.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);

drop policy if exists "raw purchases read active users" on public.raw_material_purchases;
drop policy if exists "raw purchases read permitted users" on public.raw_material_purchases;
create policy "raw purchases read permitted users" on public.raw_material_purchases
for select using (
  deleted_at is null
  and (
    public.has_permission('raw_materials.view')
    or public.has_permission('reports.view')
  )
);

drop policy if exists "masters read active users customers" on public.customers;
drop policy if exists "customers read permitted users" on public.customers;
create policy "customers read permitted users" on public.customers
for select using (
  deleted_at is null
  and (
    public.has_permission('customers.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
  )
);

drop policy if exists "production read active users" on public.loom_production_entries;
drop policy if exists "production read permitted users" on public.loom_production_entries;
create policy "production read permitted users" on public.loom_production_entries
for select using (
  deleted_at is null
  and (
    public.has_permission('production.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);

drop policy if exists "rolls read active users" on public.fabric_rolls;
drop policy if exists "rolls read permitted users" on public.fabric_rolls;
create policy "rolls read permitted users" on public.fabric_rolls
for select using (
  deleted_at is null
  and (
    public.has_permission('rolls.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);

drop policy if exists "sales read active users" on public.sales_orders;
drop policy if exists "sales read permitted users" on public.sales_orders;
create policy "sales read permitted users" on public.sales_orders
for select using (
  deleted_at is null
  and (
    public.has_permission('sales.view')
    or public.has_permission('reports.view')
  )
);

create or replace function public.audit_role_permission_change()
returns trigger
language plpgsql
as $$
declare
  acting_user uuid := auth.uid();
  role_permission_key uuid;
begin
  if tg_op = 'INSERT' then
    insert into public.audit_logs (user_id, action, module, record_id, old_data, new_data)
    values (
      acting_user,
      'grant_permission',
      'role_permissions',
      new.role_id,
      null,
      jsonb_build_object('role_id', new.role_id, 'permission_id', new.permission_id)
    );
    return new;
  end if;

  if tg_op = 'DELETE' then
    role_permission_key = old.role_id;
    insert into public.audit_logs (user_id, action, module, record_id, old_data, new_data)
    values (
      acting_user,
      'revoke_permission',
      'role_permissions',
      role_permission_key,
      jsonb_build_object('role_id', old.role_id, 'permission_id', old.permission_id),
      null
    );
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists audit_role_permissions on public.role_permissions;
create trigger audit_role_permissions
after insert or delete on public.role_permissions
for each row execute function public.audit_role_permission_change();


-- --- START OF MIGRATION: 005_attendance_timezone_fix.sql ---
create or replace function public.calculate_attendance()
returns trigger
language plpgsql
as $$
declare
  employee_shift_end time;
  local_check_in timestamp;
  local_check_out timestamp;
  hours_worked numeric(8,2);
  overtime numeric(8,2);
  shift_end_at timestamptz;
begin
  if new.check_in_at is not null then
    local_check_in = new.check_in_at at time zone 'Asia/Kolkata';
    new.check_in = local_check_in::time(0);
    new.attendance_date = local_check_in::date;
  end if;

  if new.check_out_at is not null then
    local_check_out = new.check_out_at at time zone 'Asia/Kolkata';
    new.check_out = local_check_out::time(0);
  end if;

  if new.check_in_at is not null and new.check_out_at is not null then
    hours_worked = round((extract(epoch from (new.check_out_at - new.check_in_at)) / 3600)::numeric, 2);
    if hours_worked < 0 then
      hours_worked = 0;
    end if;

    select shift_end into employee_shift_end
    from public.employees
    where id = new.employee_id;

    shift_end_at = ((new.attendance_date + coalesce(employee_shift_end, '18:00'::time)) at time zone 'Asia/Kolkata');
    overtime = greatest(round((extract(epoch from (new.check_out_at - shift_end_at)) / 3600)::numeric, 2), 0);

    new.working_hours = hours_worked;
    new.overtime_hours = overtime;
    new.status = case
      when hours_worked = 0 then 'absent'
      when hours_worked < 4 then 'half_day'
      else 'present'
    end;
  elsif new.check_in_at is not null then
    new.working_hours = 0;
    new.overtime_hours = 0;
    new.status = 'present';
  else
    new.working_hours = 0;
    new.overtime_hours = 0;
    new.status = 'absent';
  end if;

  return new;
end;
$$;

update public.attendance
set updated_at = updated_at
where check_in_at is not null
  and deleted_at is null;


-- --- START OF MIGRATION: 006_attendance_checkout_guard.sql ---
create or replace function public.calculate_attendance()
returns trigger
language plpgsql
as $$
declare
  employee_shift_end time;
  local_check_in timestamp;
  local_check_out timestamp;
  hours_worked numeric(8,2);
  shift_end_at timestamptz;
begin
  if new.check_in_at is not null then
    local_check_in = new.check_in_at at time zone 'Asia/Kolkata';
    new.check_in = local_check_in::time(0);
    new.attendance_date = local_check_in::date;
  end if;

  if new.check_out_at is not null and new.check_in_at is not null and new.check_out_at <= new.check_in_at then
    raise exception 'Check out time must be after check in time.';
  end if;

  if new.check_out_at is not null then
    local_check_out = new.check_out_at at time zone 'Asia/Kolkata';
    new.check_out = local_check_out::time(0);
  else
    new.check_out = null;
  end if;

  if new.check_in_at is not null and new.check_out_at is not null then
    hours_worked = round((extract(epoch from (new.check_out_at - new.check_in_at)) / 3600)::numeric, 2);

    select shift_end into employee_shift_end
    from public.employees
    where id = new.employee_id;

    shift_end_at = ((new.attendance_date + coalesce(employee_shift_end, '18:00'::time)) at time zone 'Asia/Kolkata');

    new.working_hours = hours_worked;
    new.overtime_hours = greatest(round((extract(epoch from (new.check_out_at - shift_end_at)) / 3600)::numeric, 2), 0);
    new.status = case
      when hours_worked < 4 then 'half_day'
      else 'present'
    end;
  elsif new.check_in_at is not null then
    new.working_hours = 0;
    new.overtime_hours = 0;
    new.status = 'present';
  else
    new.working_hours = 0;
    new.overtime_hours = 0;
    new.status = 'absent';
  end if;

  return new;
end;
$$;

update public.attendance
set check_out_at = ((attendance_date + check_out) at time zone 'Asia/Kolkata')
where check_in_at is not null
  and check_out is not null
  and check_out_at is not null
  and check_out_at <= check_in_at
  and ((attendance_date + check_out) at time zone 'Asia/Kolkata') > check_in_at
  and deleted_at is null;

update public.attendance
set check_out_at = null,
    check_out = null,
    working_hours = 0,
    overtime_hours = 0,
    status = 'present'
where check_in_at is not null
  and check_out_at is not null
  and check_out_at <= check_in_at
  and deleted_at is null;

update public.attendance
set updated_at = updated_at
where check_in_at is not null
  and deleted_at is null;


-- --- START OF MIGRATION: 007_loom_fabric_descriptions.sql ---
alter table public.looms
  add column if not exists description text;

alter table public.fabric_types
  add column if not exists description text;


-- --- START OF MIGRATION: 008_soft_delete_unique_constraints.sql ---
-- Drop old unique constraints
alter table public.looms drop constraint if exists looms_loom_number_key;
alter table public.raw_materials drop constraint if exists raw_materials_material_name_key;
alter table public.employees drop constraint if exists employees_employee_code_key;
alter table public.attendance drop constraint if exists attendance_employee_id_attendance_date_key;

-- Create unique indexes that only apply to active (non-deleted) records
create unique index if not exists idx_looms_loom_number_unique on public.looms (loom_number) where deleted_at is null;
create unique index if not exists idx_raw_materials_material_name_unique on public.raw_materials (material_name) where deleted_at is null;
create unique index if not exists idx_employees_employee_code_unique on public.employees (employee_code) where deleted_at is null;
create unique index if not exists idx_attendance_employee_date_unique on public.attendance (employee_id, attendance_date) where deleted_at is null;


-- --- START OF MIGRATION: 009_fabric_roll_serial_naming.sql ---
create or replace function public.create_or_sync_fabric_roll()
returns trigger
language plpgsql
as $$
declare
  new_roll_number text;
  fab_name text;
  serial_num int;
begin
  if tg_op = 'INSERT' then
    -- Get fabric name
    select fabric_name into fab_name
    from public.fabric_types
    where id = new.fabric_type_id;

    -- Count active entries for this fabric type up to this one (ordered by created_at)
    select count(*) into serial_num
    from public.loom_production_entries
    where fabric_type_id = new.fabric_type_id
      and deleted_at is null
      and created_at <= new.created_at;

    new_roll_number = fab_name || '-' || coalesce(serial_num, 1);

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


-- --- START OF MIGRATION: 010_concurrency_and_locking.sql ---
create or replace function public.prepare_production_entry()
returns trigger
language plpgsql
as $$
declare
  last_end numeric(12,2);
  loom_lock uuid;
begin
  -- Concurrency Fix: Acquire an exclusive row-level lock on the parent loom record.
  -- This blocks any concurrent transactions attempting to insert/update entries for the same loom.
  -- They will wait until this transaction commits, ensuring sequential, non-overlapping meter values.
  select id into loom_lock
  from public.looms
  where id = new.loom_id
  for update;

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


-- --- START OF MIGRATION: 011_custom_legacy_schema.sql ---
-- Migration: Custom Legacy ERP Schema and Performance Optimizations

-- 1. Categorization and Critical Levels for Raw Materials
ALTER TABLE public.raw_materials 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS critical_level NUMERIC DEFAULT 0;

-- Update existing raw materials to Fabric department by default
UPDATE public.raw_materials SET department = 'Fabric' WHERE department IS NULL;

-- 2. Custom Client/Account Fields
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS alias TEXT,
ADD COLUMN IF NOT EXISTS is_internal BOOLEAN DEFAULT false;

-- 3. Create Roto Printing Products Table
CREATE TABLE IF NOT EXISTS public.roto_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    width NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    num_cylinders INTEGER NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);

-- Enable RLS for roto_products
ALTER TABLE public.roto_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_products" ON public.roto_products;
CREATE POLICY "Allow read access to authenticated users on roto_products" 
ON public.roto_products FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write access to admins on roto_products" ON public.roto_products;
CREATE POLICY "Allow write access to admins on roto_products" 
ON public.roto_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));

-- 4. Create Offset Printing Products Table
CREATE TABLE IF NOT EXISTS public.offset_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    width NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);

-- Enable RLS for offset_products
ALTER TABLE public.offset_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on offset_products" ON public.offset_products;
CREATE POLICY "Allow read access to authenticated users on offset_products" 
ON public.offset_products FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write access to admins on offset_products" ON public.offset_products;
CREATE POLICY "Allow write access to admins on offset_products" 
ON public.offset_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));

-- 5. Create Roto Colors Table
CREATE TABLE IF NOT EXISTS public.roto_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    color_name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);

-- Enable RLS for roto_colors
ALTER TABLE public.roto_colors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_colors" ON public.roto_colors;
CREATE POLICY "Allow read access to authenticated users on roto_colors" 
ON public.roto_colors FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write access to admins on roto_colors" ON public.roto_colors;
CREATE POLICY "Allow write access to admins on roto_colors" 
ON public.roto_colors FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));

-- 6. Create Sales Order Items Table (Multi-Item Order Support)
CREATE TABLE IF NOT EXISTS public.sales_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID NOT NULL REFERENCES public.sales_orders(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    product_id UUID NOT NULL,
    quantity NUMERIC NOT NULL,
    selected_roll_ids UUID[] DEFAULT '{}'::uuid[]
);

-- Enable RLS for sales_order_items
ALTER TABLE public.sales_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on sales_order_items" ON public.sales_order_items;
CREATE POLICY "Allow read access to authenticated users on sales_order_items" 
ON public.sales_order_items FOR SELECT TO authenticated
USING (
  public.has_permission('sales.view')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Allow write access to authenticated users on sales_order_items" ON public.sales_order_items;
CREATE POLICY "Allow write access to authenticated users on sales_order_items" 
ON public.sales_order_items FOR ALL TO authenticated
USING (
  public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
);

-- 7. Alter sales_orders to support optional columns during transition
ALTER TABLE public.sales_orders 
ALTER COLUMN fabric_type_id DROP NOT NULL,
ALTER COLUMN quantity_meters DROP NOT NULL,
ALTER COLUMN rate DROP NOT NULL,
ALTER COLUMN total_amount DROP NOT NULL;

-- 8. Complete Deletion of Audit Logs
DROP TABLE IF EXISTS public.audit_logs CASCADE;

-- 9. Performance Index Additions (under 3ms queries)
CREATE INDEX IF NOT EXISTS idx_rolls_type_status ON public.fabric_rolls(fabric_type_id, status) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_production_entry_date ON public.loom_production_entries(entry_date) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON public.sales_orders(customer_id) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date) WHERE (deleted_at IS NULL);


-- --- START OF MIGRATION: 012_use_production_serial_for_rolls.sql ---
-- Migration: Use Production Entry Serial Number as Roll/Stock Number and Drop Audit Triggers
-- Relates to: Using the serial number generated on production entry as the universal roll/stock number,
-- and removing all legacy audit triggers since the audit_logs table was removed.

-- 1. Drop all legacy audit triggers to avoid 'public.audit_logs does not exist' errors
DROP TRIGGER IF EXISTS audit_roles ON public.roles CASCADE;
DROP TRIGGER IF EXISTS audit_users ON public.users CASCADE;
DROP TRIGGER IF EXISTS audit_looms ON public.looms CASCADE;
DROP TRIGGER IF EXISTS audit_fabric_types ON public.fabric_types CASCADE;
DROP TRIGGER IF EXISTS audit_raw_materials ON public.raw_materials CASCADE;
DROP TRIGGER IF EXISTS audit_raw_material_purchases ON public.raw_material_purchases CASCADE;
DROP TRIGGER IF EXISTS audit_settings ON public.settings CASCADE;
DROP TRIGGER IF EXISTS audit_employees ON public.employees CASCADE;
DROP TRIGGER IF EXISTS audit_attendance ON public.attendance CASCADE;
DROP TRIGGER IF EXISTS audit_customers ON public.customers CASCADE;
DROP TRIGGER IF EXISTS audit_production ON public.loom_production_entries CASCADE;
DROP TRIGGER IF EXISTS audit_rolls ON public.fabric_rolls CASCADE;
DROP TRIGGER IF EXISTS audit_sales ON public.sales_orders CASCADE;

-- 2. Drop the audit row function
DROP FUNCTION IF EXISTS public.audit_row_change() CASCADE;

-- 3. Create or replace the roll sync trigger function
CREATE OR REPLACE FUNCTION public.create_or_sync_fabric_roll()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    INSERT INTO public.fabric_rolls (
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
    VALUES (
      new.serial_number,
      new.id,
      new.fabric_type_id,
      new.loom_id,
      new.net_weight,
      new.net_meters,
      new.entry_date,
      CASE WHEN new.deleted_at IS NULL THEN 'available' ELSE 'voided' END,
      'loom',
      new.created_by,
      new.updated_by
    );
  ELSIF tg_op = 'UPDATE' THEN
    UPDATE public.fabric_rolls
    SET roll_number = new.serial_number,
        fabric_type_id = new.fabric_type_id,
        loom_id = new.loom_id,
        weight = new.net_weight,
        meters = new.net_meters,
        production_date = new.entry_date,
        status = CASE WHEN new.deleted_at IS NOT NULL THEN 'voided' ELSE status END,
        updated_by = new.updated_by,
        updated_at = now(),
        deleted_at = CASE WHEN new.deleted_at IS NOT NULL THEN now() ELSE deleted_at END
    WHERE production_entry_id = new.id;
  END IF;

  RETURN new;
END;
$$;

-- 4. Align existing fabric rolls with their production entry serial number
UPDATE public.fabric_rolls fr
SET roll_number = lpe.serial_number
FROM public.loom_production_entries lpe
WHERE fr.production_entry_id = lpe.id;


-- --- START OF MIGRATION: 013_simplify_production_serial_number.sql ---
-- Migration: Simplify Production Entry Serial Numbers to Fabric-Type-Specific Plain Integers (1, 2, 3, 4...)
-- Relates to: Changing the production serial numbers and roll numbers to be plain integers specific to each fabric type.

-- 1. Drop existing global unique constraints to allow duplicate serial numbers across different fabric types
ALTER TABLE public.loom_production_entries DROP CONSTRAINT IF EXISTS loom_production_entries_serial_number_key CASCADE;
ALTER TABLE public.fabric_rolls DROP CONSTRAINT IF EXISTS fabric_rolls_roll_number_key CASCADE;

-- 2. Create partial unique indexes to guarantee uniqueness per fabric type for active records
CREATE UNIQUE INDEX IF NOT EXISTS uq_lpe_fabric_type_serial ON public.loom_production_entries (fabric_type_id, serial_number) WHERE (deleted_at IS NULL);
CREATE UNIQUE INDEX IF NOT EXISTS uq_rolls_fabric_type_serial ON public.fabric_rolls (fabric_type_id, roll_number) WHERE (deleted_at IS NULL);

-- 3. Create or replace trigger function prepare_production_entry with fabric-type-specific serial generation (1, 2, 3...)
CREATE OR REPLACE FUNCTION public.prepare_production_entry()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  last_end numeric(12,2);
  loom_lock uuid;
  serial_num integer;
BEGIN
  -- Acquire an exclusive row-level lock on the parent loom record for concurrency control.
  SELECT id INTO loom_lock
  FROM public.looms
  WHERE id = new.loom_id
  FOR UPDATE;

  -- Generate fabric-specific serial number if not provided
  IF new.serial_number IS NULL OR new.serial_number = '' THEN
    SELECT COALESCE(MAX(CASE WHEN serial_number ~ '^[0-9]+$' THEN CAST(serial_number AS integer) ELSE 0 END), 0) + 1 INTO serial_num
    FROM public.loom_production_entries
    WHERE fabric_type_id = new.fabric_type_id
      AND deleted_at IS NULL;

    new.serial_number := serial_num::text;
  END IF;

  IF new.entry_date IS NULL THEN
    new.entry_date := current_date;
  END IF;

  SELECT lpe.end_meters INTO last_end
  FROM public.loom_production_entries lpe
  WHERE lpe.loom_id = new.loom_id
    AND lpe.deleted_at IS NULL
  ORDER BY lpe.created_at DESC
  LIMIT 1;

  IF tg_op = 'INSERT' AND NOT public.is_admin() THEN
    new.initial_meters := COALESCE(last_end, 0);
    new.initial_meter_overridden := false;
  ELSIF tg_op = 'INSERT' AND public.is_admin() THEN
    IF new.initial_meters IS NULL THEN
      new.initial_meters := COALESCE(last_end, 0);
    ELSE
      new.initial_meter_overridden := new.initial_meters IS DISTINCT FROM COALESCE(last_end, 0);
    END IF;
  ELSIF tg_op = 'UPDATE' AND NOT public.is_admin() THEN
    new.initial_meters := old.initial_meters;
    new.initial_meter_overridden := old.initial_meter_overridden;
  END IF;

  RETURN new;
END;
$$;

-- 4. Safely migrate existing production entry serial numbers to the fabric-specific 1, 2, 3... sequence
WITH numbered_entries AS (
  SELECT 
    lpe.id,
    row_number() OVER (PARTITION BY lpe.fabric_type_id ORDER BY lpe.created_at ASC) as seq_num
  FROM public.loom_production_entries lpe
  WHERE lpe.deleted_at IS NULL
)
UPDATE public.loom_production_entries lpe
SET serial_number = ne.seq_num::text
FROM numbered_entries ne
WHERE lpe.id = ne.id;

-- 5. Align existing fabric_rolls roll_number with the newly updated production entry serial number
UPDATE public.fabric_rolls fr
SET roll_number = lpe.serial_number
FROM public.loom_production_entries lpe
WHERE fr.production_entry_id = lpe.id;


-- --- START OF MIGRATION: 014_add_raw_materials_description.sql ---
-- Migration: Add description to raw_materials table
ALTER TABLE public.raw_materials 
ADD COLUMN IF NOT EXISTS description TEXT;


-- --- START OF MIGRATION: 015_phase1_performance_indexes_and_rpcs.sql ---
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


-- --- START OF MIGRATION: 016_dashboard_and_stock_summary_rpcs.sql ---
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


-- --- START OF MIGRATION: 017_align_attendance_employee_schema.sql ---
-- Align attendance and employee schema with the app's expected runtime fields

ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS joining_date DATE,
  ADD COLUMN IF NOT EXISTS shift_start TIME,
  ADD COLUMN IF NOT EXISTS shift_end TIME;

ALTER TABLE public.attendance
  ADD COLUMN IF NOT EXISTS check_in_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS check_out_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS working_hours NUMERIC(8,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS overtime_hours NUMERIC(8,2) DEFAULT 0;

UPDATE public.attendance
SET check_in_at = (
  (attendance_date + check_in) AT TIME ZONE 'Asia/Kolkata'
)
WHERE check_in_at IS NULL
  AND check_in IS NOT NULL
  AND attendance_date IS NOT NULL;

UPDATE public.attendance
SET check_out_at = (
  (attendance_date + check_out) AT TIME ZONE 'Asia/Kolkata'
)
WHERE check_out_at IS NULL
  AND check_out IS NOT NULL
  AND attendance_date IS NOT NULL;

UPDATE public.attendance
SET working_hours = COALESCE(working_hours, 0)
WHERE working_hours IS NULL;

UPDATE public.attendance
SET overtime_hours = COALESCE(overtime_hours, 0)
WHERE overtime_hours IS NULL;


-- --- START OF MIGRATION: 018_complete_erp_schema.sql ---
-- Migration: Complete ERP Stage Workflows, Consumptions, Accounting Journals, and Bug Fixes

-- 1. Drop the legacy audit trigger on role_permissions (since audit_logs table was removed)
DROP TRIGGER IF EXISTS audit_role_permissions ON public.role_permissions CASCADE;
DROP FUNCTION IF EXISTS public.audit_role_permission_change() CASCADE;

-- 2. Redefine raw material purchase stock adjustment to handle soft-deletes correctly
CREATE OR REPLACE FUNCTION public.apply_raw_material_purchase()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    UPDATE public.raw_materials
    SET current_stock = current_stock + NEW.quantity,
        updated_at = now(),
        updated_by = NEW.updated_by
    WHERE id = NEW.raw_material_id;
  ELSIF tg_op = 'UPDATE' THEN
    -- If soft-deleted
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock - OLD.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = OLD.raw_material_id;
    -- If restored
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock + NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
    -- Normal update
    ELSIF NEW.deleted_at IS NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock - OLD.quantity + NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 3. Create Raw Material Consumptions Table
CREATE TABLE IF NOT EXISTS public.raw_material_consumptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consumption_date DATE NOT NULL DEFAULT CURRENT_DATE,
    raw_material_id UUID NOT NULL REFERENCES public.raw_materials(id),
    department TEXT NOT NULL,
    quantity NUMERIC(12,3) NOT NULL CHECK (quantity > 0),
    remarks TEXT,
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Enable RLS for raw_material_consumptions
ALTER TABLE public.raw_material_consumptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on raw_material_consumptions" ON public.raw_material_consumptions;
DROP POLICY IF EXISTS "Allow read access to permitted users on raw_material_consumptio" ON public.raw_material_consumptions;
CREATE POLICY "Allow read access to permitted users on raw_material_consumptions"
ON public.raw_material_consumptions FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('raw_materials.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Allow write access to permitted users on raw_material_consumptions" ON public.raw_material_consumptions;
DROP POLICY IF EXISTS "Allow write access to permitted users on raw_material_consumptio" ON public.raw_material_consumptions;
CREATE POLICY "Allow write access to permitted users on raw_material_consumptions"
ON public.raw_material_consumptions FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.is_admin()
);

-- Trigger for stock updates on consumption changes
CREATE OR REPLACE FUNCTION public.apply_raw_material_consumption()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    UPDATE public.raw_materials
    SET current_stock = current_stock - NEW.quantity,
        updated_at = now(),
        updated_by = NEW.updated_by
    WHERE id = NEW.raw_material_id;
  ELSIF tg_op = 'UPDATE' THEN
    -- If soft-deleted
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock + OLD.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = OLD.raw_material_id;
    -- If restored
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock - NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
    -- Normal update
    ELSIF NEW.deleted_at IS NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock + OLD.quantity - NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS raw_consumption_updates_stock ON public.raw_material_consumptions;
CREATE TRIGGER raw_consumption_updates_stock
AFTER INSERT OR UPDATE ON public.raw_material_consumptions
FOR EACH ROW EXECUTE FUNCTION public.apply_raw_material_consumption();


-- 4. Create Stage Production Entries Table
CREATE TABLE IF NOT EXISTS public.stage_production_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    roll_id UUID NOT NULL REFERENCES public.fabric_rolls(id),
    stage TEXT NOT NULL CHECK (stage IN ('roto_printing', 'lamination', 'offset_printing', 'finishing')),
    product_id TEXT,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    remarks TEXT,
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Enable RLS for stage_production_entries
ALTER TABLE public.stage_production_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on stage_production_entries" ON public.stage_production_entries;
DROP POLICY IF EXISTS "Allow read access to permitted users on stage_production_entrie" ON public.stage_production_entries;
CREATE POLICY "Allow read access to permitted users on stage_production_entries"
ON public.stage_production_entries FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Allow write access to permitted users on stage_production_entries" ON public.stage_production_entries;
DROP POLICY IF EXISTS "Allow write access to permitted users on stage_production_entrie" ON public.stage_production_entries;
CREATE POLICY "Allow write access to permitted users on stage_production_entries"
ON public.stage_production_entries FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);

-- Trigger to progress fabric roll stage
CREATE OR REPLACE FUNCTION public.apply_stage_production()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    UPDATE public.fabric_rolls
    SET current_stage = NEW.stage,
        updated_at = now(),
        updated_by = NEW.updated_by
    WHERE id = NEW.roll_id;
  ELSIF tg_op = 'UPDATE' THEN
    -- If soft-deleted
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      -- Revert roll current_stage back to previous logical stage or 'loom'
      UPDATE public.fabric_rolls
      SET current_stage = CASE
            WHEN NEW.stage = 'finishing' THEN 'offset_printing'
            WHEN NEW.stage = 'offset_printing' THEN 'lamination'
            WHEN NEW.stage = 'lamination' THEN 'roto_printing'
            WHEN NEW.stage = 'roto_printing' THEN 'loom'
            ELSE 'loom'
          END,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.roll_id;
    -- Restored or updated
    ELSE
      UPDATE public.fabric_rolls
      SET current_stage = NEW.stage,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.roll_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stage_production_updates_roll ON public.stage_production_entries;
CREATE TRIGGER stage_production_updates_roll
AFTER INSERT OR UPDATE ON public.stage_production_entries
FOR EACH ROW EXECUTE FUNCTION public.apply_stage_production();


-- 5. Create Accounting Journal Entries Table
CREATE TABLE IF NOT EXISTS public.accounts_journal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    account_name TEXT NOT NULL,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('debit', 'credit')),
    amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
    description TEXT,
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Enable RLS for accounts_journal
ALTER TABLE public.accounts_journal ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on accounts_journal" ON public.accounts_journal;
DROP POLICY IF EXISTS "Allow read access to permitted users on accounts_journa" ON public.accounts_journal;
CREATE POLICY "Allow read access to permitted users on accounts_journal"
ON public.accounts_journal FOR SELECT TO authenticated
USING (
  public.has_permission('sales.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Allow write access to permitted users on accounts_journal" ON public.accounts_journal;
DROP POLICY IF EXISTS "Allow write access to permitted users on accounts_journa" ON public.accounts_journal;
CREATE POLICY "Allow write access to permitted users on accounts_journal"
ON public.accounts_journal FOR ALL TO authenticated
USING (
  public.has_permission('sales.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('sales.edit')
  OR public.is_admin()
);


-- --- START OF MIGRATION: 019_fix_product_id_types.sql ---
-- Migration: Fix product_id column types for non-UUID product identifiers
-- Lamination and Finishing departments use string IDs (e.g., 'lam-film-25', 'finished-bags-28')
-- instead of UUID references, so we need TEXT columns.

-- Fix sales_order_items.product_id: UUID -> TEXT
ALTER TABLE public.sales_order_items ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;


-- --- START OF MIGRATION: 020_add_journal_no.sql ---
-- Migration: Add journal_no to accounts_journal
ALTER TABLE public.accounts_journal ADD COLUMN IF NOT EXISTS journal_no TEXT;


-- --- START OF MIGRATION: 021_change_is_internal_to_text.sql ---
-- Migration: Change is_internal column of customers from BOOLEAN to TEXT with account types
ALTER TABLE public.customers ALTER COLUMN is_internal DROP DEFAULT;

ALTER TABLE public.customers 
  ALTER COLUMN is_internal TYPE TEXT 
  USING (CASE WHEN is_internal::text = 'true' THEN 'profit and loss a/c' ELSE 'client a/c' END);

ALTER TABLE public.customers ALTER COLUMN is_internal SET DEFAULT 'client a/c';


-- --- START OF MIGRATION: 022_add_billing_to_sales_orders.sql ---
-- Migration: Add billing fields to sales_orders for Sales Entry workflow
ALTER TABLE public.sales_orders
ADD COLUMN IF NOT EXISTS bill_number TEXT,
ADD COLUMN IF NOT EXISTS bill_value NUMERIC(14,2);

-- Ensure "Purchase A/c" and "Sales A/c" system accounts exist
INSERT INTO public.customers (customer_name, alias, is_internal, status)
VALUES
  ('Purchase A/c', 'PURCHASE', 'profit and loss a/c', 'active'),
  ('Sales A/c', 'SALES', 'profit and loss a/c', 'active')
ON CONFLICT DO NOTHING;


-- --- START OF MIGRATION: 023_performance_optimization_indexes.sql ---
-- 1. Indexes for product brand sorting
CREATE INDEX IF NOT EXISTS idx_roto_products_brand ON public.roto_products (brand);
CREATE INDEX IF NOT EXISTS idx_offset_products_brand ON public.offset_products (brand);

-- 2. Non-composite indexes for name/material_name sorting
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON public.raw_materials (material_name) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employees_name ON public.employees (name) WHERE deleted_at IS NULL;

-- 3. Composite index for sales order billing status & date lookups
CREATE INDEX IF NOT EXISTS idx_sales_orders_billing_status_date ON public.sales_orders (status, bill_number, order_date DESC) WHERE deleted_at IS NULL;


-- --- START OF MIGRATION: 024_add_account_id_to_journal.sql ---
-- 1. Add account_id column referencing customers
ALTER TABLE public.accounts_journal
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.customers(id);

-- 2. Backpopulate account_id for existing records
UPDATE public.accounts_journal aj
SET account_id = c.id
FROM public.customers c
WHERE TRIM(LOWER(c.customer_name)) = TRIM(LOWER(aj.account_name))
   OR TRIM(LOWER(c.alias)) = TRIM(LOWER(aj.account_name))
   OR (aj.account_name = 'Purchase A/c' AND c.customer_name = 'Purchase A/c')
   OR (aj.account_name = 'Sales A/c' AND c.customer_name = 'Sales A/c');

-- 3. Create index for high availability reporting
CREATE INDEX IF NOT EXISTS idx_accounts_journal_account_id 
ON public.accounts_journal(account_id) 
WHERE deleted_at IS NULL;

-- 4. Create indexes for missing foreign keys to optimize database performance
CREATE INDEX IF NOT EXISTS idx_raw_material_purchases_material ON public.raw_material_purchases(raw_material_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_loom_production_entries_fabric ON public.loom_production_entries(fabric_type_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sales_order_items_order ON public.sales_order_items(sales_order_id);


-- --- START OF MIGRATION: 025_convert_soft_delete_to_cascade_hard_delete.sql ---
-- Migration: Convert soft delete constraints to cascade hard delete constraints

-- 1. Table: role_permissions
ALTER TABLE public.role_permissions
  DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey,
  DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;

ALTER TABLE public.role_permissions
  ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE,
  ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;

-- 2. Table: users
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_role_id_fkey;

ALTER TABLE public.users
  ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;

-- 3. Table: raw_material_purchases
ALTER TABLE public.raw_material_purchases
  DROP CONSTRAINT IF EXISTS raw_material_purchases_raw_material_id_fkey;

ALTER TABLE public.raw_material_purchases
  ADD CONSTRAINT raw_material_purchases_raw_material_id_fkey FOREIGN KEY (raw_material_id) REFERENCES public.raw_materials(id) ON DELETE CASCADE;

-- 4. Table: raw_material_consumptions
ALTER TABLE public.raw_material_consumptions
  DROP CONSTRAINT IF EXISTS raw_material_consumptions_raw_material_id_fkey;

ALTER TABLE public.raw_material_consumptions
  ADD CONSTRAINT raw_material_consumptions_raw_material_id_fkey FOREIGN KEY (raw_material_id) REFERENCES public.raw_materials(id) ON DELETE CASCADE;

-- 5. Table: employees
ALTER TABLE public.employees
  DROP CONSTRAINT IF EXISTS employees_user_id_fkey;

ALTER TABLE public.employees
  ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- 6. Table: attendance
ALTER TABLE public.attendance
  DROP CONSTRAINT IF EXISTS attendance_employee_id_fkey;

ALTER TABLE public.attendance
  ADD CONSTRAINT attendance_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;

-- 7. Table: loom_production_entries
ALTER TABLE public.loom_production_entries
  DROP CONSTRAINT IF EXISTS loom_production_entries_fabric_type_id_fkey,
  DROP CONSTRAINT IF EXISTS loom_production_entries_loom_id_fkey;

ALTER TABLE public.loom_production_entries
  ADD CONSTRAINT loom_production_entries_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE,
  ADD CONSTRAINT loom_production_entries_loom_id_fkey FOREIGN KEY (loom_id) REFERENCES public.looms(id) ON DELETE CASCADE;

-- 8. Table: fabric_rolls
ALTER TABLE public.fabric_rolls
  DROP CONSTRAINT IF EXISTS fabric_rolls_production_entry_id_fkey,
  DROP CONSTRAINT IF EXISTS fabric_rolls_fabric_type_id_fkey,
  DROP CONSTRAINT IF EXISTS fabric_rolls_loom_id_fkey;

ALTER TABLE public.fabric_rolls
  ADD CONSTRAINT fabric_rolls_production_entry_id_fkey FOREIGN KEY (production_entry_id) REFERENCES public.loom_production_entries(id) ON DELETE CASCADE,
  ADD CONSTRAINT fabric_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE,
  ADD CONSTRAINT fabric_rolls_loom_id_fkey FOREIGN KEY (loom_id) REFERENCES public.looms(id) ON DELETE CASCADE;

-- 9. Table: sales_orders
ALTER TABLE public.sales_orders
  DROP CONSTRAINT IF EXISTS sales_orders_customer_id_fkey,
  DROP CONSTRAINT IF EXISTS sales_orders_fabric_type_id_fkey;

ALTER TABLE public.sales_orders
  ADD CONSTRAINT sales_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE,
  ADD CONSTRAINT sales_orders_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE CASCADE;

-- 10. Table: sales_order_items
ALTER TABLE public.sales_order_items
  DROP CONSTRAINT IF EXISTS sales_order_items_sales_order_id_fkey;

ALTER TABLE public.sales_order_items
  ADD CONSTRAINT sales_order_items_sales_order_id_fkey FOREIGN KEY (sales_order_id) REFERENCES public.sales_orders(id) ON DELETE CASCADE;

-- 11. Table: stage_production_entries
ALTER TABLE public.stage_production_entries
  DROP CONSTRAINT IF EXISTS stage_production_entries_roll_id_fkey;

ALTER TABLE public.stage_production_entries
  ADD CONSTRAINT stage_production_entries_roll_id_fkey FOREIGN KEY (roll_id) REFERENCES public.fabric_rolls(id) ON DELETE CASCADE;

-- 12. Table: accounts_journal
ALTER TABLE public.accounts_journal
  DROP CONSTRAINT IF EXISTS accounts_journal_account_id_fkey;

ALTER TABLE public.accounts_journal
  ADD CONSTRAINT accounts_journal_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.customers(id) ON DELETE CASCADE;


-- --- START OF MIGRATION: 026_allow_duplicate_order_numbers.sql ---
-- Migration: Allow duplicate order numbers in sales_orders table
ALTER TABLE public.sales_orders DROP CONSTRAINT IF EXISTS sales_orders_order_number_key;


-- --- START OF MIGRATION: 027_add_billing_details_to_items.sql ---
-- Migration: Add billing details to sales order items and sales orders for Sales Confirmation Report
ALTER TABLE public.sales_order_items ADD COLUMN IF NOT EXISTS price NUMERIC(12,2) DEFAULT 0;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18;


-- --- START OF MIGRATION: 028_add_opening_balances_to_customers.sql ---
-- Migration: Add opening balances to customers table
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS opening_debit NUMERIC(12,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS opening_credit NUMERIC(12,2) NOT NULL DEFAULT 0;


-- --- START OF MIGRATION: 029_create_material_sales_table.sql ---
-- Migration: Create Material Sales Table and Triggers for Stock Adjustment

-- 1. Create material_sales table
CREATE TABLE IF NOT EXISTS public.material_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    bill_number TEXT NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('raw_material', 'waste')),
    department TEXT, -- null if waste
    raw_material_id UUID REFERENCES public.raw_materials(id) ON DELETE CASCADE, -- null if waste
    quantity NUMERIC(12,3) NOT NULL CHECK (quantity > 0),
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    inc_gst BOOLEAN NOT NULL DEFAULT FALSE,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    journal_no TEXT, -- Reference to the accounts_journal entry group
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.material_sales ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to permitted users on material_sales" ON public.material_sales;
DROP POLICY IF EXISTS "Allow write access to permitted users on material_sales" ON public.material_sales;

-- 4. Create RLS Policies
CREATE POLICY "Allow read access to permitted users on material_sales"
ON public.material_sales FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.view')
);

CREATE POLICY "Allow write access to permitted users on material_sales"
ON public.material_sales FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
);

-- 5. Trigger to automatically adjust raw materials stock
CREATE OR REPLACE FUNCTION public.apply_material_sales_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    IF NEW.deleted_at IS NULL AND NEW.type = 'raw_material' AND NEW.raw_material_id IS NOT NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock - NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
    END IF;
  ELSIF tg_op = 'UPDATE' THEN
    -- If soft-deleted
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      IF OLD.type = 'raw_material' AND OLD.raw_material_id IS NOT NULL THEN
        UPDATE public.raw_materials
        SET current_stock = current_stock + OLD.quantity,
            updated_at = now(),
            updated_by = NEW.updated_by
        WHERE id = OLD.raw_material_id;
      END IF;
    -- If restored
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      IF NEW.type = 'raw_material' AND NEW.raw_material_id IS NOT NULL THEN
        UPDATE public.raw_materials
        SET current_stock = current_stock - NEW.quantity,
            updated_at = now(),
            updated_by = NEW.updated_by
        WHERE id = NEW.raw_material_id;
      END IF;
    -- Normal update
    ELSIF NEW.deleted_at IS NULL THEN
      IF OLD.raw_material_id = NEW.raw_material_id THEN
        IF NEW.type = 'raw_material' AND NEW.raw_material_id IS NOT NULL THEN
          UPDATE public.raw_materials
          SET current_stock = current_stock + OLD.quantity - NEW.quantity,
              updated_at = now(),
              updated_by = NEW.updated_by
          WHERE id = NEW.raw_material_id;
        END IF;
      ELSE
        IF OLD.type = 'raw_material' AND OLD.raw_material_id IS NOT NULL THEN
          UPDATE public.raw_materials
          SET current_stock = current_stock + OLD.quantity,
              updated_at = now(),
              updated_by = OLD.updated_by
          WHERE id = OLD.raw_material_id;
        END IF;
        IF NEW.type = 'raw_material' AND NEW.raw_material_id IS NOT NULL THEN
          UPDATE public.raw_materials
          SET current_stock = current_stock - NEW.quantity,
              updated_at = now(),
              updated_by = NEW.updated_by
          WHERE id = NEW.raw_material_id;
        END IF;
      END IF;
    END IF;
  ELSIF tg_op = 'DELETE' THEN
    IF OLD.deleted_at IS NULL AND OLD.type = 'raw_material' AND OLD.raw_material_id IS NOT NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock + OLD.quantity,
          updated_at = now(),
          updated_by = OLD.updated_by
      WHERE id = OLD.raw_material_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS material_sales_updates_stock ON public.material_sales;
CREATE TRIGGER material_sales_updates_stock
AFTER INSERT OR UPDATE OR DELETE ON public.material_sales
FOR EACH ROW EXECUTE FUNCTION public.apply_material_sales_stock();


-- --- START OF MIGRATION: 030_add_customer_id_to_products.sql ---
-- Migration: Add customer_id (client) to roto_products and offset_products

-- 1. Add customer_id to roto_products
ALTER TABLE public.roto_products
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- 2. Add customer_id to offset_products
ALTER TABLE public.offset_products
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;


-- --- START OF MIGRATION: 031_new_production_tables.sql ---
-- Migration: 031_new_production_tables.sql
-- Create production tables for Roto, Lamination, Offset, and Finishing, and set up automatic consumption triggers.

-- 1. Drop check constraint on status of public.fabric_rolls and recreate with 'consumed' option
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT tc.constraint_name 
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = 'fabric_rolls' 
          AND tc.constraint_type = 'CHECK'
          AND ccu.column_name = 'status'
    LOOP
        EXECUTE 'ALTER TABLE public.fabric_rolls DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

ALTER TABLE public.fabric_rolls ADD CONSTRAINT fabric_rolls_status_check
  CHECK (status IN ('available', 'reserved', 'sold', 'voided', 'consumed'));


-- 2. Create Roto Film Rolls Table
CREATE TABLE IF NOT EXISTS public.roto_film_rolls (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id         TEXT UNIQUE NOT NULL,
  brand_id        UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  film_type       TEXT NOT NULL CHECK (film_type IN ('gloss', 'matt')),
  color_id        UUID REFERENCES public.roto_colors(id) ON DELETE SET NULL,
  weight_kg       NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  meters          NUMERIC(10,2) NOT NULL CHECK (meters > 0),
  entry_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  status          TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by      UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by      UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);

ALTER TABLE public.roto_film_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on roto_film_rolls"
ON public.roto_film_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

CREATE POLICY "Allow write access to permitted users on roto_film_rolls"
ON public.roto_film_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);


-- 3. Create Roto Metallic Rolls Table
CREATE TABLE IF NOT EXISTS public.roto_metallic_rolls (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id              TEXT UNIQUE NOT NULL,
  source_film_roll_id  UUID NOT NULL REFERENCES public.roto_film_rolls(id) ON DELETE RESTRICT,
  is_split             BOOLEAN NOT NULL DEFAULT FALSE,
  weight_kg            NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  meters               NUMERIC(10,2) NOT NULL CHECK (meters > 0),
  entry_date           DATE NOT NULL DEFAULT CURRENT_DATE,
  status               TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at           TIMESTAMPTZ
);

ALTER TABLE public.roto_metallic_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on roto_metallic_rolls"
ON public.roto_metallic_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

CREATE POLICY "Allow write access to permitted users on roto_metallic_rolls"
ON public.roto_metallic_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);


-- 4. Create Lamination Rolls Table
CREATE TABLE IF NOT EXISTS public.lamination_rolls (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id           TEXT UNIQUE NOT NULL,
  lam_type          TEXT NOT NULL CHECK (lam_type IN ('BOX', 'F_S', 'H_S', 'NW', 'PLAIN')),
  fabric_roll_id    UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
  film_roll_id      UUID REFERENCES public.roto_metallic_rolls(id) ON DELETE RESTRICT,
  nw_material_id    UUID REFERENCES public.raw_materials(id) ON DELETE SET NULL,
  weight_kg         NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  meters            NUMERIC(10,2) NOT NULL CHECK (meters > 0),
  entry_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  status            TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ
);

ALTER TABLE public.lamination_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on lamination_rolls"
ON public.lamination_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

CREATE POLICY "Allow write access to permitted users on lamination_rolls"
ON public.lamination_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);


-- 5. Create Offset Rolls Table
CREATE TABLE IF NOT EXISTS public.offset_rolls (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id                   TEXT UNIQUE NOT NULL,
  offset_type               TEXT NOT NULL CHECK (offset_type IN ('NW', 'NW_LAM', 'PLAIN_LAM', 'FABRIC')),
  brand_id                  UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  source_fabric_roll_id     UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
  source_lam_roll_id        UUID REFERENCES public.lamination_rolls(id) ON DELETE RESTRICT,
  weight_kg                 NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  entry_date                DATE NOT NULL DEFAULT CURRENT_DATE,
  status                    TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at                TIMESTAMPTZ
);

ALTER TABLE public.offset_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on offset_rolls"
ON public.offset_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

CREATE POLICY "Allow write access to permitted users on offset_rolls"
ON public.offset_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);


-- 6. Create Finishing Bundles Table
CREATE TABLE IF NOT EXISTS public.finishing_bundles (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id                 TEXT NOT NULL,
  finish_type               TEXT NOT NULL CHECK (finish_type IN ('LAMINATED', 'NW', 'PLAIN')),
  source_lam_roll_id        UUID REFERENCES public.lamination_rolls(id) ON DELETE RESTRICT,
  source_fabric_roll_id     UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
  source_nw_material_id     UUID REFERENCES public.raw_materials(id) ON DELETE SET NULL,
  num_bags                  INTEGER NOT NULL CHECK (num_bags > 0),
  weight_kg                 NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  entry_date                DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at                TIMESTAMPTZ
);

ALTER TABLE public.finishing_bundles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on finishing_bundles"
ON public.finishing_bundles FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

CREATE POLICY "Allow write access to permitted users on finishing_bundles"
ON public.finishing_bundles FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);


-- 7. Trigger Functions and Triggers for Consumption Logic

-- Roto Metallic consumes Film Roll
CREATE OR REPLACE FUNCTION public.apply_roto_metallic_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_split = FALSE THEN
      UPDATE public.roto_film_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_film_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.roto_film_rolls
    SET status = 'available', updated_at = now()
    WHERE id = OLD.source_film_roll_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS metallic_roll_consumes_film ON public.roto_metallic_rolls;
CREATE TRIGGER metallic_roll_consumes_film
AFTER INSERT OR DELETE ON public.roto_metallic_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_roto_metallic_consumption();


-- Lamination consumes Fabric + Film
CREATE OR REPLACE FUNCTION public.apply_lamination_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Fabric roll is always consumed
    UPDATE public.fabric_rolls
    SET status = 'consumed', current_stage = 'lamination', updated_at = now()
    WHERE id = NEW.fabric_roll_id;

    -- Film roll is consumed if present
    IF NEW.film_roll_id IS NOT NULL THEN
      UPDATE public.roto_metallic_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.film_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.fabric_rolls
    SET status = 'available', current_stage = 'loom', updated_at = now()
    WHERE id = OLD.fabric_roll_id;

    IF OLD.film_roll_id IS NOT NULL THEN
      UPDATE public.roto_metallic_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.film_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lamination_roll_consumes_inputs ON public.lamination_rolls;
CREATE TRIGGER lamination_roll_consumes_inputs
AFTER INSERT OR DELETE ON public.lamination_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_lamination_consumption();


-- Offset consumes Lamination roll or Fabric roll
CREATE OR REPLACE FUNCTION public.apply_offset_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.offset_type = 'FABRIC' AND NEW.source_fabric_roll_id IS NOT NULL THEN
      UPDATE public.fabric_rolls
      SET status = 'consumed', current_stage = 'offset_printing', updated_at = now()
      WHERE id = NEW.source_fabric_roll_id;
    ELSIF NEW.offset_type IN ('NW_LAM', 'PLAIN_LAM') AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.offset_type = 'FABRIC' AND OLD.source_fabric_roll_id IS NOT NULL THEN
      UPDATE public.fabric_rolls
      SET status = 'available', current_stage = 'loom', updated_at = now()
      WHERE id = OLD.source_fabric_roll_id;
    ELSIF OLD.offset_type IN ('NW_LAM', 'PLAIN_LAM') AND OLD.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.source_lam_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS offset_roll_consumes_inputs ON public.offset_rolls;
CREATE TRIGGER offset_roll_consumes_inputs
AFTER INSERT OR DELETE ON public.offset_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_offset_consumption();


-- Finishing consumes Lamination roll or Fabric roll
CREATE OR REPLACE FUNCTION public.apply_finishing_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.finish_type = 'LAMINATED' AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
    ELSIF NEW.finish_type = 'PLAIN' AND NEW.source_fabric_roll_id IS NOT NULL THEN
      UPDATE public.fabric_rolls
      SET status = 'consumed', current_stage = 'finishing', updated_at = now()
      WHERE id = NEW.source_fabric_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.finish_type = 'LAMINATED' AND OLD.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.source_lam_roll_id;
    ELSIF OLD.finish_type = 'PLAIN' AND OLD.source_fabric_roll_id IS NOT NULL THEN
      UPDATE public.fabric_rolls
      SET status = 'available', current_stage = 'loom', updated_at = now()
      WHERE id = OLD.source_fabric_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS finishing_bundle_consumes_inputs ON public.finishing_bundles;
CREATE TRIGGER finishing_bundle_consumes_inputs
AFTER INSERT OR DELETE ON public.finishing_bundles
FOR EACH ROW EXECUTE FUNCTION public.apply_finishing_consumption();


-- --- START OF MIGRATION: 032_alter_production_fabric_type.sql ---
-- Migration: Alter Lamination, Offset, and Finishing to use fabric_type_id instead of fabric_roll_id

-- 1. Alter public.lamination_rolls
ALTER TABLE public.lamination_rolls DROP CONSTRAINT IF EXISTS lamination_rolls_fabric_roll_id_fkey;
ALTER TABLE public.lamination_rolls RENAME COLUMN fabric_roll_id TO fabric_type_id;

ALTER TABLE public.lamination_rolls
  ADD CONSTRAINT lamination_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;

-- 2. Alter public.offset_rolls
ALTER TABLE public.offset_rolls DROP CONSTRAINT IF EXISTS offset_rolls_source_fabric_roll_id_fkey;
ALTER TABLE public.offset_rolls RENAME COLUMN source_fabric_roll_id TO fabric_type_id;

ALTER TABLE public.offset_rolls
  ADD CONSTRAINT offset_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;

-- 3. Alter public.finishing_bundles
ALTER TABLE public.finishing_bundles DROP CONSTRAINT IF EXISTS finishing_bundles_source_fabric_roll_id_fkey;
ALTER TABLE public.finishing_bundles RENAME COLUMN source_fabric_roll_id TO fabric_type_id;

ALTER TABLE public.finishing_bundles
  ADD CONSTRAINT finishing_bundles_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;

-- 4. Update trigger apply_lamination_consumption
CREATE OR REPLACE FUNCTION public.apply_lamination_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Film roll is consumed if present
    IF NEW.film_roll_id IS NOT NULL THEN
      UPDATE public.roto_metallic_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.film_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.film_roll_id IS NOT NULL THEN
      UPDATE public.roto_metallic_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.film_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 5. Update trigger apply_offset_consumption
CREATE OR REPLACE FUNCTION public.apply_offset_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.offset_type IN ('NW_LAM', 'PLAIN_LAM') AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.offset_type IN ('NW_LAM', 'PLAIN_LAM') AND OLD.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.source_lam_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 6. Update trigger apply_finishing_consumption
CREATE OR REPLACE FUNCTION public.apply_finishing_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.finish_type = 'LAMINATED' AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.finish_type = 'LAMINATED' AND OLD.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.source_lam_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- --- START OF MIGRATION: 033_add_roto_colors_audit_columns.sql ---
-- Migration: Add audit columns to public.roto_colors for model compatibility and consistent history tracking

-- 1. Alter table to add audit columns
ALTER TABLE public.roto_colors
  ADD COLUMN created_by UUID REFERENCES public.users(id),
  ADD COLUMN updated_by UUID REFERENCES public.users(id),
  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN deleted_at TIMESTAMPTZ;

-- 2. Create trigger to automatically touch updated_at
CREATE TRIGGER touch_roto_colors
  BEFORE UPDATE ON public.roto_colors
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- 3. Drop legacy write policy and replace with standard permission policy
DROP POLICY IF EXISTS "Allow write access to admins on roto_colors" ON public.roto_colors;

CREATE POLICY "roto_colors permission write" ON public.roto_colors
  FOR ALL
  TO authenticated
  USING (
    public.is_admin() 
    OR public.has_permission('roto_colors.edit') 
    OR public.has_permission('roto_colors.delete')
  )
  WITH CHECK (
    public.is_admin() 
    OR public.has_permission('roto_colors.create') 
    OR public.has_permission('roto_colors.edit')
  );


-- --- START OF MIGRATION: 034_get_next_serial_rpc.sql ---
-- Migration: Add index and function for scalable next serial number calculation
-- Relates to: Optimizing page.tsx loading performance for high volume of production entries

-- 1. Create a composite index to allow instant lookup of the latest entry per fabric type
CREATE INDEX IF NOT EXISTS idx_lpe_fabric_created 
ON public.loom_production_entries (fabric_type_id, created_at DESC) 
WHERE deleted_at IS NULL;

-- 2. Define the RPC function to compute next serial numbers
CREATE OR REPLACE FUNCTION public.get_next_serial_numbers()
RETURNS TABLE (
  fabric_type_id uuid,
  next_serial integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ft.id AS fabric_type_id,
    COALESCE(
      (
        SELECT CAST(lpe.serial_number AS integer)
        FROM public.loom_production_entries lpe
        WHERE lpe.fabric_type_id = ft.id
          AND lpe.deleted_at IS NULL
          AND lpe.serial_number ~ '^[0-9]+$'
        ORDER BY lpe.created_at DESC
        LIMIT 1
      ),
      0
    ) + 1 AS next_serial
  FROM public.fabric_types ft
  WHERE ft.deleted_at IS NULL;
END;
$$;


-- --- START OF MIGRATION: 035_scalability_optimizations.sql ---
-- Migration: Scalability and Performance Optimizations for Billion-Row capacity
-- Relates to: Optimizing trigger sequences and replacing heavy client-side table fetches with database RPCs

-- 1. Optimize next_year_number function to use O(1) ORDER BY DESC LIMIT 1 index scans
CREATE OR REPLACE FUNCTION public.next_year_number(prefix text, table_name text, column_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  yr text := to_char(current_date, 'YYYY');
  max_val text;
  next_number int;
  sql text;
BEGIN
  sql := format(
    'SELECT %I FROM public.%I WHERE %I LIKE %L ORDER BY %I DESC LIMIT 1',
    column_name, table_name, column_name, prefix || '-' || yr || '-%', column_name
  );
  EXECUTE sql INTO max_val;
  
  IF max_val IS NULL THEN
    next_number := 1;
  ELSE
    next_number := COALESCE((regexp_match(max_val, '-([0-9]+)$'))[1]::int, 0) + 1;
  END IF;
  
  RETURN prefix || '-' || yr || '-' || lpad(next_number::text, 6, '0');
END;
$$;

-- 2. Create index on accounts_journal(journal_no) for rapid sequence lookup
CREATE INDEX IF NOT EXISTS idx_accounts_journal_journal_no_desc 
ON public.accounts_journal (journal_no DESC NULLS LAST) 
WHERE deleted_at IS NULL;

-- 3. Define RPC to get the next Journal Entry number
CREATE OR REPLACE FUNCTION public.get_next_journal_no()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  max_no text;
  next_val integer;
BEGIN
  SELECT aj.journal_no INTO max_no
  FROM public.accounts_journal aj
  WHERE aj.deleted_at IS NULL
    AND aj.journal_no ~ '^JE-[0-9]+$'
  ORDER BY aj.journal_no DESC
  LIMIT 1;

  IF max_no IS NULL THEN
    next_val := 1;
  ELSE
    next_val := CAST(SUBSTRING(max_no FROM 4) AS integer) + 1;
  END IF;

  RETURN 'JE-' || lpad(next_val::text, 6, '0');
END;
$$;

-- 4. Define RPC to calculate the opening balance before a date
CREATE OR REPLACE FUNCTION public.get_opening_balance(p_account_id uuid, p_from_date date)
RETURNS TABLE (
  total_debit numeric,
  total_credit numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(SUM(CASE WHEN entry_type = 'debit' THEN amount ELSE 0 END), 0) AS total_debit,
    COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END), 0) AS total_credit
  FROM public.accounts_journal
  WHERE account_id = p_account_id
    AND entry_date < p_from_date
    AND deleted_at IS NULL;
$$;

-- 5. Define RPC to calculate debit/credit summaries by account for financial statements
CREATE OR REPLACE FUNCTION public.get_accounts_journal_summary_by_date(p_date date)
RETURNS TABLE (
  account_id uuid,
  account_name text,
  entry_type text,
  amount numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    aj.account_id,
    aj.account_name,
    aj.entry_type,
    SUM(aj.amount) AS amount
  FROM public.accounts_journal aj
  WHERE aj.entry_date <= p_date
    AND aj.deleted_at IS NULL
  GROUP BY aj.account_id, aj.account_name, aj.entry_type;
$$;


-- --- START OF MIGRATION: 036_add_is_draft_billing_to_sales_orders.sql ---
-- Migration: Add is_draft_billing flag to sales_orders for staged billing flow
ALTER TABLE public.sales_orders
ADD COLUMN IF NOT EXISTS is_draft_billing BOOLEAN NOT NULL DEFAULT FALSE;


-- --- START OF MIGRATION: 037_rollback_draft_billing_status.sql ---
-- Migration: Roll back any active draft billing states to standard confirmed status
UPDATE public.sales_orders
SET is_draft_billing = false
WHERE is_draft_billing = true;


-- --- START OF MIGRATION: 038_create_roto_product_colors.sql ---
-- Migration 038: Create roto_product_colors table to link roto products to multiple color images

CREATE TABLE IF NOT EXISTS public.roto_product_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roto_product_id UUID NOT NULL REFERENCES public.roto_products(id) ON DELETE CASCADE,
    color_id UUID NOT NULL REFERENCES public.roto_colors(id) ON DELETE CASCADE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (roto_product_id, color_id)
);

-- Enable RLS for roto_product_colors
ALTER TABLE public.roto_product_colors ENABLE ROW LEVEL SECURITY;

-- Add policies
DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_product_colors" ON public.roto_product_colors;
CREATE POLICY "Allow read access to authenticated users on roto_product_colors" 
ON public.roto_product_colors FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write access to admins on roto_product_colors" ON public.roto_product_colors;
CREATE POLICY "Allow write access to admins on roto_product_colors" 
ON public.roto_product_colors FOR ALL TO authenticated 
USING (auth.uid() IN (
    SELECT u.id FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE r.name = 'admin'
));


-- --- START OF MIGRATION: 039_disable_auto_consumption.sql ---
-- Migration 039: Disable automatic consumption triggers on production entries
-- The status of source rolls will only change to 'consumed' when explicitly logged in the Consumption page.

CREATE OR REPLACE FUNCTION public.apply_roto_metallic_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source film rolls
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.apply_lamination_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source film rolls and fabric rolls
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.apply_offset_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source lamination rolls
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.apply_finishing_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source lamination rolls
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- --- START OF MIGRATION: 040_fix_select_policies.sql ---
-- Migration: Relax SELECT policies on all master tables and add plain text password storage to users profile

-- 1. Add password column to users profile
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;

-- 2. Relax SELECT policies on looms
DROP POLICY IF EXISTS "looms read permitted users" ON public.looms;
DROP POLICY IF EXISTS "masters read active users looms" ON public.looms;
CREATE POLICY "looms read authenticated" ON public.looms FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 3. Relax SELECT policies on fabric_types
DROP POLICY IF EXISTS "fabric types read permitted users" ON public.fabric_types;
DROP POLICY IF EXISTS "masters read active users fabric" ON public.fabric_types;
CREATE POLICY "fabric types read authenticated" ON public.fabric_types FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 4. Relax SELECT policies on raw_materials
DROP POLICY IF EXISTS "raw materials read permitted users" ON public.raw_materials;
DROP POLICY IF EXISTS "masters read active users raw" ON public.raw_materials;
CREATE POLICY "raw materials read authenticated" ON public.raw_materials FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 5. Relax SELECT policies on fabric_rolls
DROP POLICY IF EXISTS "rolls read permitted users" ON public.fabric_rolls;
DROP POLICY IF EXISTS "rolls read active users" ON public.fabric_rolls;
CREATE POLICY "rolls read authenticated" ON public.fabric_rolls FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 6. Relax SELECT policies on customers
DROP POLICY IF EXISTS "customers read permitted users" ON public.customers;
DROP POLICY IF EXISTS "masters read active users customers" ON public.customers;
CREATE POLICY "customers read authenticated" ON public.customers FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 7. Relax SELECT policies on loom_production_entries
DROP POLICY IF EXISTS "production read permitted users" ON public.loom_production_entries;
DROP POLICY IF EXISTS "production read active users" ON public.loom_production_entries;
CREATE POLICY "production read authenticated" ON public.loom_production_entries FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 8. Relax SELECT policies on sales_orders
DROP POLICY IF EXISTS "sales read permitted users" ON public.sales_orders;
DROP POLICY IF EXISTS "sales read active users" ON public.sales_orders;
CREATE POLICY "sales read authenticated" ON public.sales_orders FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 9. Relax SELECT policies on sales_order_items
DROP POLICY IF EXISTS "Allow read access to authenticated users on sales_order_items" ON public.sales_order_items;
CREATE POLICY "sales items read authenticated" ON public.sales_order_items FOR SELECT TO authenticated USING (true);

-- 10. Relax SELECT policies on roto_film_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on roto_film_rolls" ON public.roto_film_rolls;
CREATE POLICY "Allow read access to authenticated on roto_film_rolls" ON public.roto_film_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 11. Relax SELECT policies on roto_metallic_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on roto_metallic_rolls" ON public.roto_metallic_rolls;
CREATE POLICY "Allow read access to authenticated on roto_metallic_rolls" ON public.roto_metallic_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 12. Relax SELECT policies on lamination_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on lamination_rolls" ON public.lamination_rolls;
CREATE POLICY "Allow read access to authenticated on lamination_rolls" ON public.lamination_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 13. Relax SELECT policies on offset_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on offset_rolls" ON public.offset_rolls;
CREATE POLICY "Allow read access to authenticated on offset_rolls" ON public.offset_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 14. Relax SELECT policies on finishing_bundles
DROP POLICY IF EXISTS "Allow read access to permitted users on finishing_bundles" ON public.finishing_bundles;
CREATE POLICY "Allow read access to authenticated on finishing_bundles" ON public.finishing_bundles FOR SELECT TO authenticated USING (deleted_at IS NULL);


-- --- NEW SYSTEM PERMISSIONS ---
INSERT INTO public.permissions (module, action, description)
VALUES ('reports', 'filter_by_date', 'Filter by Date')
ON CONFLICT (module, action) DO NOTHING;

