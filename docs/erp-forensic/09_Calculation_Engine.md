# 09 Calculation Engine

## SQL Generated Columns

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:65)-80: `raw_material_purchases`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:145)-172: `loom_production_entries`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:192)-208: `sales_orders`

```sql
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
```

## Database RPC Functions

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:227)-232: `touch_updated_at`

```sql
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:237)-253: `current_role_name`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:255)-261: `is_admin`

```sql
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select public.current_role_name() = 'admin' $$;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:263)-269: `is_operator`

```sql
create or replace function public.is_operator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select public.current_role_name() = 'operator' $$;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:271)-276: `next_year_number`

```sql
create or replace function public.next_year_number(prefix text, table_name text, column_name text)
returns text
language plpgsql
as $$
declare
  yr text := to_char(current_date, 'YYYY');
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:293)-298: `prepare_production_entry`

```sql
create or replace function public.prepare_production_entry()
returns trigger
language plpgsql
as $$
declare
  last_end numeric(12,2);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:333)-338: `create_or_sync_fabric_roll`

```sql
create or replace function public.create_or_sync_fabric_roll()
returns trigger
language plpgsql
as $$
declare
  new_roll_number text;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:386)-396: `apply_raw_material_purchase`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:415)-421: `prepare_sales_order`

```sql
create or replace function public.prepare_sales_order()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number = public.next_year_number('ORD', 'sales_orders', 'order_number');
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:430)-439: `sync_rolls_for_sales_order`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:459)-464: `audit_row_change`

```sql
create or replace function public.audit_row_change()
returns trigger
language plpgsql
as $$
declare
  acting_user uuid := auth.uid();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:618)-625: `has_permission`

```sql
create or replace function public.has_permission(p_permission text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  has_perm boolean;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:771)-788: `can_manage_attendance_for`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:961)-966: `audit_role_permission_change`

```sql
create or replace function public.audit_role_permission_change()
returns trigger
language plpgsql
as $$
declare
  acting_user uuid := auth.uid();
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1007)-1012: `calculate_attendance`

```sql
create or replace function public.calculate_attendance()
returns trigger
language plpgsql
as $$
declare
  employee_shift_end time;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1071)-1076: `calculate_attendance`

```sql
create or replace function public.calculate_attendance()
returns trigger
language plpgsql
as $$
declare
  employee_shift_end time;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1177)-1182: `create_or_sync_fabric_roll`

```sql
create or replace function public.create_or_sync_fabric_roll()
returns trigger
language plpgsql
as $$
declare
  new_roll_number text;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1247)-1252: `prepare_production_entry`

```sql
create or replace function public.prepare_production_entry()
returns trigger
language plpgsql
as $$
declare
  last_end numeric(12,2);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1456)-1487: `create_or_sync_fabric_roll`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1527)-1532: `prepare_production_entry`

```sql
CREATE OR REPLACE FUNCTION public.prepare_production_entry()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  last_end numeric(12,2);
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1630)-1645: `get_last_end_meters_by_loom`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1648)-1691: `get_roll_allocations_for_fabric`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1696)-1716: `get_dashboard_summary`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1719)-1739: `get_daily_fabric_output`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1742)-1766: `get_fabric_stock_summary`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1817)-1827: `apply_raw_material_purchase`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1901)-1911: `apply_raw_material_consumption`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:1990)-2000: `apply_stage_production`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2323)-2334: `apply_material_sales_stock`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2646)-2653: `apply_roto_metallic_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_roto_metallic_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_split = FALSE THEN
      UPDATE public.roto_film_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_film_roll_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2671)-2678: `apply_lamination_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_lamination_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Fabric roll is always consumed
    UPDATE public.fabric_rolls
    SET status = 'consumed', current_stage = 'lamination', updated_at = now()
    WHERE id = NEW.fabric_roll_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2708)-2715: `apply_offset_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_offset_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.offset_type = 'FABRIC' AND NEW.source_fabric_roll_id IS NOT NULL THEN
      UPDATE public.fabric_rolls
      SET status = 'consumed', current_stage = 'offset_printing', updated_at = now()
      WHERE id = NEW.source_fabric_roll_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2743)-2750: `apply_finishing_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_finishing_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.finish_type = 'LAMINATED' AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2802)-2810: `apply_lamination_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_lamination_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Film roll is consumed if present
    IF NEW.film_roll_id IS NOT NULL THEN
      UPDATE public.roto_metallic_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.film_roll_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2824)-2831: `apply_offset_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_offset_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.offset_type IN ('NW_LAM', 'PLAIN_LAM') AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2845)-2852: `apply_finishing_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_finishing_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.finish_type = 'LAMINATED' AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2911)-2937: `get_next_serial_numbers`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2947)-2952: `next_year_number`

```sql
CREATE OR REPLACE FUNCTION public.next_year_number(prefix text, table_name text, column_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  yr text := to_char(current_date, 'YYYY');
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:2979)-2986: `get_next_journal_no`

```sql
CREATE OR REPLACE FUNCTION public.get_next_journal_no()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  max_no text;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3007)-3022: `get_opening_balance`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3026)-3045: `get_accounts_journal_summary_by_date`

```sql
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
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3096)-3100: `apply_roto_metallic_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_roto_metallic_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source film rolls
  RETURN NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3104)-3108: `apply_lamination_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_lamination_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source film rolls and fabric rolls
  RETURN NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3112)-3116: `apply_offset_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_offset_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source lamination rolls
  RETURN NULL;
```

- [supabase/migrations/001_initial_schema.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/001_initial_schema.sql:3120)-3124: `apply_finishing_consumption`

```sql
CREATE OR REPLACE FUNCTION public.apply_finishing_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source lamination rolls
  RETURN NULL;
```

- [supabase/migrations/006_generate_order_dispatch_numbers_rpc.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/006_generate_order_dispatch_numbers_rpc.sql:4)-9: `get_next_order_no`

```sql
CREATE OR REPLACE FUNCTION public.get_next_order_no(p_order_date text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_mm_dd text;
```

- [supabase/migrations/006_generate_order_dispatch_numbers_rpc.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/006_generate_order_dispatch_numbers_rpc.sql:38)-43: `get_next_dispatch_no`

```sql
CREATE OR REPLACE FUNCTION public.get_next_dispatch_no(p_delivery_date text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_mm_dd text;
```

- [supabase/migrations/009_fix_rbac_and_initial_meters.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/009_fix_rbac_and_initial_meters.sql:4)-9: `prepare_production_entry`

```sql
CREATE OR REPLACE FUNCTION public.prepare_production_entry()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  last_end numeric(12,2);
```

- [supabase/migrations/045_client_portal_setup.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/045_client_portal_setup.sql:25)-42: `is_internal_staff`

```sql
CREATE OR REPLACE FUNCTION public.is_internal_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u
    JOIN public.roles r ON r.id = u.role_id
    WHERE u.id = auth.uid()
      AND r.name != 'client'
      AND u.status = 'active'
      AND u.deleted_at IS NULL
      AND r.is_active = true
      AND r.deleted_at IS NULL
  )
$$;
```

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:32)-34: `touch_client_orders_updated_at`

```sql
CREATE OR REPLACE FUNCTION public.touch_client_orders_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
```

- [supabase/migrations/047_client_orders.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/047_client_orders.sql:64)-71: `next_client_order_no`

```sql
CREATE OR REPLACE FUNCTION public.next_client_order_no()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year  TEXT := to_char(now() AT TIME ZONE 'Asia/Kolkata', 'YY');
```

- [supabase/migrations/052_fix_get_opening_balance.sql](C:/Users/spsch/Downloads/ERP-main/ERP-main/supabase/migrations/052_fix_get_opening_balance.sql:3)-13: `get_opening_balance`

```sql
CREATE OR REPLACE FUNCTION public.get_opening_balance(p_account_id uuid, p_from_date date)
RETURNS TABLE (
  total_debit numeric,
  total_credit numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_customer_name text;
```

## Admin

- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:63): `function hoursBetween(start: string | null | undefined, end: string | null | undefined) {`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:65): `const hours = Math.max((new Date(end).getTime() - new Date(start).getTime()) / 36e5, 0);`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:66): `return Math.round(hours * 100) / 100;`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:69): `function overtimeHours(row: any) {`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:83): `const hours = hoursBetween(start, end);`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:84): `if (hours < 4) return "half_day";`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:138): `<PageHeader title="Attendance" description="Use server-time check in and check out. Status and hours are calculated automatically." />`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:167): `<div className="text-sm text-muted-foreground">{employee.name}</div>`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:208): `<TableHead>Hours</TableHead>`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:209): `<TableHead>Overtime</TableHead>`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:224): `<TableCell>{formatNumber(checkIn && checkOut ? hoursBetween(checkIn, checkOut) : 0, 2)}</TableCell>`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:225): `<TableCell>{formatNumber(overtimeHours(row), 2)}</TableCell>`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:68): `// Add production default fields`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:19): `.select("id, customer_name, alias, phone, gst_number, address, status, opening_debit, opening_credit")`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:35): `const totalOrders = allOrders.length;`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:37): `const totalBilled = billedOrders.reduce((s: number, o: any) => s + Number(o.bill_value ?? 0), 0);`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:60): `<div className="border border-slate-200 rounded-xl p-6 bg-white">`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:63): `<div className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:75): `{customer.gst_number && (`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:77): `<FileText className="h-3 w-3" /> GST: {customer.gst_number}`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:88): `<span className={\`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:101): `{ label: "Total Orders", value: totalOrders.toString(), sub: "all time" },`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:102): `{ label: "Total Billed", value: \`₹${formatNumber(totalBilled, 0)}\`, sub: \`${billedOrders.length} billed orders\` },`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:105): `<div key={card.label} className="border border-slate-200 rounded-xl p-5 bg-white">`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:114): `<div className="border border-slate-200 rounded-xl bg-white overflow-hidden">`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:118): `<p className="text-[11px] text-slate-400 mt-0.5">{totalOrders} orders, total billed ₹{formatNumber(totalBilled, 0)}</p>`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:147): `<span className={\`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:165): `{/* Grand total row */}`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:168): `<td colSpan={4} className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Grand Total</td>`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:170): `₹{formatNumber(totalBilled, 0)}`
- [src/app/(app)/admin/clients/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/page.tsx:45): `select: "id, customer_name, linked_customer_id, phone, gst_number, address, is_internal, status",`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:27): `.select("id, material_name, unit, department, critical_level, current_stock, status")`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:35): `<div className="p-6 max-w-lg mx-auto bg-red-50 border border-red-200 rounded-lg text-red-800 space-y-3 mt-10 shadow-sm">`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:38): `Failed to fetch raw materials. This typically indicates that your production database schema is out of sync or migrations (specifically \`011_custom_legacy_schema.sql\`) have not been pushed to production.`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:40): `<div className="text-xs bg-red-100 p-4 rounded-md border font-mono overflow-x-auto">`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:43): `<p className="text-xs text-muted-foreground">`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:62): `<PageHeader title="Raw Material Critical Levels" description="Configure inventory warning thresholds per production department." />`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:86): `<TableHead>Current Stock</TableHead>`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:94): `const currentStockVal = Number(material.current_stock ?? 0);`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:96): `const isLowStock = currentStockVal <= criticalLevelVal;`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:101): `<TableCell>{formatNumber(material.current_stock, 2)}</TableCell>`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:104): `{isLowStock ? (`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:105): `<span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-400">`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:106): `LOW STOCK`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:109): `<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:128): `confirmTitle="Update Stock Warning Threshold?"`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:60): `className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:79): `totalPermissionsCount={permissionRows.length}`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:22): `const totalPermissions = permissionRows.length;`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:49): `const pct = totalPermissions > 0 ? Math.round((assignedCount / totalPermissions) * 100) : 0;`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:57): `<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:62): `<div className="truncate text-xs text-muted-foreground mt-0.5">`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:69): `<ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:75): `<div className="flex items-center justify-between text-xs text-muted-foreground">`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:77): `<span>{assignedCount}/{totalPermissions}</span>`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:79): `<div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:81): `className="h-full rounded-full bg-primary transition-all"`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:80): `"roundoff", "round off", "bank charges", "equitas", "cgst", "sgst",`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:81): `"igst", "gst", "tds", "tcs", "capital", "drawings", "depreciation",`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:82): `"opening balance", "ca", "cc"`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:112): `"roundoff", "round off", "bank charges", "equitas", "cgst", "sgst",`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:113): `"igst", "gst", "tds", "tcs", "capital", "drawings", "depreciation",`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:114): `"opening balance", "ca", "cc"`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:132): `"px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors",`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:134): `? "border-primary text-primary bg-background"`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:135): `: "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"`

## Accounts

- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:7): `export async function saveAccountOpeningBalance(formData: FormData) {`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:8): `const user = await requireAnyPermission(["customers.edit", "reports.opening_balance"]);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:10): `const openingDebit = Number(formData.get("opening_debit") ?? 0);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:11): `const openingCredit = Number(formData.get("opening_credit") ?? 0);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:16): `if (openingDebit < 0 || openingCredit < 0) {`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:17): `throw new Error("Opening values cannot be negative.");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:24): `opening_debit: openingDebit,`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:25): `opening_credit: openingCredit,`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:34): `revalidatePath("/reports/opening-balance");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:49): `"raw_material_consumptions",`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:53): `"stage_production_entries",`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:75): `// 3. Reset raw materials stock level back to opening_stock`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:78): `.select("id, opening_stock")`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:88): `.update({ current_stock: rm.opening_stock, updated_by: user.id })`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:92): `throw new Error(\`Failed to reset raw material stock for ${rm.id}: ${rmResetErr.message}\`);`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:126): `revalidatePath("/fabric/stock");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:129): `revalidatePath("/accounts/consumption");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:131): `revalidatePath("/reports/stock");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:132): `revalidatePath("/reports/closing-stock");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:137): `export async function saveClosingStock(`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:140): `baseTotal: number,`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:141): `wipAmount: number,`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:142): `gstAmount: number,`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:143): `grandTotal: number`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:148): `const key = \`closing_stock_${date}\`;`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:151): `baseTotal,`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:152): `wipAmount,`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:153): `gstAmount,`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:154): `grandTotal,`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:180): `revalidatePath("/reports/closing-stock");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:182): `revalidatePath("/reports/balance-sheet");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:225): `revalidatePath("/reports/balance-sheet");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:23): `debit: number;`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:24): `credit: number;`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:33): `// Validate totals and rows`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:34): `let totalDebit = 0;`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:35): `let totalCredit = 0;`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:38): `if (r.debit > 0 && r.credit > 0) throw new Error("A row cannot contain both Debit and Credit.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:39): `if (r.debit <= 0 && r.credit <= 0) throw new Error("Either Debit or Credit must be entered on all rows.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:40): `if (r.debit > 0) {`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:41): `if (r.debit <= 0) throw new Error("Amount must be positive.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:42): `totalDebit += r.debit;`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:44): `if (r.credit > 0) {`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:45): `if (r.credit <= 0) throw new Error("Amount must be positive.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:46): `totalCredit += r.credit;`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:50): `if (Math.abs(totalDebit - totalCredit) > 0.01) {`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:51): `throw new Error("Total Debit must be equal to Total Credit before submitting.");`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:89): `entry_type: r.debit > 0 ? "debit" : "credit",`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:90): `amount: r.debit > 0 ? r.debit : r.credit,`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:127): `// Fetch journal lines to verify they are not auto-generated`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:135): `const isAutoGenerated = (desc: string) => {`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:139): `d.startsWith("balance adjustment for bill") ||`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:146): `if ((lines || []).some((l: any) => isAutoGenerated(l.description))) {`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:147): `throw new Error("Cannot delete auto-generated journal entries.");`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:19): `entry_type: "debit" | "credit";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:20): `amount: string | number;`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:24): `function isAutoGenerated(description: string | null): boolean {`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:27): `if (/^Balance\s+adjustment/i.test(desc)) return true;`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:58): `.select("id, customer_name, alias, gst_number")`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:90): `// 3. Generate next Journal Number`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:99): `total: number;`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:103): `entry_type: "debit" | "credit";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:104): `amount: number;`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:116): `total: 0,`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:124): `amount: Number(row.amount),`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:127): `if (row.entry_type === "debit") {`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:128): `groupedJE[key].total += Number(row.amount);`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:133): `const totalDebit = rows.filter(r => r.entry_type === "debit").reduce((sum, r) => sum + Number(r.amount), 0);`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:134): `const totalCredit = rows.filter(r => r.entry_type === "credit").reduce((sum, r) => sum + Number(r.amount), 0);`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:140): `description="Record and view double-entry accounting journal entries (debits and credits)."`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:160): `<span className="text-sm font-normal text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:161): `Debits: ₹{formatNumber(totalDebit, 2)} | Credits: ₹{formatNumber(totalCredit, 2)}`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:178): `<TableHead className="text-right w-[150px]">Amount (₹)</TableHead>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:191): `<span className={line.entry_type === "credit" ? "pl-6 text-slate-500" : "font-semibold text-slate-800"}>`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:194): `<span className="text-xs text-muted-foreground ml-2 block sm:inline">`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:198): `<span className="text-xs font-mono font-bold text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded bg-slate-50">`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:199): `{line.entry_type === "debit" ? "Dr" : "Cr"}`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:209): `₹{formatNumber(line.amount, 2)}`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:219): `className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-8 px-3 border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 shadow-sm"`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:227): `desc.startsWith("balance adjustment for bill") ||`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:30): `.select("id, material_name, department, unit, current_stock")`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:43): `quantity,`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:45): `inc_gst,`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:46): `amount,`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:73): `"roundoff",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:74): `"round off",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:77): `"cgst",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:78): `"sgst",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:79): `"igst",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:80): `"gst",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:86): `"opening balance",`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:104): `description="Record raw material or waste sales directly into ledger accounts."`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:23): `// Fetch Catalogs + Available stock rolls for linkage + Colors list for Roto specs`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:72): `.select("id, roll_number, weight, meters, fabric_type_id")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:78): `.select("id, roll_id, s_no, weight_kg, meters, fabric_type_id")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:84): `.select("id, roll_id, s_no, weight_kg, fabric_type_id")`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:91): `id, purchase_date, supplier_name, bill_number, total_amount, remarks,`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:92): `product_purchase_items(id, department, quantity, weight, rate, amount, created_stock_id, supplier_roll_id)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:102): `// Map created stock IDs to their generated roll_id / roll_number for user visibility`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:103): `const stockIdsByDept: Record<string, string[]> = {`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:113): `if (item.created_stock_id) {`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:114): `stockIdsByDept[item.department]?.push(item.created_stock_id);`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:126): `stockIdsByDept.fabric.length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:127): `? supabase.from("fabric_rolls").select("id, roll_number").in("id", stockIdsByDept.fabric)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:129): `stockIdsByDept.lamination.length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:130): `? supabase.from("lamination_rolls").select("id, roll_id").in("id", stockIdsByDept.lamination)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:132): `stockIdsByDept["offset-printing"].length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:133): `? supabase.from("offset_rolls").select("id, roll_id").in("id", stockIdsByDept["offset-printing"])`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:135): `stockIdsByDept["roto-printing"].length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:136): `? supabase.from("roto_film_rolls").select("id, roll_id").in("id", stockIdsByDept["roto-printing"])`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:138): `stockIdsByDept["roto-printing"].length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:139): `? supabase.from("roto_metallic_rolls").select("id, roll_id").in("id", stockIdsByDept["roto-printing"])`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:141): `stockIdsByDept.finishing.length > 0`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:142): `? supabase.from("finishing_bundles").select("id, bundle_id").in("id", stockIdsByDept.finishing)`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:146): `const stockMap = new Map<string, string>();`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:147): `(dbFabricRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_number));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:148): `(dbLamRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:149): `(dbOffsetRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:150): `(dbFilmRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:151): `(dbMetallicRolls || []).forEach((r: any) => stockMap.set(r.id, r.roll_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:152): `(dbFinishBundles || []).forEach((r: any) => stockMap.set(r.id, r.bundle_id));`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:158): `description="Record finished product purchases from external suppliers to stock and accounting journals."`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:180): `<div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-100 shadow-sm">`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:202): `<TableHead className="text-right">Total Amount (₹)</TableHead>`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:217): `const generatedId = item.created_stock_id ? stockMap.get(item.created_stock_id) : null;`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:221): `<span className="capitalize px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600">`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:225): `{formatNumber(item.quantity, 0)} {item.department === "finishing" ? "bags" : "mtrs"} / {formatNumber(item.weight, 1)} kg`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:229): `{generatedId && <span>Stock ID: <strong className="text-slate-700 font-semibold">{generatedId}</strong></span>}`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:237): `₹{formatNumber(row.total_amount, 2)}`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:14): `const match = remarks?.match(/\[TOTAL_BILL_VALUE:([0-9]+(?:\.[0-9]+)?)\]/);`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:45): `.select("id, purchase_date, supplier_name, bill_number, quantity, rate, total_amount, remarks, raw_materials(material_name, unit, department)")`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:68): `"roundoff",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:69): `"round off",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:72): `"cgst",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:73): `"sgst",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:74): `"igst",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:75): `"gst",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:81): `"opening balance",`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:99): `description="Accounting purchase entry and ledger updates."`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:134): `<TableHead>Rate</TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:135): `<TableHead>Total</TableHead>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:154): `{formatNumber(purchase.quantity, 0)} {purchase.raw_materials?.unit ?? ""}`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:156): `<TableCell>{"₹"}{formatNumber(purchase.rate, 2)}</TableCell>`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:157): `<TableCell>{"₹"}{formatNumber(getEnteredBillValue(purchase.remarks, purchase.total_amount), 2)}</TableCell>`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:34): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids, fabric_type_id, lamination_type, offset_type, film_type, is_metallic, roto_product_id, offset_product_id)")`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:40): `.select("id, order_number, order_date, bill_number, bill_value, customers(customer_name), sales_order_items(id, department, product_id, quantity, selected_roll_ids, fabric_type_id, lamination_type, offset_type, film_type, is_metallic, roto_product_id, offset_product_id)")`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:86): `Promise.all(chunks.map(chunk => supabase.from("fabric_rolls").select("id, roll_number, meters, weight, fabric_type_id, loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:87): `Promise.all(chunks.map(chunk => supabase.from("lamination_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:88): `Promise.all(chunks.map(chunk => supabase.from("offset_rolls").select("id, roll_id, meters, weight_kg").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:89): `Promise.all(chunks.map(chunk => supabase.from("finishing_bundles").select("id, bundle_id, num_bags, weight_kg").in("id", chunk).is("deleted_at", null))),`

_… 16 additional calculation lines in source._

## Sales

- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:10): `quantity: number;`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:14): `// Custom production fields`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:32): `if (item.quantity <= 0 || isNaN(item.quantity)) throw new Error("Quantity must be greater than zero.");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:48): `// Generate order number`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:73): `quantity: item.quantity,`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:77): `// Production fields`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:119): `// 2. Generate ERP Order Number`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:149): `quantity: Number(item.quantity),`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:9): `quantity: number;`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:34): `if (item.quantity <= 0 || isNaN(item.quantity)) {`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:35): `throw new Error("Quantity must be greater than zero.");`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:41): `// 1. Generate Order Number using RPC`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:71): `quantity: item.quantity,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:11): `generateNextJournalNo,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:22): `...readPayload(formData, ["customer_id", "fabric_type_id", "quantity_meters", "rate", "status"]),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:103): `quantity: Number(item.quantity),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:179): `revalidatePath("/fabric/stock");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:203): `// Retrieve roll weights from their respective tables`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:211): `const { data, error } = await (supabase.from("fabric_rolls") as any).select("id, weight").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:213): `for (const r of data || []) rollsData[r.id] = Number(r.weight || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:215): `const { data, error } = await (supabase.from("lamination_rolls") as any).select("id, weight_kg").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:217): `for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:219): `const { data, error } = await (supabase.from("offset_rolls") as any).select("id, weight_kg").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:221): `for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:223): `const { data, error } = await (supabase.from("finishing_bundles") as any).select("id, weight_kg, num_bags").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:226): `rollsData[r.id] = Number(r.weight_kg || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:231): `const { data, error } = await (supabase.from(table) as any).select("id, weight_kg").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:233): `for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:240): `quantity: number;`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:270): `if (deliveredQty < item.quantity) {`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:272): `const remainingQty = item.quantity - deliveredQty;`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:278): `quantity: deliveredQty,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:287): `quantity: remainingQty,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:306): `quantity: item.quantity,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:322): `quantity: deliveredQty,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:340): `quantity: deliveredQty,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:387): `quantity: bo.quantity,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:421): `revalidatePath("/fabric/stock");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:446): `quantity,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:455): `gst_rate,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:491): `.select("id, department, product_id, quantity, price, selected_roll_ids")`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:503): `// order_number intentionally omitted — DB trigger auto-generates a unique number`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:509): `gst_rate: parentOrder.gst_rate,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:564): `throw new Error("Bill Value must be a non-negative amount.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:578): `gst_rate,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:624): `const journalNo = await generateNextJournalNo(supabase);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:631): `entry_type: "debit",`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:632): `amount: billValue,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:642): `entry_type: "credit",`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:643): `amount: billValue,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:769): `revalidatePath("/fabric/stock");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:773): `export async function saveSalesConfirmationRates(`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:776): `gstRate: number`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:797): `.update({ gst_rate: gstRate, updated_by: user.id } as any)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:838): `supabase.from("fabric_rolls").select("id, weight").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:839): `supabase.from("lamination_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:840): `supabase.from("offset_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:841): `supabase.from("finishing_bundles").select("id, weight_kg, num_bags").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:842): `supabase.from("roto_film_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null),`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:843): `supabase.from("roto_metallic_rolls").select("id, weight_kg").in("id", allRollIds).is("deleted_at", null)`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:846): `(fabricRes.data || []).forEach((r: any) => { rollsData[r.id] = Number(r.weight || 0); });`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:847): `(lamRes.data || []).forEach((r: any) => { rollsData[r.id] = Number(r.weight_kg || 0); });`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:848): `(offsetRes.data || []).forEach((r: any) => { rollsData[r.id] = Number(r.weight_kg || 0); });`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:850): `rollsData[r.id] = Number(r.weight_kg || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:853): `(rotoFilmRes.data || []).forEach((r: any) => { rollsData[r.id] = Number(r.weight_kg || 0); });`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:854): `(rotoMetRes.data || []).forEach((r: any) => { rollsData[r.id] = Number(r.weight_kg || 0); });`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:857): `let baseTotal = 0;`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:870): `qty = Number(item.quantity || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:873): `baseTotal += qty * price;`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:876): `const calculatedTotal = baseTotal + (baseTotal * gstRate / 100);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:878): `const balance = calculatedTotal - combinedBillValue;`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:883): `.or(\`description.eq."Balance adjustment for Dispatch ${order.order_number}",description.like."Balance adjustment for Dispatch ${order.order_number} (%)"\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:885): `if (Math.abs(balance) > 100) {`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:896): `const journalNo = await generateNextJournalNo(supabase);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:898): `const absBalance = Math.abs(balance);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:900): `if (balance > 100) {`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:906): `entry_type: "debit",`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:907): `amount: absBalance,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:908): `description: \`Balance adjustment for Dispatch ${order.order_number}\`,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:917): `entry_type: "credit",`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:918): `amount: absBalance,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:919): `description: \`Balance adjustment for Dispatch ${order.order_number} (${customerName})\`,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:929): `entry_type: "debit",`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:930): `amount: absBalance,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:931): `description: \`Balance adjustment for Dispatch ${order.order_number} (${customerName})\`,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:940): `entry_type: "credit",`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:941): `amount: absBalance,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:942): `description: \`Balance adjustment for Dispatch ${order.order_number}\`,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:964): `const quantity = Number(formData.get("quantity") ?? 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:966): `const inc_gst = formData.get("inc_gst") === "true";`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:983): `if (quantity <= 0 || price <= 0) {`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:984): `throw new Error("Quantity and price must be greater than zero.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:987): `const baseAmount = quantity * price;`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:988): `const amount = inc_gst ? baseAmount : baseAmount * 1.18;`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:995): `.select("current_stock, material_name")`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1001): `const currentStock = Number(rmData.current_stock ?? 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1002): `if (quantity > currentStock) {`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1003): `throw new Error(\`Cannot sell ${quantity}. Only ${currentStock} is available in stock.\`);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1031): `const journalNo = await generateNextJournalNo(supabase);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1039): `entry_type: "debit",`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1040): `amount: amount,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1041): `description: \`Bill ${bill_number} (${type === "raw_material" ? "Raw Material" : "Waste"})\`,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1050): `entry_type: "credit",`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1051): `amount: amount,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1070): `quantity,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1072): `inc_gst,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1073): `amount,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1120): `async function generateNextDispatchNumber(supabase: any, deliveryDate: string): Promise<string> {`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1168): `quantity,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1184): `gst_rate,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1199): `const gstRate = selectedItems[0]?.sales_orders?.gst_rate ?? 18;`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1203): `// Retrieve roll weights from their respective tables`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1211): `const { data, error } = await (supabase.from("fabric_rolls") as any).select("id, weight").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1213): `for (const r of data || []) rollsData[r.id] = Number(r.weight || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1215): `const { data, error } = await (supabase.from("lamination_rolls") as any).select("id, weight_kg").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1217): `for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1219): `const { data, error } = await (supabase.from("offset_rolls") as any).select("id, weight_kg").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1221): `for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1223): `const { data, error } = await (supabase.from("finishing_bundles") as any).select("id, weight_kg, num_bags").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1226): `rollsData[r.id] = Number(r.weight_kg || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1231): `const { data, error } = await (supabase.from(table) as any).select("id, weight_kg").in("id", newRollIds);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1233): `for (const r of data || []) rollsData[r.id] = Number(r.weight_kg || 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1248): `const dispatchOrderNumber = await generateNextDispatchNumber(supabase, dateStr);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1258): `gst_rate: gstRate,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1291): `if (deliveredQty < item.quantity) {`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1293): `const remainingQty = item.quantity - deliveredQty;`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1300): `quantity: deliveredQty,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1311): `quantity: remainingQty,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1333): `quantity: deliveredQty,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1351): `quantity: deliveredQty,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1404): `revalidatePath("/fabric/stock");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1422): `throw new Error("Bill Value must be a non-negative amount.");`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1436): `gst_rate,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1437): `total_amount,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1487): `const journalNo = await generateNextJournalNo(supabase);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1494): `entry_type: "debit",`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1495): `amount: billValue,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1505): `entry_type: "credit",`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1506): `amount: billValue,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1516): `// Adjustment for linked/reference accounts if balance is > +/- 100`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1518): `const calculatedTotalAmount = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1519): `const balance = billValue - calculatedTotalAmount;`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1522): `if (linkedCustomerId && Math.abs(balance) > 100) {`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1533): `adjJournalNo = await generateNextJournalNo(supabase);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1534): `const adjAmount = Math.abs(balance);`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1539): `account_id: balance > 0 ? parent.id : salesAc?.id ?? null,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1540): `account_name: balance > 0 ? parent.customer_name : salesAc?.customer_name ?? "Sales A/c",`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1541): `entry_type: "debit" as const,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1542): `amount: adjAmount,`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1543): `description: \`Adjustment for Bill ${billNumber} (Calculated: ${calculatedTotalAmount.toFixed(2)}, Actual: ${billValue.toFixed(2)})\`,`

_… 66 additional calculation lines in source._

## Inventory

- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:6): `import { generateNextJournalNo } from "./helpers";`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:16): `const totalBillValue = Number(formData.get("total_bill_value") ?? 0);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:24): `const quantities = formData.getAll("quantity").map(Number);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:25): `const weights = formData.getAll("weight").map(Number);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:26): `const rates = formData.getAll("rate").map(Number);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:38): `if (!Number.isFinite(totalBillValue) || totalBillValue <= 0) {`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:39): `throw new Error("Total bill value must be a positive amount.");`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:54): `total_amount: totalBillValue,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:68): `// 2. Process and insert each item into history and stock registers`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:69): `const createdStockRecords: { table: string; id: string }[] = [];`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:79): `const weight = weights[i] || 0;`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:80): `const rate = rates[i] || 0;`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:82): `// Direct bill value rate (no qty/weight multiplication)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:83): `const amount = rate;`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:92): `let createdStockId: string | null = null;`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:101): `// --- Insert into appropriate Stock Registers ---`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:111): `const { data: stockItem, error: stockErr } = await (adminSupabase`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:115): `production_entry_id: null,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:118): `weight: weight,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:119): `meters: qty,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:120): `production_date: purchase_date,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:130): `if (stockErr) throw new Error(\`Fabric roll stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:131): `createdStockId = stockItem.id;`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:132): `createdStockRecords.push({ table: "fabric_rolls", id: stockItem.id });`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:170): `const { data: stockItem, error: stockErr } = await (adminSupabase`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:178): `weight_kg: weight,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:179): `meters: qty,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:189): `if (stockErr) throw new Error(\`Roto film roll stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:190): `createdStockId = stockItem.id;`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:191): `createdStockRecords.push({ table: "roto_film_rolls", id: stockItem.id });`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:202): `weight_kg: weight,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:203): `meters: qty,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:213): `if (filmErr || !filmRoll) throw new Error(\`Roto dummy film roll stock insert failed: ${filmErr?.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:214): `createdStockRecords.push({ table: "roto_film_rolls", id: filmRoll.id });`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:218): `const { data: stockItem, error: stockErr } = await (adminSupabase`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:225): `weight_kg: weight,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:226): `meters: qty,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:236): `if (stockErr) throw new Error(\`Roto metallic roll stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:237): `createdStockId = stockItem.id;`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:238): `createdStockRecords.push({ table: "roto_metallic_rolls", id: stockItem.id });`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:292): `const { data: stockItem, error: stockErr } = await (adminSupabase`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:302): `weight_kg: weight,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:303): `meters: qty,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:313): `if (stockErr) throw new Error(\`Lamination roll stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:314): `createdStockId = stockItem.id;`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:315): `createdStockRecords.push({ table: "lamination_rolls", id: stockItem.id });`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:355): `const { data: stockItem, error: stockErr } = await (adminSupabase`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:364): `weight_kg: weight,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:374): `if (stockErr) throw new Error(\`Offset roll stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:375): `createdStockId = stockItem.id;`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:376): `createdStockRecords.push({ table: "offset_rolls", id: stockItem.id });`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:419): `const { data: stockItem, error: stockErr } = await (adminSupabase`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:431): `weight_kg: weight,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:441): `if (stockErr) throw new Error(\`Finishing bundle stock insert failed: ${stockErr.message}\`);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:442): `createdStockId = stockItem.id;`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:443): `createdStockRecords.push({ table: "finishing_bundles", id: stockItem.id });`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:468): `quantity: qty,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:469): `weight: weight,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:470): `rate: rate,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:471): `amount: amount,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:472): `created_stock_id: createdStockId,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:485): `// Self-healing rollback: Delete any stock records created in this failed purchase`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:486): `for (const rec of createdStockRecords) {`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:494): `// 3. Auto-generate accounting journal entries`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:503): `const journalNo = await generateNextJournalNo(adminSupabase);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:510): `entry_type: "debit",`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:511): `amount: totalBillValue,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:521): `entry_type: "credit",`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:522): `amount: totalBillValue,`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:563): `.select("department, created_stock_id, source_roll_id, lamination_type")`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:566): `// 2. Revert source rolls to 'available' & Delete created stock items in parallel`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:587): `if (!item.created_stock_id) continue;`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:590): `promises.push((adminSupabase.from("fabric_rolls") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:592): `promises.push((adminSupabase.from("lamination_rolls") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:594): `promises.push((adminSupabase.from("offset_rolls") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:596): `promises.push((adminSupabase.from("finishing_bundles") as any).delete().eq("id", item.created_stock_id));`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:603): `.eq("id", item.created_stock_id)`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:607): `await adminSupabase.from("roto_metallic_rolls").delete().eq("id", item.created_stock_id);`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:612): `await adminSupabase.from("roto_film_rolls").delete().eq("id", item.created_stock_id);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:6): `import { generateNextJournalNo, todayInIndia } from "./helpers";`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:18): `const quantities = formData.getAll("quantity").map(Number);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:19): `const rates = formData.getAll("rate").map(Number);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:20): `const totalBillValue = Number(formData.get("total_bill_value") ?? 0);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:25): `if (!Number.isFinite(totalBillValue) || totalBillValue <= 0) {`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:26): `throw new Error("Total bill value must be a positive amount.");`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:31): `if (raw_material_ids.some((id) => !id) || quantities.some((qty) => qty <= 0) || rates.some((rate) => rate <= 0)) {`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:32): `throw new Error("Every purchase item must have a material, positive quantity, and positive rate.");`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:35): `const finalRemarks = \`[TOTAL_BILL_VALUE:${totalBillValue.toFixed(2)}] ${remarks}\`.trim();`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:40): `const rt = rates[index] ?? 0;`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:46): `quantity: qty,`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:47): `rate: rt,`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:48): `total_amount: totalBillValue,`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:61): `// Auto-generate journal entries for purchase`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:70): `const journalNo = await generateNextJournalNo(supabase);`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:77): `entry_type: "debit",`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:78): `amount: totalBillValue,`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:88): `entry_type: "credit",`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:89): `amount: totalBillValue,`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:126): `// 1. Soft-delete first to trigger the plpgsql stock updates trigger (apply_raw_material_purchase)`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:142): `// Delete auto-generated journal entries using the unique RM:UUID tag (safe, no bill-number collisions)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:27): `export async function saveRawMaterialConsumption(formData: FormData) {`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:30): `fabric: "fabric.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:31): `roto_printing: "roto_printing.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:32): `lamination: "lamination.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:33): `offset_printing: "offset_printing.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:34): `finishing: "finishing.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:36): `const permission = permissionMap[department] || "fabric.consumption";`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:41): `const quantity = Number(formData.get("quantity") ?? 0);`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:42): `const consumptionDate = String(formData.get("consumption_date") ?? "");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:45): `if (!rawMaterialId || !department || quantity <= 0 || !consumptionDate) {`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:46): `throw new Error("Missing required consumption fields or invalid quantity.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:48): `if (quantity % 25 !== 0) {`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:49): `throw new Error("Quantity must be a multiple of 25.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:56): `quantity,`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:57): `consumption_date: consumptionDate,`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:63): `? (supabase.from("raw_material_consumptions") as any).update(payload).eq("id", id)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:64): `: (supabase.from("raw_material_consumptions") as any).insert({ ...payload, created_by: user.id });`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:69): `revalidatePath("/fabric/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:70): `revalidatePath("/roto-printing/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:71): `revalidatePath("/lamination/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:72): `revalidatePath("/offset-printing/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:73): `revalidatePath("/finishing/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79): `export async function softDeleteRawMaterialConsumption(formData: FormData) {`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:81): `if (!id) throw new Error("Consumption ID is required.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:83): `await requirePermission("fabric.consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:88): `.from("raw_material_consumptions") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:89): `.select("department, consumption_date")`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:94): `throw new Error("Consumption log not found.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:99): `fabric: "fabric.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:100): `roto_printing: "roto_printing.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:101): `lamination: "lamination.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:102): `offset_printing: "offset_printing.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:103): `finishing: "finishing.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:105): `const permission = permissionMap[department] || "fabric.consumption";`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:108): `if (entry.consumption_date !== todayInIndia()) {`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:109): `throw new Error("You can only delete consumption logs on the day they are created.");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:113): `.from("raw_material_consumptions") as any)`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:120): `revalidatePath("/fabric/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:121): `revalidatePath("/roto-printing/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:122): `revalidatePath("/lamination/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:123): `revalidatePath("/offset-printing/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:124): `revalidatePath("/finishing/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:132): `lamination: "lamination.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:133): `offset: "offset_printing.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:134): `finishing: "finishing.consumption",`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:136): `const permission = permissionMap[stage] || "fabric.consumption";`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:147): `revalidatePath("/fabric/stock");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:148): `revalidatePath("/lamination/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:149): `revalidatePath("/offset-printing/consumption");`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:150): `revalidatePath("/finishing/consumption");`

_… 751 additional calculation lines in source._

## Production

- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:9): `productionSchema,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:14): `export async function saveProduction(formData: FormData) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:16): `const user = await requirePermission("fabric.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:20): `// Always include initial_meters in the parsed fields so we can handle it on the server`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:21): `const fields = ["fabric_type_id", "loom_id", "gross_weight", "core_weight", "end_meters", "remarks", "initial_meters"];`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:22): `const parsed = assertValid(productionSchema, readPayload(formData, fields));`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:26): `// Fetch the last end_meters for this loom to compute/validate initial_meters`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:28): `.from("loom_production_entries") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:29): `.select("end_meters")`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:36): `const lastEnd = Number((lastEntry as any)?.end_meters ?? 0);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:41): `gross_weight: parsed.gross_weight,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:42): `core_weight: parsed.core_weight,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:43): `end_meters: parsed.end_meters,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:50): `const initialMtrs = parsed.initial_meters ?? lastEnd;`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:51): `payload.initial_meters = initialMtrs;`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:55): `if (parsed.initial_meters !== undefined) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:56): `payload.initial_meters = parsed.initial_meters;`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:57): `payload.initial_meter_overridden = parsed.initial_meters !== lastEnd;`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:62): `? (adminSupabase.from("loom_production_entries") as any).update(payload as any).eq("id", id)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:63): `: (adminSupabase.from("loom_production_entries") as any).insert({ ...payload, created_by: user.id } as any);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:67): `revalidatePath("/fabric/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:70): `revalidatePath("/fabric/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:73): `export async function softDeleteProduction(formData: FormData) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:74): `const user = await requirePermission("fabric.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:81): `.eq("production_entry_id", id)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:91): `.from("loom_production_entries") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:95): `if (process.env.NODE_ENV !== "production") {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:96): `console.error("[softDeleteProduction] failed", {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:104): `revalidatePath("/fabric/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:107): `revalidatePath("/fabric/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:110): `export async function saveRotoFilmProduction(formData: FormData) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:111): `const user = await requirePermission("roto_printing.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:115): `const weightKg = Number(formData.get("weight_kg") ?? 0);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:116): `const meters = Number(formData.get("meters") ?? 0);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:119): `if (!brandId || !filmType || weightKg <= 0 || meters <= 0) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:120): `throw new Error("Invalid production parameters.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:175): `weight_kg: weightKg,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:176): `meters: meters,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:185): `revalidatePath("/roto-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:186): `revalidatePath("/roto-printing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:187): `revalidatePath("/lamination/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:190): `export async function deleteRotoFilmProduction(id: string) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:191): `await requirePermission("roto_printing.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:210): `revalidatePath("/roto-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:211): `revalidatePath("/roto-printing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:212): `revalidatePath("/lamination/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:215): `export async function saveRotoMetallicProduction(formData: FormData) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:216): `const user = await requirePermission("roto_printing.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:219): `const weightKg = Number(formData.get("weight_kg") ?? 0);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:220): `const meters = Number(formData.get("meters") ?? 0);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:223): `if (!sourceFilmRollId || weightKg <= 0 || meters <= 0) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:224): `throw new Error("Invalid parameters.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:251): `weight_kg: weightKg,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:252): `meters: meters,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:271): `revalidatePath("/roto-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:272): `revalidatePath("/roto-printing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:273): `revalidatePath("/lamination/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:276): `export async function deleteRotoMetallicProduction(id: string) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:277): `await requirePermission("roto_printing.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:296): `revalidatePath("/roto-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:297): `revalidatePath("/roto-printing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:298): `revalidatePath("/lamination/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:301): `export async function saveLaminationProduction(formData: FormData) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:302): `const user = await requirePermission("lamination.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:306): `const weightKg = Number(formData.get("weight_kg") ?? 0);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:307): `const meters = Number(formData.get("meters") ?? 0);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:310): `if (!lamType || !fabricTypeId || weightKg <= 0 || meters <= 0) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:311): `throw new Error("Invalid parameters.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:407): `weight_kg: weightKg,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:408): `meters: meters,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:425): `revalidatePath("/lamination/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:426): `revalidatePath("/lamination/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:427): `revalidatePath("/offset-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:428): `revalidatePath("/finishing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431): `export async function deleteLaminationProduction(id: string) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:432): `await requirePermission("lamination.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:454): `revalidatePath("/lamination/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:455): `revalidatePath("/lamination/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:456): `revalidatePath("/offset-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:457): `revalidatePath("/finishing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:460): `export async function saveOffsetProduction(formData: FormData) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:461): `const user = await requirePermission("offset_printing.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:466): `const weightKg = Number(formData.get("weight_kg") ?? 0);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:469): `if (!offsetType || !brandId || weightKg <= 0) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:470): `throw new Error("Invalid parameters.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:516): `weight_kg: weightKg,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:525): `revalidatePath("/offset-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:526): `revalidatePath("/offset-printing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:527): `revalidatePath("/finishing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:530): `export async function deleteOffsetProduction(id: string) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:531): `await requirePermission("offset_printing.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:550): `revalidatePath("/offset-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:551): `revalidatePath("/offset-printing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:552): `revalidatePath("/finishing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:556): `const user = await requirePermission("finishing.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:559): `const weightKg = Number(formData.get("weight_kg") ?? 0);`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:562): `if (!finishType || numBags <= 0 || weightKg <= 0) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:563): `throw new Error("Invalid parameters.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:623): `weight_kg: weightKg,`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:632): `revalidatePath("/finishing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:633): `revalidatePath("/finishing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:638): `await requirePermission("finishing.production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:671): `revalidatePath("/finishing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:672): `revalidatePath("/finishing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:675): `export async function saveStageProduction(formData: FormData) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:678): `roto_printing: "roto_printing.production",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:679): `lamination: "lamination.production",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:680): `offset_printing: "offset_printing.production",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:681): `finishing: "finishing.production",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:683): `const permission = permissionMap[stage] || "fabric.production";`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:703): `throw new Error("Missing required production entry fields.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:719): `? (adminSupabase.from("stage_production_entries") as any).update(payload).eq("id", id)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:720): `: (adminSupabase.from("stage_production_entries") as any).insert({ ...payload, created_by: user.id });`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:725): `revalidatePath("/roto-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:726): `revalidatePath("/roto-printing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:727): `revalidatePath("/lamination/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:728): `revalidatePath("/lamination/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:729): `revalidatePath("/offset-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:730): `revalidatePath("/offset-printing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:731): `revalidatePath("/finishing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:732): `revalidatePath("/finishing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:738): `export async function softDeleteStageProduction(formData: FormData) {`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:740): `if (!id) throw new Error("Production entry ID is required.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:744): `.from("stage_production_entries") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:750): `throw new Error("Production entry not found.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:755): `roto_printing: "roto_printing.production",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:756): `lamination: "lamination.production",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:757): `offset_printing: "offset_printing.production",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:758): `finishing: "finishing.production",`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:762): `throw new Error("Invalid production stage.");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:769): `.from("stage_production_entries") as any)`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:775): `revalidatePath("/roto-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:776): `revalidatePath("/roto-printing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:777): `revalidatePath("/lamination/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:778): `revalidatePath("/lamination/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:779): `revalidatePath("/offset-printing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:780): `revalidatePath("/offset-printing/stock");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:781): `revalidatePath("/finishing/production");`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:782): `revalidatePath("/finishing/stock");`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:1): `import { ConsumptionForm } from "@/components/app/consumption-form";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:8): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:13): `export default async function FabricConsumptionPage({`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:18): `await requirePermission("fabric.consumption");`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:25): `const [{ data: rawMaterials }, { data: consumptions }] = await Promise.all([`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:28): `.select("id, material_name, unit, status, current_stock")`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:34): `.from("raw_material_consumptions")`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:37): `.eq("consumption_date", date)`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:43): `const rows = (consumptions ?? []) as any[];`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:48): `title="Fabric Raw Material Consumption"`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:49): `description="Log and monitor the consumption of raw materials in the fabric production process."`

_… 485 additional calculation lines in source._

## Reports

- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:21): `.select("id, customer_name, alias, is_internal, opening_debit, opening_credit, linked_customer_id")`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:59): `const [{ data: openingBalData }, { data: entries }] = await Promise.all([`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:60): `(supabase as any).rpc("get_opening_balance", { p_account_id: accountId, p_from_date: from }),`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:66): `// Construct virtual entries dated before 'from' to represent the opening balance in the frontend`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:68): `if (openingBalData && openingBalData.length > 0) {`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:69): `const { total_debit, total_credit } = openingBalData[0];`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:70): `if (Number(total_debit) > 0) {`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:73): `journal_no: "OPENING",`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:76): `entry_type: "debit" as const,`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:77): `amount: Number(total_debit),`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:78): `description: "Opening Balance",`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:82): `if (Number(total_credit) > 0) {`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:85): `journal_no: "OPENING",`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:88): `entry_type: "credit" as const,`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:89): `amount: Number(total_credit),`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:90): `description: "Opening Balance",`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:98): `// If nothing selected, fetch aggregated trial balance summary up to 'to' date`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:10): `import { BalanceSheetClient } from "./BalanceSheetClient";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:12): `export default async function BalanceSheetPage({`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:17): `await requirePermission("reports.balance_sheet");`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:24): `// 1. Fetch closing stock and P&L submissions`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:29): `.eq("key", \`closing_stock_${date}\`)`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:38): `const closingStock = (csSetting as any)?.value || null;`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:41): `const isCsMissing = !closingStock;`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:48): `title="Balance Sheet"`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:49): `description="Company balance sheet statement of liabilities and assets."`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:53): `<DateFilter date={date} baseUrl="/reports/balance-sheet" />`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:62): `To view the Balance Sheet for any given day, both the Closing Stock and the Profit & Loss statement must be submitted first.`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:64): `<div className="text-left text-xs bg-white border border-amber-200 p-3 rounded mt-2 space-y-1 font-semibold text-slate-700">`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:66): `<span className={closingStock ? "text-emerald-600" : "text-rose-600"}>`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:67): `{closingStock ? "✓" : "✗"}`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:69): `<span>Closing Stock Submission</span>`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:82): `<Link href={\`/reports/closing-stock?date=${date}\`}>`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:83): `Submit Closing Stock`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:101): `// 2. Fetch all active ledger accounts (customers table contains client, capital, loan, balance sheet a/c)`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:104): `.select("id, customer_name, alias, opening_debit, opening_credit, is_internal")`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:116): `title="Balance Sheet"`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:117): `description="Company balance sheet statement of liabilities and assets."`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:124): `<DateFilter date={date} baseUrl="/reports/balance-sheet" />`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:128): `<BalanceSheetClient`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:132): `closingStockValue={closingStock.grandTotal}`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:4): `import { ClosingStockReportClient } from "./ClosingStockReportClient";`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:8): `export default async function ClosingStockReportPage({ searchParams }: { searchParams: Promise<Params> }) {`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:9): `await requirePermission("reports.closing_stock");`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:15): `// Fetch raw materials, purchases, consumptions, material sales, fabric types, and rolls from all 5 departments`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:19): `{ data: consumptions },`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:32): `.select("id, material_name, unit, department, current_stock")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:37): `.select("raw_material_id, purchase_date, quantity, rate, total_amount")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:40): `(supabase.from("raw_material_consumptions") as any)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:41): `.select("raw_material_id, consumption_date, quantity")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:43): `.order("consumption_date", { ascending: true }),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:45): `.select("raw_material_id, sale_date, quantity, type")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:61): `.select("id, roll_number, fabric_type_id, weight, meters, production_date, status, current_stage")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:67): `.select("id, roll_id, fabric_type_id, weight_kg, meters, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:73): `.select("id, roll_id, fabric_type_id, weight_kg, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:79): `.select("id, bundle_id, fabric_type_id, weight_kg, num_bags, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:85): `.select("id, roll_id, weight_kg, meters, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:91): `.select("id, roll_id, weight_kg, meters, entry_date, status")`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:101): `weight: Number(r.weight || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:102): `meters: Number(r.meters || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:103): `production_date: r.production_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:111): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:112): `meters: Number(r.meters || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:113): `production_date: r.entry_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:121): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:122): `meters: 0,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:123): `production_date: r.entry_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:131): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:132): `meters: Number(r.num_bags || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:133): `production_date: r.entry_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:141): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:142): `meters: Number(r.meters || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:143): `production_date: r.entry_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:151): `weight: Number(r.weight_kg || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:152): `meters: Number(r.meters || 0),`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:153): `production_date: r.entry_date,`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:159): `// Fetch existing closing stock submission for this date`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:160): `const { data: closingStockSetting } = await supabase`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:163): `.eq("key", \`closing_stock_${date}\`)`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:166): `const submittedClosingStock = (closingStockSetting as any)?.value || null;`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:169): `<ClosingStockReportClient`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:173): `consumptions={(consumptions ?? []) as any[]}`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:178): `submittedStock={submittedClosingStock}`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:3): `import { OpeningBalanceClient } from "./OpeningBalanceClient";`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:5): `export default async function OpeningBalancePage() {`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:6): `await requirePermission("reports.opening_balance");`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:13): `.select("id, customer_name, alias, opening_debit, opening_credit, is_internal")`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:19): `<OpeningBalanceClient`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:13): `type DailyProductionRow = Database["public"]["Tables"]["loom_production_entries"]["Row"] & {`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:48): `weight: "Weight",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:49): `meters: "Meters",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:50): `quantity: "Quantity",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:51): `rate: "Rate",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:52): `amount: "Amount",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:54): `working_hours: "Working Hours",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:55): `overtime_hours: "Overtime Hours",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:56): `current_stock: "Current Stock",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:57): `opening_stock: "Opening Stock",`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:65): `if (column === "weight") return \`${formatNumber(value, 2)} kg\`;`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:66): `if (column === "meters" || column === "quantity") {`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:67): `const unit = String(row.unit ?? (column === "meters" ? "m" : ""));`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:70): `if (column === "rate" || column === "amount" || column === "salary") return \`₹${formatNumber(value, 2)}\`;`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:71): `if (column.includes("hours")) return \`${formatNumber(value, 2)} hrs\`;`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:74): `if ((column === "opening_stock" || column === "current_stock") && value != null) return \`${formatNumber(String(value), 2)} ${row.unit ?? ""}\`.trim();`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:79): `await requirePermission("reports.stock");`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:85): `const [productionResult, rollsResult, rawResult, rawPurchaseResult, salesResult, attendanceResult, employeeResult] = await Promise.all([`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:86): `supabase.from("loom_production_entries").select("entry_date, serial_number, net_weight, net_meters, fabric_types(fabric_name), looms(loom_number)").gte("entry_date", from).lte("entry_date", to).is("deleted_at", null).order("entry_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:87): `(supabase as any).rpc("get_fabric_stock_summary"),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:88): `supabase.from("raw_materials").select("material_name, unit, opening_stock, current_stock, status").is("deleted_at", null).order("material_name"),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:89): `supabase.from("raw_material_purchases").select("purchase_date, supplier_name, bill_number, quantity, rate, total_amount, raw_materials(material_name, unit)").gte("purchase_date", from).lte("purchase_date", to).is("deleted_at", null).order("purchase_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:90): `supabase.from("sales_orders").select("order_date, order_number, quantity_meters, total_amount, status, customers(customer_name), fabric_types(fabric_name)").gte("order_date", from).lte("order_date", to).is("deleted_at", null).order("order_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:91): `supabase.from("attendance").select("attendance_date, check_in, check_out, working_hours, overtime_hours, status, employees(name, employee_code)").gte("attendance_date", from).lte("attendance_date", to).is("deleted_at", null).order("attendance_date", { ascending: false }).limit(500),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:95): `const production = ((productionResult.data ?? []) as DailyProductionRow[]).map((row) => ({`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:100): `weight: Number(row.net_weight),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:101): `meters: Number(row.net_meters),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:104): `const fabricStock = ((rollsResult.data ?? []) as any[]).map((row) => ({`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:107): `weight: Number(row.weight ?? 0),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:108): `meters: Number(row.meters ?? 0),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:117): `quantity: Number(row.quantity),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:118): `rate: Number(row.rate),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:119): `amount: Number(row.total_amount),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:127): `quantity: Number(row.quantity_meters),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:128): `amount: Number(row.total_amount),`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:134): `<PageHeader title="Reports" description="Production, inventory, sales, and HR reports with date filters and export." />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:135): `<form className="no-print mb-5 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4">`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:139): `<button className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Apply Filters</button>`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:142): `<ReportTable title="Daily Production" filename="daily-production" rows={production} columns={["date", "serial", "fabric", "loom", "weight", "meters"]} />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:143): `<ReportTable title="Fabric Stock" filename="fabric-stock" rows={fabricStock as ReportRow[]} columns={["fabric", "rolls", "weight", "meters"]} />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:144): `<ReportTable title="Raw Material Stock" filename="raw-material-stock" rows={(rawResult.data ?? []) as unknown as ReportRow[]} columns={["material_name", "unit", "opening_stock", "current_stock", "status"]} />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:145): `<ReportTable title="Raw Material Purchases" filename="raw-material-purchases" rows={rawPurchases} columns={["date", "material", "supplier", "bill", "quantity", "rate", "amount"]} />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:146): `<ReportTable title="Customer Wise Sales" filename="sales" rows={sales} columns={["date", "order", "customer", "fabric", "quantity", "amount", "status"]} />`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:147): `<ReportTable title="Attendance Report" filename="attendance" rows={((attendanceResult.data ?? []) as AttendanceRow[]).map((row) => ({ date: row.attendance_date, employee: \`${row.employees?.employee_code ?? ""} ${row.employees?.name ?? ""}\`.trim(), check_in: row.check_in, check_out: row.check_out, working_hours: Number(row.working_hours ?? 0), overtime_hours: Number(row.overtime_hours ?? 0), status: row.status })).filter((row) => inText(row, search))} columns={["date", "employee", "check_in", "check_out", "working_hours", "overtime_hours", "status"]} />`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:24): `// 1. Fetch closing stock submission from settings`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:25): `const { data: closingStockSetting } = await supabase`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:28): `.eq("key", \`closing_stock_${date}\`)`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:31): `const submittedClosingStock = (closingStockSetting as any)?.value || null;`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:33): `if (!submittedClosingStock) {`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:49): `<h3 className="text-lg font-bold text-amber-950">Closing Stock Required</h3>`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:51): `To open the Profit & Loss statement for any given day, the Closing Stock must be submitted first. No submission found for {date}.`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:55): `<Link href={\`/reports/closing-stock?date=${date}\`}>`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:56): `Go Submit Closing Stock`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:73): `.select("id, customer_name, alias, opening_debit, opening_credit, is_internal")`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:107): `closingStockValue={submittedClosingStock.grandTotal}`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:113): `Promise.all(chunks.map(chunk => supabase.from("fabric_rolls").select("id, weight, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:114): `Promise.all(chunks.map(chunk => supabase.from("lamination_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:115): `Promise.all(chunks.map(chunk => supabase.from("offset_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:116): `Promise.all(chunks.map(chunk => supabase.from("finishing_bundles").select("id, weight_kg, num_bags").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:117): `Promise.all(chunks.map(chunk => supabase.from("roto_film_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null))),`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:118): `Promise.all(chunks.map(chunk => supabase.from("roto_metallic_rolls").select("id, weight_kg, meters").in("id", chunk).is("deleted_at", null)))`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:121): `const fabricRolls = fabricRes.flatMap(res => (res.data ?? []) as any[]).map(r => ({ id: r.id, weight: Number(r.weight || 0), count: Number(r.meters || 0) }));`

_… 39 additional calculation lines in source._

## Dashboard

- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:22): `<CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:23): `<Icon className="h-4 w-4 text-muted-foreground" />`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:43): `const productionEntries = Number(summary.production_entries ?? 0);`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:44): `const todayWeight = Number(summary.total_weight ?? 0);`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:45): `const todayMeters = Number(summary.total_meters ?? 0);`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:47): `const materialStock = Number(summary.material_stock ?? 0);`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:49): `const chartData = ((chartRows ?? []) as any[]).map((row) => ({ name: row.name, meters: Number(row.meters ?? 0), weight: Number(row.weight ?? 0) }));`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:53): `<PageHeader title="Dashboard" description="Daily production, inventory, HR, and sales snapshot." />`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:55): `<StatCard title="Today's Production" value={\`${productionEntries} entries\`} icon={Factory} />`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:56): `<StatCard title="Total Rolls Today" value={String(productionEntries)} icon={Package} />`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:57): `<StatCard title="Weight Today" value={\`${formatNumber(todayWeight, 2)} kg\`} icon={Scale} />`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:58): `<StatCard title="Meters Today" value={\`${formatNumber(todayMeters, 2)} m\`} icon={ScrollText} />`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:59): `<StatCard title="Available Fabric Stock" value={\`${availableRolls} rolls\`} icon={Package} />`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:60): `<StatCard title="Raw Material Stock" value={formatNumber(materialStock, 2)} icon={Boxes} />`

## Portal

- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:15): `<div className="p-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">`
- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:47): `<Button variant="ghost" className="gap-2 text-muted-foreground hover:text-slate-800">`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:18): `<div className="p-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:63): `const totalCount = orders.length;`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:85): `<CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders</CardTitle>`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:89): `<div className="text-2xl font-bold text-slate-800">{totalCount}</div>`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:144): `<TableHead className="text-right">Total Price</TableHead>`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:152): `// Sum total price estimate based on item price & quantity`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:153): `const totalPrice = items.reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.price || 0), 0);`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:163): `<span className="capitalize px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600 mr-1.5">`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:167): `? \`${item.fabric_types?.fabric_name ?? "Fabric"} — ${formatNumber(item.quantity, 0)} m\``
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:168): `: \`${item.finishing_products?.name ?? "Bags"} — ${formatNumber(item.quantity, 0)} bags\``
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:175): `{totalPrice > 0 ? \`₹${formatNumber(totalPrice, 2)}\` : "Pending Quote"}`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:182): `<span className="inline-flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:187): `<span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:192): `<span className="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:61): `className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-all"`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:67): `<div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-1">`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:72): `const total = ordersData.length;`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:76): `const totalBilled = ordersData.reduce((s, o) => s + Number(o.bill_value ?? 0), 0);`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:90): `{ key: "all",       label: "All Orders",  count: total },`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:102): `<div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-1">`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:116): `className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-sm"`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:124): `className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 text-xs font-medium transition-all"`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:136): `<div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-amber-800 text-xs font-semibold">`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:144): `{ label: "Total Orders",   value: total,     color: "bg-white border-slate-200/60",   text: "text-slate-900" },`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:145): `{ label: "Total Billed",   value: \`₹${formatNumber(totalBilled, 0)}\`, color: "bg-white border-slate-200/60", text: "text-emerald-700" },`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:149): `<div key={stat.label} className={\`rounded-2xl border ${stat.color} p-5 shadow-xs\`}>`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:157): `<div className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden shadow-xs">`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:160): `<span className="text-xs text-slate-400 font-semibold">{total} orders</span>`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:171): `className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:178): `<span className={\`px-1.5 py-0.2 rounded text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}\`}>`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:192): `: total === 0`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:197): `{total === 0 && customerId ? "Your orders will appear here once dispatched." : ""}`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:214): `<span className={\`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold ${statusCfg.color}\`}>`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:240): `className={\`h-1.5 w-6 rounded-full ${step <= statusCfg.step ? "bg-slate-950" : "bg-slate-100"}\`}`

## Core

- [.gitignore](C:/Users/spsch/Downloads/ERP-main/ERP-main/.gitignore:8): `# production`
- [android/.gitignore](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/.gitignore:15): `# Generated files`
- [android/.gitignore](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/.gitignore:29): `# Proguard folder generated by Eclipse`
- [android/.gitignore](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/.gitignore:60): `# External native build folder generated in Android Studio 2.2 and later`
- [android/.gitignore](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/.gitignore:84): `lint/generated/`
- [android/.gitignore](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/.gitignore:98): `# Generated Config files`
- [android/app/capacitor.build.gradle](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/capacitor.build.gradle:1): `// DO NOT EDIT THIS FILE! IT IS GENERATED EACH TIME "capacitor update" IS RUN`
- [android/app/src/main/AndroidManifest.xml](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/main/AndroidManifest.xml:8): `android:roundIcon="@mipmap/ic_launcher_round"`
- [android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml:3): `<background android:drawable="@color/ic_launcher_background"/>`
- [android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml:4): `<foreground android:drawable="@mipmap/ic_launcher_foreground"/>`
- [android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml:3): `<background android:drawable="@color/ic_launcher_background"/>`
- [android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml:4): `<foreground android:drawable="@mipmap/ic_launcher_foreground"/>`
- [android/app/src/main/res/values/ic_launcher_background.xml](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/main/res/values/ic_launcher_background.xml:3): `<color name="ic_launcher_background">#FFFFFF</color>`
- [android/app/src/main/res/values/styles.xml](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/main/res/values/styles.xml:15): `<item name="android:background">@null</item>`
- [android/app/src/main/res/values/styles.xml](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/main/res/values/styles.xml:20): `<item name="android:background">@drawable/splash</item>`
- [android/capacitor.settings.gradle](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/capacitor.settings.gradle:1): `// DO NOT EDIT THIS FILE! IT IS GENERATED EACH TIME "capacitor update" IS RUN`
- [capacitor.config.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/capacitor.config.json:13): `"backgroundColor": "#ffffff",`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:18): `* **\`fabric_types\`**: Templates defining different fabric parameters (\`fabric_name\`, \`width\`, \`gsm\`, \`avg_weight_per_meter\`, \`status\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:19): `* **\`fabric_rolls\`**: Inventory tracking for individual fabric rolls (\`roll_number\`, \`fabric_type_id\`, \`weight\`, \`meters\`, \`status\` [available, allocated, dispatched], \`production_date\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:20): `* **\`loom_production_entries\`**: Logs of fabric rolls outputted from looms (\`entry_date\`, \`loom_id\`, \`fabric_type_id\`, \`gross_weight\`, \`core_weight\`, \`net_weight\`, \`net_meters\`, \`average_meter_weight\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:24): `* **\`attendance\`**: Daily clock-in/out logs (\`employee_id\`, \`attendance_date\`, \`check_in\`, \`check_out\`, \`check_in_at\`, \`check_out_at\`, \`working_hours\`, \`overtime_hours\`, \`status\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:27): `* **\`customers\`**: Multi-purpose ledger representing external **Buyers**, **Suppliers**, and **Internal Accounting Entities** (e.g. system accounts "Purchase A/c" and "Sales A/c").`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:28): `- Columns: \`id\`, \`customer_name\`, \`alias\`, \`gst_number\`, \`address\`, \`status\`, \`is_internal\` (\`client a/c\`, \`profit and loss a/c\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:30): `* **\`sales_order_items\`**: Individual item rows within an order sheet (\`sales_order_id\`, \`department\`, \`product_id\`, \`quantity\`, \`selected_roll_ids\` [UUID array representing allocated rolls]).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:31): `* **\`raw_materials\`**: Catalog of raw materials (\`material_name\`, \`unit\`, \`opening_stock\`, \`current_stock\`, \`critical_level\`, \`status\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:32): `* **\`raw_material_purchases\`**: Inventory purchases ledger (\`purchase_date\`, \`raw_material_id\`, \`supplier_name\`, \`bill_number\`, \`quantity\`, \`rate\`, \`total_amount\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:35): `* **\`accounts_journal\`**: Balanced bookkeeping transaction lines (Debits/Credits).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:36): `- Columns: \`id\`, \`journal_no\` (e.g., JE-000001), \`entry_date\`, \`account_id\` (references \`customers.id\`), \`account_name\` (legacy text fallback), \`entry_type\` (\`debit\`, \`credit\`), \`amount\`, \`description\`.`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:42): `The ERP enforces double-entry accounting constraints. Transactions auto-generate balancing debit/credit journal entries in \`accounts_journal\`:`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:46): `- Debit:  "Purchase A/c" (Linked to system P&L customer ID)`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:47): `- Credit: [Supplier Name] (Linked to supplier's customer ID)`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:50): `- Debit:  [Customer Name] (Linked to customer's customer ID)`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:51): `- Credit: "Sales A/c"    (Linked to system P&L customer ID)`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:62): `* **Why:** In Next.js App Router, changing search/query parameters (e.g. switching Products tabs: roto vs offset, or searching a ledger) triggers server-side re-rendering. Because the route path doesn't change, Next.js does not display the default \`loading.tsx\` spinner. The browser blocked visually until the server finished fetching.`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:66): `* **What we did:** Added \`prefetch={false}\` to detail drill-down links in \`/sales/order-confirmation\`, \`/fabric/stock\`, and \`/rolls\` list tables.`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:67): `* **Why:** Next.js default viewport prefetching downloads the server payload for all visible links. For lists with 25 rows where each detail page runs 6 heavy queries, loading the list page triggered up to 150 background database queries instantly, causing connection spikes and slow loading. Disabling prefetching keeps the load strictly on user-intent (click).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:78): `- \`idx_accounts_journal_account_id\` (optimize ledger queries).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:79): `- Foreign keys: \`idx_raw_material_purchases_material\`, \`idx_loom_production_entries_fabric\`, and \`idx_sales_order_items_order\` (optimize cascade checks and sub-table joins).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:83): `* **Why:** Name-based references (\`account_name TEXT\`) are prone to integrity errors (e.g., renaming a customer breaks historical ledger audits) and make reports filtering by account ID impossible.`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:13): `fabric_types ||--o{ loom_production_entries : produced_as`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:14): `looms ||--o{ loom_production_entries : runs`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:15): `loom_production_entries ||--|| fabric_rolls : creates`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:16): `fabric_types ||--o{ fabric_rolls : stocked_as`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:55): `numeric opening_stock`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:56): `numeric current_stock`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:65): `numeric quantity`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:66): `numeric rate`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:67): `numeric total_amount`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:90): `text gst_number`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:94): `loom_production_entries {`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:100): `numeric gross_weight`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:101): `numeric core_weight`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:102): `numeric net_weight`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:103): `numeric initial_meters`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:104): `numeric end_meters`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:105): `numeric net_meters`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:106): `numeric average_meter_weight`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:111): `uuid production_entry_id FK`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:114): `numeric weight`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:115): `numeric meters`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:124): `numeric quantity_meters`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:125): `numeric rate`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:126): `numeric total_amount`
- [docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md:8): `- Existing production, fabric rolls, sales, inventory, and authentication modules are functional and must remain unchanged unless a targeted security or performance fix is required.`
- [docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md:14): `- Existing audit logging covers roles, users, master data, attendance, production, rolls, sales, raw material purchases, and settings via database triggers.`
- [docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/SECURITY_AND_IMPLEMENTATION_AUDIT.md:45): `6. Keep existing production, fabric roll, sales, inventory, and auth behavior compatible.`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:39): `const duration = Math.round(end - start);`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:46): `return { name, duration: Math.round(end - start), success: false, count: 0, error: err.message };`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:69): `measure("Fetch product purchases (gte date)", supabase.from("product_purchases").select("id, purchase_date, supplier_name, bill_number, total_amount, remarks, product_purchase_items(id, department, quantity, weight, rate, amount, created_stock_id, supplier_roll_id)").gte("purchase_date", "2026-07-13").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:87): `page: "Production - Fabric Consumption",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:89): `measure("Fetch fabric consumption entries", supabase.from("fabric_rolls").select("*, loom_production_entries(*)").eq("status", "consumed").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:93): `page: "Production - Fabric Production",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:95): `measure("Fetch loom production (eq date)", supabase.from("loom_production_entries").select("*, looms(*), fabric_types(*)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:99): `page: "Production - Fabric Stock",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:105): `page: "Production - Lamination Consumption",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:107): `measure("Fetch lamination consumption (gte date)", supabase.from("lamination_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:111): `page: "Production - Lamination Production",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:113): `measure("Fetch lamination production (eq date)", supabase.from("lamination_rolls").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:117): `page: "Production - Lamination Stock",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:123): `page: "Production - Offset Consumption",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:125): `measure("Fetch offset consumption (gte date)", supabase.from("offset_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:129): `page: "Production - Offset Production",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:131): `measure("Fetch offset production (eq date)", supabase.from("offset_rolls").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:135): `page: "Production - Offset Stock",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:141): `page: "Production - Finishing Consumption",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:143): `measure("Fetch finishing consumption (gte date)", supabase.from("finishing_bundles").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:147): `page: "Production - Finishing Production",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:149): `measure("Fetch finishing production (eq date)", supabase.from("finishing_bundles").select("*, fabric_types(fabric_name)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:153): `page: "Production - Finishing Stock",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:159): `page: "Production - Roto Consumption",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:161): `measure("Fetch roto consumption (gte date)", supabase.from("roto_film_rolls").select("*").eq("status", "consumed").gte("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:165): `page: "Production - Roto Production",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:167): `measure("Fetch roto production (eq date)", supabase.from("roto_film_rolls").select("*, roto_products(brand)").eq("entry_date", "2026-07-13").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:171): `page: "Production - Roto Stock",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:177): `page: "Reports - Balance Sheet",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:179): `measure("Fetch ledger journal entries", supabase.from("accounts_journal").select("entry_date, amount, entry_type, description").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:185): `measure("Fetch ledger journal entries", supabase.from("accounts_journal").select("entry_date, amount, entry_type, description").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:195): `page: "Reports - Stock Report",`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:197): `measure("Fetch raw materials status", supabase.from("raw_materials").select("id, material_name, unit, current_stock, department").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:249): `let totalLatency = 0;`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:282): `totalLatency += maxDuration;`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:288): `console.log(\`Total Pages Tested: ${tests.length}\`);`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:292): `console.log(\`Total Simulated Latency: ${totalLatency}ms\`);`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:164): `"integrity": "sha512-uTII7OYF+/Mes/MrcIOYp5yOtSMLBWSIoLPpcgwipoiKbli6k322tcoFsxoIIxPDqW01SQGAgko4EzZi2BNv2w==",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:499): `"integrity": "sha512-EKbmBKtyTH+GPFDRw2TgK2oV6hyxxlJVIar4hoTYSNmIwipgMFdxPQqR392GmfdsPGWga0mCFN1cCKjRb9cljw==",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:3057): `"node_modules/@typescript-eslint/typescript-estree/node_modules/balanced-match": {`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:3059): `"resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:3074): `"balanced-match": "^4.0.2"`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:3154): `"integrity": "sha512-g5T90pqg1bo/7mytQx6F4iBNC0Wsh9cu+z9veDbFjc7HjpesJFWD7QMS0NGStXM075+7dJPPVvBbpZlnrdpi/w==",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:3280): `"integrity": "sha512-3SJGEh1DborhG6pyxvhPzCT4bbSIVihsvgJc13P1bHG7KLdNDaF9T3gsTwFc7Jw/5Y5/iWOjkEx7Zy0NvCGX3Q==",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:3877): `"node_modules/balanced-match": {`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:3879): `"resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:3960): `"balanced-match": "^1.0.0",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:4768): `"integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:5683): `"node_modules/glob/node_modules/balanced-match": {`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:5685): `"resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:5698): `"balanced-match": "^4.0.2"`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:7352): `"integrity": "sha512-WQ3AgWCWYSb2yt+IG8mnC6Jdk9Whs7O0gxphblsLvdhSpSTtmu69ZG1Gkb6NuvxsNACwiPV6cNSZNzt0KPsw7g==",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:7845): `"node_modules/pirates": {`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:7847): `"resolved": "https://registry.npmjs.org/pirates/-/pirates-4.0.7.tgz",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:9033): `"integrity": "sha512-G7Ok5C6E/j4SGfyLCloXTrngQIQU3PWtXGst3yM7Bea9FRURf1S42ZHlZZtsNque2FN2PoUhfZXYLNWwEr4dLQ==",`
- [package-lock.json](C:/Users/spsch/Downloads/ERP-main/ERP-main/package-lock.json:9137): `"pirates": "^4.0.1",`
- [public/rk-global-logo.svg](C:/Users/spsch/Downloads/ERP-main/ERP-main/public/rk-global-logo.svg:4): `<path d="M58 178C82 82 167 28 292 19" stroke="#282824" stroke-width="12" stroke-linecap="round"/>`
- [public/rk-global-logo.svg](C:/Users/spsch/Downloads/ERP-main/ERP-main/public/rk-global-logo.svg:5): `<path d="M455 164C490 253 473 390 347 463" stroke="#282824" stroke-width="12" stroke-linecap="round"/>`
- [public/rk-global-logo.svg](C:/Users/spsch/Downloads/ERP-main/ERP-main/public/rk-global-logo.svg:6): `<path d="M84 359C125 444 225 482 333 460" stroke="#282824" stroke-width="12" stroke-linecap="round"/>`
- [public/rk-global-logo.svg](C:/Users/spsch/Downloads/ERP-main/ERP-main/public/rk-global-logo.svg:9): `<path d="M128 411H384" stroke="#282824" stroke-width="5" stroke-linecap="round"/>`
- [public/rk-global-logo.svg](C:/Users/spsch/Downloads/ERP-main/ERP-main/public/rk-global-logo.svg:10): `<text x="256" y="460" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700" letter-spacing="14" fill="#282824">GLOBAL</text>`
- [public/sw.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/public/sw.js:1): `(()=>{"use strict";let e,t,a,s,r,n={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"serwist",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},i=e=>[n.prefix,e,n.suffix].filter(e=>e&&e.length>0).join("-"),c={updateDetails:e=>{var t=t=>{let a=e[t];"string"==typeof a&&(n[t]=a)};for(let e of Object.keys(n))t(e)},getGoogleAnalyticsName:e=>e||i(n.googleAnalytics),getPrecacheName:e=>e||i(n.precache),getRuntimeName:e=>e||i(n.runtime)};var o=class extends Error{details;constructor(e,t){super(((e,...t)=>{let a=e;return t.length>0&&(a+=\` :: ${JSON.stringify(t)}\`),a})(e,t)),this.name=e,this.details=t}};function l(e){return new Promise(t=>setTimeout(t,e))}let h=new Set;function u(e,t){let a=new URL(e);for(let e of t)a.searchParams.delete(e);return a.href}async function d(e,t,a,s){let r=u(t.url,a);if(t.url===r)return e.match(t,s);let n={...s,ignoreSearch:!0};for(let i of(await e.keys(t,n)))if(r===u(i.url,a))return e.match(i,s)}var m=class{promise;resolve;reject;constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}};let f=async()=>{for(let e of h)await e()},g="-precache-",w=async(e,t=g)=>{let a=(await self.caches.keys()).filter(a=>a.includes(t)&&a.includes(self.registration.scope)&&a!==e);return await Promise.all(a.map(e=>self.caches.delete(e))),a},p=(e,t)=>{let a=t();return e.waitUntil(a),a},y=(e,t)=>t.some(t=>e instanceof t),_=new WeakMap,x=new WeakMap,v=new WeakMap,b={get(e,t,a){if(e instanceof IDBTransaction){if("done"===t)return _.get(e);if("store"===t)return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return E(e[t])},set:(e,t,a)=>(e[t]=a,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function E(e){if(e instanceof IDBRequest){let t=new Promise((t,a)=>{let s=()=>{e.removeEventListener("success",r),e.removeEventListener("error",n)},r=()=>{t(E(e.result)),s()},n=()=>{a(e.error),s()};e.addEventListener("success",r),e.addEventListener("error",n)});return v.set(t,e),t}if(x.has(e))return x.get(e);let s=function(e){if("function"==typeof e)return(a||(a=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(R(this),t),E(this.request)}:function(...t){return E(e.apply(R(this),t))};return(e instanceof IDBTransaction&&function(e){if(_.has(e))return;let t=new Promise((t,a)=>{let s=()=>{e.removeEventListener("complete",r),e.removeEventListener("error",n),e.removeEventListener("abort",n)},r=()=>{t(),s()},n=()=>{a(e.error||new DOMException("AbortError","AbortError")),s()};e.addEventListener("complete",r),e.addEventListener("error",n),e.addEventListener("abort",n)});_.set(e,t)}(e),y(e,t||(t=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(e,b):e}(e);return s!==e&&(x.set(e,s),v.set(s,e)),s}let R=e=>v.get(e);function q(e,t,{blocked:a,upgrade:s,blocking:r,terminated:n}={}){let i=indexedDB.open(e,t),c=E(i);return s&&i.addEventListener("upgradeneeded",e=>{s(E(i.result),e.oldVersion,e.newVersion,E(i.transaction),e)}),a&&i.addEventListener("blocked",e=>a(e.oldVersion,e.newVersion,e)),c.then(e=>{n&&e.addEventListener("close",()=>n()),r&&e.addEventListener("versionchange",e=>r(e.oldVersion,e.newVersion,e))}).catch(()=>{}),c}let S=["get","getKey","getAll","getAllKeys","count"],D=["put","add","delete","clear"],C=new Map;function N(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(C.get(t))return C.get(t);let a=t.replace(/FromIndex$/,""),s=t!==a,r=D.includes(a);if(!(a in(s?IDBIndex:IDBObjectStore).prototype)||!(r||S.includes(a)))return;let n=async function(e,...t){let n=this.transaction(e,r?"readwrite":"readonly"),i=n.store;return s&&(i=i.index(t.shift())),(await Promise.all([i[a](...t),r&&n.done]))[0]};return C.set(t,n),n}b=(e=>({...e,get:(t,a,s)=>N(t,a)||e.get(t,a,s),has:(t,a)=>!!N(t,a)||e.has(t,a)}))(b);let L=["continue","continuePrimaryKey","advance"],T={},A=new WeakMap,P=new WeakMap,k={get(e,t){if(!L.includes(t))return e[t];let a=T[t];return a||(a=T[t]=function(...e){A.set(this,P.get(this)[t](...e))}),a}};async function*I(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;let a=new Proxy(t,k);for(P.set(a,t),v.set(a,R(t));t;)yield a,t=await (A.get(a)||t.continue()),A.delete(a)}function U(e,t){return t===Symbol.asyncIterator&&y(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===t&&y(e,[IDBIndex,IDBObjectStore])}b=(e=>({...e,get:(t,a,s)=>U(t,a)?I:e.get(t,a,s),has:(t,a)=>U(t,a)||e.has(t,a)}))(b);let F=async(t,a)=>{let s=null;if(t.url&&(s=new URL(t.url).origin),s!==self.location.origin)throw new o("cross-origin-copy-response",{origin:s});let r=t.clone(),n={headers:new Headers(r.headers),status:r.status,statusText:r.statusText},i=a?a(n):n,c=!function(){if(void 0===e){let t=new Response("");if("body"in t)try{new Response(t.body),e=!0}catch{e=!1}e=!1}return e}()?await r.blob():r.body;return new Response(c,i)},B="requests",K="queueName";var M=class{_db=null;async addEntry(e){let t=(await this.getDb()).transaction(B,"readwrite",{durability:"relaxed"});await t.store.add(e),await t.done}async getFirstEntryId(){return(await (await this.getDb()).transaction(B).store.openCursor())?.value.id}async getAllEntriesByQueueName(e){return await (await this.getDb()).getAllFromIndex(B,K,IDBKeyRange.only(e))||[]}async getEntryCountByQueueName(e){return(await this.getDb()).countFromIndex(B,K,IDBKeyRange.only(e))}async deleteEntry(e){await (await this.getDb()).delete(B,e)}async getFirstEntryByQueueName(e){return await this.getEndEntryFromIndex(IDBKeyRange.only(e),"next")}async getLastEntryByQueueName(e){return await this.getEndEntryFromIndex(IDBKeyRange.only(e),"prev")}async getEndEntryFromIndex(e,t){return(await (await this.getDb()).transaction(B).store.index(K).openCursor(e,t))?.value}async getDb(){return this._db||(this._db=await q("serwist-background-sync",3,{upgrade:this._upgradeDb})),this._db}_upgradeDb(e,t){t>0&&t<3&&e.objectStoreNames.contains(B)&&e.deleteObjectStore(B),e.createObjectStore(B,{autoIncrement:!0,keyPath:"id"}).createIndex(K,K,{unique:!1})}},O=class{_queueName;_queueDb;constructor(e){this._queueName=e,this._queueDb=new M}async pushEntry(e){delete e.id,e.queueName=this._queueName,await this._queueDb.addEntry(e)}async unshiftEntry(e){let t=await this._queueDb.getFirstEntryId();t?e.id=t-1:delete e.id,e.queueName=this._queueName,await this._queueDb.addEntry(e)}async popEntry(){return this._removeEntry(await this._queueDb.getLastEntryByQueueName(this._queueName))}async shiftEntry(){return this._removeEntry(await this._queueDb.getFirstEntryByQueueName(this._queueName))}async getAll(){return await this._queueDb.getAllEntriesByQueueName(this._queueName)}async size(){return await this._queueDb.getEntryCountByQueueName(this._queueName)}async deleteEntry(e){await this._queueDb.deleteEntry(e)}async _removeEntry(e){return e&&await this.deleteEntry(e.id),e}};let W=["method","referrer","referrerPolicy","mode","credentials","cache","redirect","integrity","keepalive"];var j=class e{_requestData;static async fromRequest(t){let a={url:t.url,headers:{}};for(let e of("GET"!==t.method&&(a.body=await t.clone().arrayBuffer()),t.headers.forEach((e,t)=>{a.headers[t]=e}),W))void 0!==t[e]&&(a[e]=t[e]);return new e(a)}constructor(e){"navigate"===e.mode&&(e.mode="same-origin"),this._requestData=e}toObject(){let e=Object.assign({},this._requestData);return e.headers=Object.assign({},this._requestData.headers),e.body&&(e.body=e.body.slice(0)),e}toRequest(){return new Request(this._requestData.url,this._requestData)}clone(){return new e(this.toObject())}};let H="serwist-background-sync",$=new Set,G=e=>{let t={request:new j(e.requestData).toRequest(),timestamp:e.timestamp};return e.metadata&&(t.metadata=e.metadata),t};var Q=class{_name;_onSync;_maxRetentionTime;_queueStore;_forceSyncFallback;_syncInProgress=!1;_requestsAddedDuringSync=!1;constructor(e,{forceSyncFallback:t,onSync:a,maxRetentionTime:s}={}){if($.has(e))throw new o("duplicate-queue-name",{name:e});$.add(e),this._name=e,this._onSync=a||this.replayRequests,this._maxRetentionTime=s||10080,this._forceSyncFallback=!!t,this._queueStore=new O(this._name),this._addSyncListener()}get name(){return this._name}async pushRequest(e){await this._addRequest(e,"push")}async unshiftRequest(e){await this._addRequest(e,"unshift")}async popRequest(){return this._removeRequest("pop")}async shiftRequest(){return this._removeRequest("shift")}async getAll(){let e=await this._queueStore.getAll(),t=Date.now(),a=[];for(let s of e){let e=60*this._maxRetentionTime*1e3;t-s.timestamp>e?await this._queueStore.deleteEntry(s.id):a.push(G(s))}return a}async size(){return await this._queueStore.size()}async _addRequest({request:e,metadata:t,timestamp:a=Date.now()},s){let r={requestData:(await j.fromRequest(e.clone())).toObject(),timestamp:a};switch(t&&(r.metadata=t),s){case"push":await this._queueStore.pushEntry(r);break;case"unshift":await this._queueStore.unshiftEntry(r)}this._syncInProgress?this._requestsAddedDuringSync=!0:await this.registerSync()}async _removeRequest(e){let t,a=Date.now();switch(e){case"pop":t=await this._queueStore.popEntry();break;case"shift":t=await this._queueStore.shiftEntry()}if(t){let s=60*this._maxRetentionTime*1e3;return a-t.timestamp>s?this._removeRequest(e):G(t)}}async replayRequests(){let e;for(;e=await this.shiftRequest();)try{await fetch(e.request.clone())}catch{throw await this.unshiftRequest(e),new o("queue-replay-failed",{name:this._name})}}async registerSync(){if("sync"in self.registration&&!this._forceSyncFallback)try{await self.registration.sync.register(\`${H}:${this._name}\`)}catch(e){}}_addSyncListener(){"sync"in self.registration&&!this._forceSyncFallback?self.addEventListener("sync",e=>{if(e.tag===\`${H}:${this._name}\`){let t=async()=>{let t;this._syncInProgress=!0;try{await this._onSync({queue:this})}catch(e){if(e instanceof Error)throw e}finally{this._requestsAddedDuringSync&&!(t&&!e.lastChance)&&await this.registerSync(),this._syncInProgress=!1,this._requestsAddedDuringSync=!1}};e.waitUntil(t())}}):this._onSync({queue:this})}static get _queueNames(){return $}},V=class{_queue;constructor(e,t){this._queue=new Q(e,t)}async fetchDidFail({request:e}){await this._queue.pushRequest({request:e})}};let z={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};function J(e){return"string"==typeof e?new Request(e):e}var X=class{event;request;url;params;_cacheKeys={};_strategy;_handlerDeferred;_extendLifetimePromises;_plugins;_pluginStateMap;constructor(e,t){for(let a of(this.event=t.event,this.request=t.request,t.url&&(this.url=t.url,this.params=t.params),this._strategy=e,this._handlerDeferred=new m,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map,this._plugins))this._pluginStateMap.set(a,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){let{event:t}=this,a=J(e),s=await this.getPreloadResponse();if(s)return s;let r=this.hasCallback("fetchDidFail")?a.clone():null;try{for(let e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:t})}catch(e){if(e instanceof Error)throw new o("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}let n=a.clone();try{let e;for(let s of(e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions),this.iterateCallbacks("fetchDidSucceed")))e=await s({event:t,request:n,response:e});return e}catch(e){throw r&&await this.runCallbacks("fetchDidFail",{error:e,event:t,originalRequest:r.clone(),request:n.clone()}),e}}async fetchAndCachePut(e){let t=await this.fetch(e),a=t.clone();return this.waitUntil(this.cachePut(e,a)),t}async cacheMatch(e){let t,a=J(e),{cacheName:s,matchOptions:r}=this._strategy,n=await this.getCacheKey(a,"read"),i={...r,cacheName:s};for(let e of(t=await caches.match(n,i),this.iterateCallbacks("cachedResponseWillBeUsed")))t=await e({cacheName:s,matchOptions:r,cachedResponse:t,request:n,event:this.event})||void 0;return t}async cachePut(e,t){let a=J(e);await l(0);let s=await this.getCacheKey(a,"write");if(!t)throw new o("cache-put-with-no-response",{url:new URL(String(s.url),location.href).href.replace(RegExp(\`^${location.origin}\`),"")});let r=await this._ensureResponseSafeToCache(t);if(!r)return!1;let{cacheName:n,matchOptions:i}=this._strategy,c=await self.caches.open(n),h=this.hasCallback("cacheDidUpdate"),u=h?await d(c,s.clone(),["__WB_REVISION__"],i):null;try{await c.put(s,h?r.clone():r)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await f(),e}for(let e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:n,oldResponse:u,newResponse:r.clone(),request:s,event:this.event});return!0}async getCacheKey(e,t){let a=\`${e.url} | ${t}\`;if(!this._cacheKeys[a]){let s=e;for(let e of this.iterateCallbacks("cacheKeyWillBeUsed"))s=J(await e({mode:t,request:s,event:this.event,params:this.params}));this._cacheKeys[a]=s}return this._cacheKeys[a]}hasCallback(e){for(let t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(let a of this.iterateCallbacks(e))await a(t)}*iterateCallbacks(e){for(let t of this._strategy.plugins)if("function"==typeof t[e]){let a=this._pluginStateMap.get(t),s=s=>{let r={...s,state:a};return t[e](r)};yield s}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async getPreloadResponse(){if(this.event instanceof FetchEvent&&"navigate"===this.event.request.mode&&"preloadResponse"in this.event)try{let e=await this.event.preloadResponse;if(e)return e}catch(e){return}}async _ensureResponseSafeToCache(e){let t=e,a=!1;for(let e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,a=!0,!t)break;return!a&&t&&200!==t.status&&(t=void 0),t}},Y=class{cacheName;plugins;fetchOptions;matchOptions;constructor(e={}){this.cacheName=c.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){let[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});let t=e.event,a="string"==typeof e.request?new Request(e.request):e.request,s=new X(this,e.url?{event:t,request:a,url:e.url,params:e.params}:{event:t,request:a}),r=this._getResponse(s,a,t);return[r,this._awaitComplete(r,s,a,t)]}async _getResponse(e,t,a){let s;await e.runCallbacks("handlerWillStart",{event:a,request:t});try{if(s=await this._handle(t,e),void 0===s||"error"===s.type)throw new o("no-response",{url:t.url})}catch(r){if(r instanceof Error){for(let n of e.iterateCallbacks("handlerDidError"))if(void 0!==(s=await n({error:r,event:a,request:t})))break}if(!s)throw r}for(let r of e.iterateCallbacks("handlerWillRespond"))s=await r({event:a,request:t,response:s});return s}async _awaitComplete(e,t,a,s){let r,n;try{r=await e}catch{}try{await t.runCallbacks("handlerDidRespond",{event:s,request:a,response:r}),await t.doneWaiting()}catch(e){e instanceof Error&&(n=e)}if(await t.runCallbacks("handlerDidComplete",{event:s,request:a,response:r,error:n}),t.destroy(),n)throw n}},Z=class extends Y{_networkTimeoutSeconds;constructor(e={}){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(z),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let a,s=[],r=[];if(this._networkTimeoutSeconds){let{id:n,promise:i}=this._getTimeoutPromise({request:e,logs:s,handler:t});a=n,r.push(i)}let n=this._getNetworkPromise({timeoutId:a,request:e,logs:s,handler:t});r.push(n);let i=await t.waitUntil((async()=>await t.waitUntil(Promise.race(r))||await n)());if(!i)throw new o("no-response",{url:e.url});return i}_getTimeoutPromise({request:e,logs:t,handler:a}){let s;return{promise:new Promise(t=>{s=setTimeout(async()=>{t(await a.cacheMatch(e))},1e3*this._networkTimeoutSeconds)}),id:s}}async _getNetworkPromise({timeoutId:e,request:t,logs:a,handler:s}){let r,n;try{n=await s.fetchAndCachePut(t)}catch(e){e instanceof Error&&(r=e)}return e&&clearTimeout(e),(r||!n)&&(n=await s.cacheMatch(t)),n}},ee=class extends Y{_networkTimeoutSeconds;constructor(e={}){super(e),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){let a,s;try{let a=[t.fetch(e)];if(this._networkTimeoutSeconds){let e=l(1e3*this._networkTimeoutSeconds);a.push(e)}if(!(s=await Promise.race(a)))throw Error(\`Timed out the network response after ${this._networkTimeoutSeconds} seconds.\`)}catch(e){e instanceof Error&&(a=e)}if(!s)throw new o("no-response",{url:e.url,error:a});return s}};let et=e=>e&&"object"==typeof e?e:{handle:e};var ea=class{handler;match;method;catchHandler;constructor(e,t,a="GET"){this.handler=et(t),this.match=e,this.method=a}setCatchHandler(e){this.catchHandler=et(e)}},es=class e extends Y{_fallbackToNetwork;static defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e};static copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await F(e):e};constructor(t={}){t.cacheName=c.getPrecacheName(t.cacheName),super(t),this._fallbackToNetwork=!1!==t.fallbackToNetwork,this.plugins.push(e.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){let a=await t.getPreloadResponse();if(a)return a;let s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let a,s=t.params||{};if(this._fallbackToNetwork){let r=s.integrity,n=e.integrity,i=!n||n===r;a=await t.fetch(new Request(e,{integrity:"no-cors"!==e.mode?n||r:void 0})),r&&i&&"no-cors"!==e.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await t.cachePut(e,a.clone()))}else throw new o("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return a}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();let a=await t.fetch(e);if(!await t.cachePut(e,a.clone()))throw new o("bad-precaching-response",{url:e.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let t=null,a=0;for(let[s,r]of this.plugins.entries())r!==e.copyRedirectedCacheableResponsesPlugin&&(r===e.defaultPrecacheCacheabilityPlugin&&(t=s),r.cacheWillUpdate&&a++);0===a?this.plugins.push(e.defaultPrecacheCacheabilityPlugin):a>1&&null!==t&&this.plugins.splice(t,1)}},er=class extends ea{_allowlist;_denylist;constructor(e,{allowlist:t=[/./],denylist:a=[]}={}){super(e=>this._match(e),e),this._allowlist=t,this._denylist=a}_match({url:e,request:t}){if(t&&"navigate"!==t.mode)return!1;let a=e.pathname+e.search;for(let e of this._denylist)if(e.test(a))return!1;return!!this._allowlist.some(e=>e.test(a))}};function*en(e,{directoryIndex:t="index.html",ignoreURLParametersMatching:a=[/^utm_/,/^fbclid$/],cleanURLs:s=!0,urlManipulation:r}={}){let n=new URL(e,location.href);n.hash="",yield n.href;let i=((e,t=[])=>{for(let a of[...e.searchParams.keys()])t.some(e=>e.test(a))&&e.searchParams.delete(a);return e})(n,a);if(yield i.href,t&&i.pathname.endsWith("/")){let e=new URL(i.href);e.pathname+=t,yield e.href}if(s){let e=new URL(i.href);e.pathname+=".html",yield e.href}if(r)for(let e of r({url:n}))yield e.href}var ei=class extends ea{constructor(e,t,a){super(({url:t})=>{let a=e.exec(t.href);if(a)return t.origin!==location.origin&&0!==a.index?void 0:a.slice(1)},t,a)}};let ec=e=>{if(!e)throw new o("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){let t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}let{revision:t,url:a}=e;if(!a)throw new o("add-to-cache-list-unexpected-type",{entry:e});if(!t){let e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}let s=new URL(a,location.href),r=new URL(a,location.href);return s.searchParams.set("__WB_REVISION__",t),{cacheKey:s.href,url:r.href}};var eo=class{updatedURLs=[];notUpdatedURLs=[];handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)};cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:a})=>{if("install"===e.type&&t?.originalRequest&&t.originalRequest instanceof Request){let e=t.originalRequest.url;a?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return a}};"undefined"!=typeof navigator&&/^((?!chrome|android).)*safari/i.test(navigator.userAgent);let el="cache-entries",eh=e=>{let t=new URL(e,location.href);return t.hash="",t.href};var eu=class{_cacheName;_db=null;constructor(e){this._cacheName=e}_getId(e){return\`${this._cacheName}|${eh(e)}\`}_upgradeDb(e){let t=e.createObjectStore(el,{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1})}_upgradeDbAndDeleteOldDbs(e){this._upgradeDb(e),this._cacheName&&function(e,{blocked:t}={}){let a=indexedDB.deleteDatabase(e);t&&a.addEventListener("blocked",e=>t(e.oldVersion,e)),E(a).then(()=>void 0)}(this._cacheName)}async setTimestamp(e,t){e=eh(e);let a={id:this._getId(e),cacheName:this._cacheName,url:e,timestamp:t},s=(await this.getDb()).transaction(el,"readwrite",{durability:"relaxed"});await s.store.put(a),await s.done}async getTimestamp(e){return(await (await this.getDb()).get(el,this._getId(e)))?.timestamp}async expireEntries(e,t){let a=await (await this.getDb()).transaction(el,"readwrite").store.index("timestamp").openCursor(null,"prev"),s=[],r=0;for(;a;){let n=a.value;n.cacheName===this._cacheName&&(e&&n.timestamp<e||t&&r>=t?(a.delete(),s.push(n.url)):r++),a=await a.continue()}return s}async getDb(){return this._db||(this._db=await q("serwist-expiration",1,{upgrade:this._upgradeDbAndDeleteOldDbs.bind(this)})),this._db}},ed=class{_isRunning=!1;_rerunRequested=!1;_maxEntries;_maxAgeSeconds;_matchOptions;_cacheName;_timestampModel;constructor(e,t={}){this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._matchOptions=t.matchOptions,this._cacheName=e,this._timestampModel=new eu(e)}async expireEntries(){if(this._isRunning){this._rerunRequested=!0;return}this._isRunning=!0;let e=this._maxAgeSeconds?Date.now()-1e3*this._maxAgeSeconds:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),a=await self.caches.open(this._cacheName);for(let e of t)await a.delete(e,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,this.expireEntries())}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(!this._maxAgeSeconds)return!1;let t=await this._timestampModel.getTimestamp(e),a=Date.now()-1e3*this._maxAgeSeconds;return void 0===t||t<a}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}},em=class{_config;_cacheExpirations;constructor(e={}){var t;this._config=e,this._cacheExpirations=new Map,this._config.maxAgeFrom||(this._config.maxAgeFrom="last-fetched"),this._config.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),h.add(t))}_getCacheExpiration(e){if(e===c.getRuntimeName())throw new o("expire-custom-caches-only");let t=this._cacheExpirations.get(e);return t||(t=new ed(e,this._config),this._cacheExpirations.set(e,t)),t}cachedResponseWillBeUsed({event:e,cacheName:t,request:a,cachedResponse:s}){if(!s)return null;let r=this._isResponseDateFresh(s),n=this._getCacheExpiration(t),i="last-used"===this._config.maxAgeFrom,c=(async()=>{i&&await n.updateTimestamp(a.url),await n.expireEntries()})();try{e.waitUntil(c)}catch{}return r?s:null}_isResponseDateFresh(e){if("last-used"===this._config.maxAgeFrom)return!0;let t=Date.now();if(!this._config.maxAgeSeconds)return!0;let a=this._getDateHeaderTimestamp(e);return null===a||a>=t-1e3*this._config.maxAgeSeconds}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;let t=new Date(e.headers.get("date")).getTime();return Number.isNaN(t)?null:t}async cacheDidUpdate({cacheName:e,request:t}){let a=this._getCacheExpiration(e);await a.updateTimestamp(t.url),await a.expireEntries()}async deleteCacheAndMetadata(){for(let[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}};let ef=async(e,t)=>{try{if(206===t.status)return t;let a=e.headers.get("range");if(!a)throw new o("no-range-header");let s=(e=>{let t=e.trim().toLowerCase();if(!t.startsWith("bytes="))throw new o("unit-must-be-bytes",{normalizedRangeHeader:t});if(t.includes(","))throw new o("single-range-only",{normalizedRangeHeader:t});let a=/(\d*)-(\d*)/.exec(t);if(!a||!(a[1]||a[2]))throw new o("invalid-range-values",{normalizedRangeHeader:t});return{start:""===a[1]?void 0:Number(a[1]),end:""===a[2]?void 0:Number(a[2])}})(a),r=await t.blob(),n=((e,t,a)=>{let s,r,n=e.size;if(a&&a>n||t&&t<0)throw new o("range-not-satisfiable",{size:n,end:a,start:t});return void 0!==t&&void 0!==a?(s=t,r=a+1):void 0!==t&&void 0===a?(s=t,r=n):void 0!==a&&void 0===t&&(s=n-a,r=n),{start:s,end:r}})(r,s.start,s.end),i=r.slice(n.start,n.end),c=i.size,l=new Response(i,{status:206,statusText:"Partial Content",headers:t.headers});return l.headers.set("Content-Length",String(c)),l.headers.set("Content-Range",\`bytes ${n.start}-${n.end-1}/${r.size}\`),l}catch(e){return new Response("",{status:416,statusText:"Range Not Satisfiable"})}};var eg=class{cachedResponseWillBeUsed=async({request:e,cachedResponse:t})=>t&&e.headers.has("range")?await ef(e,t):t},ew=class extends Y{async _handle(e,t){let a,s=await t.cacheMatch(e);if(s);else try{s=await t.fetchAndCachePut(e)}catch(e){e instanceof Error&&(a=e)}if(!s)throw new o("no-response",{url:e.url,error:a});return s}},ep=class extends Y{constructor(e={}){super(e),this.plugins.some(e=>"cacheWillUpdate"in e)||this.plugins.unshift(z)}async _handle(e,t){let a,s=t.fetchAndCachePut(e).catch(()=>{});t.waitUntil(s);let r=await t.cacheMatch(e);if(r);else try{r=await s}catch(e){e instanceof Error&&(a=e)}if(!r)throw new o("no-response",{url:e.url,error:a});return r}};let ey={rscPrefetch:"pages-rsc-prefetch",rsc:"pages-rsc",html:"pages"},e_=[{matcher:/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,handler:new ew({cacheName:"google-fonts-webfonts",plugins:[new em({maxEntries:4,maxAgeSeconds:31536e3,maxAgeFrom:"last-used"})]})},{matcher:/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,handler:new ep({cacheName:"google-fonts-stylesheets",plugins:[new em({maxEntries:4,maxAgeSeconds:604800,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,handler:new ep({cacheName:"static-font-assets",plugins:[new em({maxEntries:4,maxAgeSeconds:604800,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,handler:new ep({cacheName:"static-image-assets",plugins:[new em({maxEntries:64,maxAgeSeconds:2592e3,maxAgeFrom:"last-used"})]})},{matcher:/\/_next\/static.+\.js$/i,handler:new ew({cacheName:"next-static-js-assets",plugins:[new em({maxEntries:64,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\/_next\/image\?url=.+$/i,handler:new ep({cacheName:"next-image",plugins:[new em({maxEntries:64,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:mp3|wav|ogg)$/i,handler:new ew({cacheName:"static-audio-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"}),new eg]})},{matcher:/\.(?:mp4|webm)$/i,handler:new ew({cacheName:"static-video-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"}),new eg]})},{matcher:/\.(?:js)$/i,handler:new ep({cacheName:"static-js-assets",plugins:[new em({maxEntries:48,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:css|less)$/i,handler:new ep({cacheName:"static-style-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\/_next\/data\/.+\/.+\.json$/i,handler:new Z({cacheName:"next-data",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\.(?:json|xml|csv)$/i,handler:new Z({cacheName:"static-data-assets",plugins:[new em({maxEntries:32,maxAgeSeconds:86400,maxAgeFrom:"last-used"})]})},{matcher:/\/api\/auth\/.*/,handler:new ee({networkTimeoutSeconds:10})},{matcher:({sameOrigin:e,url:{pathname:t}})=>e&&t.startsWith("/api/"),method:"GET",handler:new Z({cacheName:"apis",plugins:[new em({maxEntries:16,maxAgeSeconds:86400,maxAgeFrom:"last-used"})],networkTimeoutSeconds:10})},{matcher:({request:e,url:{pathname:t},sameOrigin:a})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&a&&!t.startsWith("/api/"),handler:new Z({cacheName:ey.rscPrefetch,plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({request:e,url:{pathname:t},sameOrigin:a})=>"1"===e.headers.get("RSC")&&a&&!t.startsWith("/api/"),handler:new Z({cacheName:ey.rsc,plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({request:e,url:{pathname:t},sameOrigin:a})=>e.headers.get("Content-Type")?.includes("text/html")&&a&&!t.startsWith("/api/"),handler:new Z({cacheName:ey.html,plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({url:{pathname:e},sameOrigin:t})=>t&&!e.startsWith("/api/"),handler:new Z({cacheName:"others",plugins:[new em({maxEntries:32,maxAgeSeconds:86400})]})},{matcher:({sameOrigin:e})=>!e,handler:new Z({cacheName:"cross-origin",plugins:[new em({maxEntries:32,maxAgeSeconds:3600})],networkTimeoutSeconds:10})},{matcher:/.*/i,method:"GET",handler:new ee}],ex=async(e,t,a)=>{let s=t.map((e,t)=>({index:t,item:e})),r=async e=>{let t=[];for(;;){let r=s.pop();if(!r)return e(t);let n=await a(r.item);t.push({result:n,index:r.index})}},n=Array.from({length:e},()=>new Promise(r));return(await Promise.all(n)).flat().sort((e,t)=>e.index<t.index?-1:1).map(e=>e.result)};var ev=class{_precacheController;constructor({precacheController:e}){this._precacheController=e}cacheKeyWillBeUsed=async({request:e,params:t})=>{let a=t?.cacheKey||this._precacheController.getCacheKeyForURL(e.url);return a?new Request(a,{headers:e.headers}):e}},eb=class{_installAndActiveListenersAdded;_concurrentPrecaching;_strategy;_urlsToCacheKeys=new Map;_urlsToCacheModes=new Map;_cacheKeysToIntegrities=new Map;constructor({cacheName:e,plugins:t=[],fallbackToNetwork:a=!0,concurrentPrecaching:s=1}={}){this._concurrentPrecaching=s,this._strategy=new es({cacheName:c.getPrecacheName(e),plugins:[...t,new ev({precacheController:this})],fallbackToNetwork:a}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){let t=[];for(let a of e){"string"==typeof a?t.push(a):a&&!a.integrity&&void 0===a.revision&&t.push(a.url);let{cacheKey:e,url:s}=ec(a),r="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(s)&&this._urlsToCacheKeys.get(s)!==e)throw new o("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(s),secondEntry:e});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==a.integrity)throw new o("add-to-cache-list-conflicting-integrities",{url:s});this._cacheKeysToIntegrities.set(e,a.integrity)}this._urlsToCacheKeys.set(s,e),this._urlsToCacheModes.set(s,r),t.length>0&&console.warn(\`Serwist is precaching URLs without revision info: ${t.join(", ")}`
- [public/sw.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/public/sw.js:2): `This is generally NOT safe. Learn more at https://bit.ly/wb-precache\`)}}install(e){return p(e,async()=>{let t=new eo;this.strategy.plugins.push(t),await ex(this._concurrentPrecaching,Array.from(this._urlsToCacheKeys.entries()),async([t,a])=>{let s=this._cacheKeysToIntegrities.get(a),r=this._urlsToCacheModes.get(t),n=new Request(t,{integrity:s,cache:r,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({event:e,request:n,url:new URL(n.url),params:{cacheKey:a}}))});let{updatedURLs:a,notUpdatedURLs:s}=t;return{updatedURLs:a,notUpdatedURLs:s}})}activate(e){return p(e,async()=>{let e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),a=new Set(this._urlsToCacheKeys.values()),s=[];for(let r of t)a.has(r.url)||(await e.delete(r),s.push(r.url));return{deletedCacheRequests:s}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){let t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){let t=e instanceof Request?e.url:e,a=this.getCacheKeyForURL(t);if(a)return(await self.caches.open(this.strategy.cacheName)).match(a)}createHandlerBoundToURL(e){let t=this.getCacheKeyForURL(e);if(!t)throw new o("non-precached-url",{url:e});return a=>(a.request=new Request(e),a.params={cacheKey:t,...a.params},this.strategy.handle(a))}};let eE=()=>(s||(s=new eb),s);var eR=class extends ea{constructor(e,t){super(({request:a})=>{let s=e.getURLsToCacheKeys();for(let r of en(a.url,t)){let t=s.get(r);if(t)return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}},e.strategy)}},eq=class{_routes;_defaultHandlerMap;_fetchListenerHandler=null;_cacheListenerHandler=null;_catchHandler;constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){this._fetchListenerHandler||(this._fetchListenerHandler=e=>{let{request:t}=e,a=this.handleRequest({request:t,event:e});a&&e.respondWith(a)},self.addEventListener("fetch",this._fetchListenerHandler))}removeFetchListener(){this._fetchListenerHandler&&(self.removeEventListener("fetch",this._fetchListenerHandler),this._fetchListenerHandler=null)}addCacheListener(){this._cacheListenerHandler||(this._cacheListenerHandler=e=>{if(e.data&&"CACHE_URLS"===e.data.type){let{payload:t}=e.data,a=Promise.all(t.urlsToCache.map(t=>{"string"==typeof t&&(t=[t]);let a=new Request(...t);return this.handleRequest({request:a,event:e})}));e.waitUntil(a),e.ports?.[0]&&a.then(()=>e.ports[0].postMessage(!0))}},self.addEventListener("message",this._cacheListenerHandler))}removeCacheListener(){this._cacheListenerHandler&&self.removeEventListener("message",this._cacheListenerHandler)}handleRequest({request:e,event:t}){let a,s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;let r=s.origin===location.origin,{params:n,route:i}=this.findMatchingRoute({event:t,request:e,sameOrigin:r,url:s}),c=i?.handler,o=e.method;if(!c&&this._defaultHandlerMap.has(o)&&(c=this._defaultHandlerMap.get(o)),!c)return;try{a=c.handle({url:s,request:e,event:t,params:n})}catch(e){a=Promise.reject(e)}let l=i?.catchHandler;return a instanceof Promise&&(this._catchHandler||l)&&(a=a.catch(async a=>{if(l)try{return await l.handle({url:s,request:e,event:t,params:n})}catch(e){e instanceof Error&&(a=e)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw a})),a}findMatchingRoute({url:e,sameOrigin:t,request:a,event:s}){for(let r of this._routes.get(a.method)||[]){let n,i=r.match({url:e,sameOrigin:t,request:a,event:s});if(i)return Array.isArray(n=i)&&0===n.length||i.constructor===Object&&0===Object.keys(i).length?n=void 0:"boolean"==typeof i&&(n=void 0),{route:r,params:n}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,et(e))}setCatchHandler(e){this._catchHandler=et(e)}registerCapture(e,t,a){let s=((e,t,a)=>{if("string"==typeof e){let s=new URL(e,location.href);return new ea(({url:e})=>e.href===s.href,t,a)}if(e instanceof RegExp)return new ei(e,t,a);if("function"==typeof e)return new ea(e,t,a);if(e instanceof ea)return e;throw new o("unsupported-route-type",{moduleName:"serwist",funcName:"parseRoute",paramName:"capture"})})(e,t,a);return this.registerRoute(s),s}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new o("unregister-route-but-not-found-with-method",{method:e.method});let t=this._routes.get(e.method).indexOf(e);if(t>-1)this._routes.get(e.method).splice(t,1);else throw new o("unregister-route-route-not-registered")}};let eS=()=>(r||((r=new eq).addFetchListener(),r.addCacheListener()),r),eD=(e,t,a)=>eS().registerCapture(e,t,a);var eC=class{_fallbackUrls;_precacheController;constructor({fallbackUrls:e,precacheController:t}){this._fallbackUrls=e,this._precacheController=t||eE()}async handlerDidError(e){for(let t of this._fallbackUrls)if("string"==typeof t){let e=await this._precacheController.matchPrecache(t);if(void 0!==e)return e}else if(t.matcher(e)){let e=await this._precacheController.matchPrecache(t.url);if(void 0!==e)return e}}};let eN=/^\/(\w+\/)?collect/,eL=({router:e=eS(),cacheName:t,...a}={})=>{let s=c.getGoogleAnalyticsName(t),r=new V("serwist-google-analytics",{maxRetentionTime:2880,onSync:(e=>async({queue:t})=>{let a;for(;a=await t.shiftRequest();){let{request:s,timestamp:r}=a,n=new URL(s.url);try{let t="POST"===s.method?new URLSearchParams(await s.clone().text()):n.searchParams,a=r-(Number(t.get("qt"))||0),i=Date.now()-a;if(t.set("qt",String(i)),e.parameterOverrides)for(let a of Object.keys(e.parameterOverrides)){let s=e.parameterOverrides[a];t.set(a,s)}"function"==typeof e.hitFilter&&e.hitFilter.call(null,t),await fetch(new Request(n.origin+n.pathname,{body:t.toString(),method:"POST",mode:"cors",credentials:"omit",headers:{"Content-Type":"text/plain"}}))}catch(e){throw await t.unshiftRequest(a),e}}})(a)});for(let t of[new ea(({url:e})=>"www.googletagmanager.com"===e.hostname&&"/gtm.js"===e.pathname,new Z({cacheName:s}),"GET"),new ea(({url:e})=>"www.google-analytics.com"===e.hostname&&"/analytics.js"===e.pathname,new Z({cacheName:s}),"GET"),new ea(({url:e})=>"www.googletagmanager.com"===e.hostname&&"/gtag/js"===e.pathname,new Z({cacheName:s}),"GET"),...(e=>{let t=({url:e})=>"www.google-analytics.com"===e.hostname&&eN.test(e.pathname),a=new ee({plugins:[e]});return[new ea(t,a,"GET"),new ea(t,a,"POST")]})(r)])e.registerRoute(t)};(({precacheController:e=eE(),router:t=eS(),precacheEntries:a,precacheOptions:s,cleanupOutdatedCaches:r,navigateFallback:n,navigateFallbackAllowlist:i,navigateFallbackDenylist:o,skipWaiting:l,importScripts:h,navigationPreload:u=!1,cacheId:d,clientsClaim:m=!1,runtimeCaching:f,offlineAnalyticsConfig:g,disableDevLogs:p=!1,fallbacks:y})=>{h&&h.length>0&&self.importScripts(...h),u&&self.registration?.navigationPreload&&self.addEventListener("activate",e=>{e.waitUntil(self.registration.navigationPreload.enable().then(()=>{}))}),void 0!==d&&c.updateDetails({prefix:d}),l?self.skipWaiting():self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),m&&self.addEventListener("activate",()=>self.clients.claim()),(({precacheController:e=eE(),router:t=eS(),precacheEntries:a,precacheOptions:s,cleanupOutdatedCaches:r=!1,navigateFallback:n,navigateFallbackAllowlist:i,navigateFallbackDenylist:o})=>{a&&a.length>0&&(e.precache(a),t.registerRoute(new eR(e,s)),r&&self.addEventListener("activate",e=>{e.waitUntil(w(c.getPrecacheName(void 0)).then(e=>{}))}),n&&t.registerRoute(new er(eE().createHandlerBoundToURL(n),{allowlist:i,denylist:o})))})({precacheController:e,router:t,precacheEntries:a,precacheOptions:s,cleanupOutdatedCaches:r,navigateFallback:n,navigateFallbackAllowlist:i,navigateFallbackDenylist:o}),void 0!==f&&(void 0!==y&&(f=(({precacheController:e=eE(),router:t=eS(),runtimeCaching:a,entries:s,precacheOptions:r})=>{e.precache(s),t.registerRoute(new eR(e,r));let n=new eC({fallbackUrls:s});return a.forEach(e=>{e.handler instanceof Y&&!e.handler.plugins.some(e=>"handlerDidError"in e)&&e.handler.plugins.push(n)}),a})({precacheController:e,router:t,runtimeCaching:f,entries:y.entries,precacheOptions:s})),((...e)=>{for(let t of e)eD(t.matcher,t.handler,t.method)})(...f)),void 0!==g&&("boolean"==typeof g?g&&eL({router:t}):eL({...g,router:t})),p&&(self.__WB_DISABLE_DEV_LOGS=!0)})({precacheEntries:[{'revision':'623b32321486592f52bda9e30ea5ebea','url':'/_next/static/9S9loD8x9ibLu6bI6ene3/_buildManifest.js'},{'revision':'b6652df95db52feb4daf4eca35380933','url':'/_next/static/9S9loD8x9ibLu6bI6ene3/_ssgManifest.js'},{'revision':null,'url':'/_next/static/chunks/1020-5ff7b4f777a9e136.js'},{'revision':null,'url':'/_next/static/chunks/1431.51ef738101c21ea0.js'},{'revision':null,'url':'/_next/static/chunks/1646.a93085a0445ba909.js'},{'revision':null,'url':'/_next/static/chunks/1697-06cd08d15b6a0995.js'},{'revision':null,'url':'/_next/static/chunks/2002-67e987608bfa78f1.js'},{'revision':null,'url':'/_next/static/chunks/2619-04bc32f026a0d946.js'},{'revision':null,'url':'/_next/static/chunks/2888-0d8a8c8d145e66b8.js'},{'revision':null,'url':'/_next/static/chunks/2968-acc89585f20bea2c.js'},{'revision':null,'url':'/_next/static/chunks/3589.59f27e8dc8750dca.js'},{'revision':null,'url':'/_next/static/chunks/3618-2e527ebb6089cf17.js'},{'revision':null,'url':'/_next/static/chunks/4909-1f5c586e3e84e0a5.js'},{'revision':null,'url':'/_next/static/chunks/4bd1b696-100b9d70ed4e49c1.js'},{'revision':null,'url':'/_next/static/chunks/5098-0bc6036abd41ee66.js'},{'revision':null,'url':'/_next/static/chunks/5139.e4ff9cc3669129ed.js'},{'revision':null,'url':'/_next/static/chunks/5420-f91358e5f7e6687d.js'},{'revision':null,'url':'/_next/static/chunks/7554-882dcbfa2164f7b0.js'},{'revision':null,'url':'/_next/static/chunks/8055-37171439b1d20baa.js'},{'revision':null,'url':'/_next/static/chunks/8242-28bfceca61fdd34b.js'},{'revision':null,'url':'/_next/static/chunks/8977-7f212576213da9be.js'},{'revision':null,'url':'/_next/static/chunks/9951-86ea5a104991b4be.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/403/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/journal/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/journal/page-0b22ef7535600d61.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/material/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/material/page-27eca84001b7da7f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/product-purchase/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/product-purchase/page-c7a5b26b6310608d.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/purchase/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/purchase/page-d01f660b00180d86.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/sales/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/accounts/sales/page-848b23eb641e5c63.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/attendance/page-499fd85f00e01665.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/catalog/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/catalog/page-bebf67f45085b182.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/clients/%5Bid%5D/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/clients/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/clients/page-5f65ff8c667ad051.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/colors/page-5f65ff8c667ad051.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/credentials/page-f8e0c7348d6a893d.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/critical-levels/page-499fd85f00e01665.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/employees/page-5f65ff8c667ad051.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/looms/page-5f65ff8c667ad051.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/permissions/%5Bid%5D/page-1955ae436e707db9.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/permissions/page-e66530762ae7555d.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/products/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/products/page-14f5644b6936bfef.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/raw-materials/page-5f65ff8c667ad051.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/admin/reset/page-388ec9a2bcbf81fe.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/client/catalog/page-5a2201b9acc108dd.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/client/dashboard/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/client/layout-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/dashboard/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/dashboard/page-a4a2ad96f1f0380e.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/consumption/page-e724f8603566f4c4.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/production/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/production/page-be7196f076a959df.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/stock/%5Bid%5D/page-d1c834fbb1a740e3.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/stock/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/fabric/stock/page-249955207d1ff629.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/consumption/page-29f89e25be515d24.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/production/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/production/page-eb87c9223016ea4e.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/stock/%5Bid%5D/page-b79ec3651bea9c38.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/stock/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/finishing/stock/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/consumption/page-62fb92fbd78bd7b3.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/production/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/production/page-7f54be204e9be0bb.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/stock/%5Bid%5D/page-f2f50a59949e2625.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/stock/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/lamination/stock/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/layout-595b8b6927a2f5cb.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/consumption/page-43526610c2a4795f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/production/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/production/page-4bfc56a2287e47bb.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/stock/%5Bid%5D/page-74a31ce7079a208d.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/stock/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/offset-printing/stock/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/page-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/accounts/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/accounts/page-c8c9ff7581d40f07.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/balance-sheet/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/balance-sheet/page-b331f13d77c78931.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/closing-stock/page-5b80245e51a1e12f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/opening-balance/page-597dc253decc4e5c.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/page-79cb075f5843bc7f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/profit-loss/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/profit-loss/page-647edb19b8b7a692.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/sales-confirmation/page-5cfe217341b08972.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/reports/stock/page-8f6bfb3917c7b86e.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/rolls/%5Bid%5D/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/rolls/%5Bid%5D/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/rolls/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/consumption/page-5b0f2437a8a93e87.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/production/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/production/page-0cd903acfc57b772.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/stock/%5Bid%5D/page-7414af66d6cf5519.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/stock/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/roto-printing/stock/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/sales/client-orders/page-3a2922842a78a41c.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/sales/delivery-entry/%5Bid%5D/page-74e4c1d8daecfe9f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/sales/delivery-entry/page-6ae95ccd5f189d69.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/sales/loading-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(app)/sales/order-confirmation/page-8ed1de11d55a6cfc.js'},{'revision':null,'url':'/_next/static/chunks/app/(auth)/login/page-100d3f2f36e58914.js'},{'revision':null,'url':'/_next/static/chunks/app/(auth)/reset-password/page-fdfc9120438d5729.js'},{'revision':null,'url':'/_next/static/chunks/app/(portal)/layout-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/app/(portal)/portal/catalog/page-886735c531e3ac6a.js'},{'revision':null,'url':'/_next/static/chunks/app/(portal)/portal/dashboard/page-7708363f0bc05520.js'},{'revision':null,'url':'/_next/static/chunks/app/_not-found/page-f1aac92804bc871d.js'},{'revision':null,'url':'/_next/static/chunks/app/layout-64f615344c22a375.js'},{'revision':null,'url':'/_next/static/chunks/app/manifest.webmanifest/route-7dfdf188cf71bd2f.js'},{'revision':null,'url':'/_next/static/chunks/framework-32492dd9c4fc5870.js'},{'revision':null,'url':'/_next/static/chunks/main-9a194f53e64bb328.js'},{'revision':null,'url':'/_next/static/chunks/main-app-47c905d08f0ff666.js'},{'revision':null,'url':'/_next/static/chunks/pages/_app-e8b861c87f6f033c.js'},{'revision':null,'url':'/_next/static/chunks/pages/_error-c8f84f7bd11d43d4.js'},{'revision':'846118c33b2c0e922d7b3a7676f81f6f','url':'/_next/static/chunks/polyfills-42372ed130431b0a.js'},{'revision':null,'url':'/_next/static/chunks/webpack-6c1142457ce95edb.js'},{'revision':null,'url':'/_next/static/css/ef3a256e6f42218f.css'},{'revision':'9dda5cfc9a46f256d0e131bb535e46f8','url':'/_next/static/media/19cfc7226ec3afaa-s.woff2'},{'revision':'4e2553027f1d60eff32898367dd4d541','url':'/_next/static/media/21350d82a1f187e9-s.woff2'},{'revision':'01ba6c2a184b8cba08b0d57167664d75','url':'/_next/static/media/8e9860b6e62d6359-s.woff2'},{'revision':'9e494903d6b0ffec1a1e14d34427d44d','url':'/_next/static/media/ba9851c3c22cd980-s.woff2'},{'revision':'027a89e9ab733a145db70f09b8a18b42','url':'/_next/static/media/c5fe6dc8356a8c31-s.woff2'},{'revision':'d54db44de5ccb18886ece2fda72bdfe0','url':'/_next/static/media/df0a9ae256c0569c-s.woff2'},{'revision':'65850a373e258f1c897a2b3d75eb74de','url':'/_next/static/media/e4af272ccee01ff0-s.p.woff2'},{'revision':'7ff707cde001ee7286b4224898f59dc9','url':'/rk-global-circular.png'},{'revision':'bf3457cbfe4c8ce1f9823f5abf08364c','url':'/rk-global-logo.svg'}],skipWaiting:!0,clientsClaim:!0,navigationPreload:!0,runtimeCaching:e_})})();`
- [README.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/README.md:3): `Production-ready starter ERP for a polymer fabric manufacturing company.`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:42): `console.log("Deleting all records from loom_production_entries...");`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:44): `.from("loom_production_entries")`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:49): `console.error("Failed to delete production entries:", prodError);`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:51): `console.log("Successfully cleared loom_production_entries.");`
- [scratch/check_offset_rolls.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_offset_rolls.mjs:23): `.select("id, roll_id, offset_type, weight_kg, status")`
- [scratch/check-has-permission.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-has-permission.mjs:25): `// 5. 1542cd6: fix: post sales confirmation balance adjustments directly to main customer instead of separate alias a/c`
- [scratch/check-new-roll-lpe.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-new-roll-lpe.mjs:31): `.select("*, loom_production_entries(*)")`
- [scratch/check-policies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-policies.mjs:18): `// Let's check if there are other drop/create policies in any later migrations (like 018_complete_erp_schema.sql or 031_new_production_tables.sql).`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:40): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:72): `.select("id, roll_number, meters, weight, fabric_type_id, loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)")`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:11): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:42): `.select("id, roll_number, meters, weight, fabric_type_id, loom_production_entries(gross_weight, core_weight, net_weight, net_meters, average_meter_weight)")`
- [scratch/check-sales-order-items-keys.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-items-keys.mjs:11): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/check-sales-order-items-keys.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-items-keys.mjs:22): `console.log("Total orders returned:", data?.length);`
- [scratch/check-sales-order.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order.mjs:11): `.select("id, order_number, status, selected_roll_ids, sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/clear_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear_stock.mjs:20): `async function clearStock() {`
- [scratch/clear_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear_stock.mjs:29): `console.log("Starting stock clearance...");`
- [scratch/clear_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear_stock.mjs:42): `console.log("Stock clearance complete!");`
- [scratch/clear_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear_stock.mjs:45): `clearStock().catch(console.error);`
- [scratch/create-placeholders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-placeholders.mjs:5): `{ file: 'src/app/(app)/fabric/consumption/page.tsx', title: 'Fabric Consumption', desc: 'Manage fabric consumption logs.' },`

_… 2407 additional calculation lines in source._

