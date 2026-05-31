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
