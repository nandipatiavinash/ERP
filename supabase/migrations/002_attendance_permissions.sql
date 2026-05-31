alter table public.roles drop constraint if exists roles_name_check;

alter table public.employees
  add column if not exists joining_date date,
  add column if not exists shift_start time not null default '09:00',
  add column if not exists shift_end time not null default '18:00';

alter table public.attendance
  add column if not exists check_in_at timestamptz,
  add column if not exists check_out_at timestamptz,
  add column if not exists working_hours numeric(8,2) not null default 0 check (working_hours >= 0),
  add column if not exists overtime_hours numeric(8,2) not null default 0 check (overtime_hours >= 0);

update public.attendance
set check_in_at = case
    when check_in is not null then (attendance_date + check_in)::timestamptz
    else check_in_at
  end,
  check_out_at = case
    when check_out is not null then (attendance_date + check_out)::timestamptz
    else check_out_at
  end
where check_in_at is null or check_out_at is null;

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

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create index if not exists idx_permissions_module_action on public.permissions (module, action) where deleted_at is null;
create index if not exists idx_role_permissions_permission on public.role_permissions (permission_id);
create index if not exists idx_attendance_employee_date on public.attendance (employee_id, attendance_date desc) where deleted_at is null;

drop trigger if exists touch_permissions on public.permissions;
create trigger touch_permissions before update on public.permissions for each row execute function public.touch_updated_at();
drop trigger if exists audit_permissions on public.permissions;
create trigger audit_permissions after insert or update on public.permissions for each row execute function public.audit_row_change();

create or replace function public.calculate_attendance()
returns trigger
language plpgsql
as $$
declare
  employee_shift_end time;
  hours_worked numeric(8,2);
  overtime numeric(8,2);
  shift_end_at timestamptz;
begin
  if new.check_in_at is not null then
    new.check_in = new.check_in_at::time;
    new.attendance_date = new.check_in_at::date;
  end if;

  if new.check_out_at is not null then
    new.check_out = new.check_out_at::time;
  end if;

  if new.check_in_at is not null and new.check_out_at is not null then
    hours_worked = round((extract(epoch from (new.check_out_at - new.check_in_at)) / 3600)::numeric, 2);
    if hours_worked < 0 then
      hours_worked = 0;
    end if;

    select shift_end into employee_shift_end
    from public.employees
    where id = new.employee_id;

    shift_end_at = (new.attendance_date + coalesce(employee_shift_end, '18:00'::time))::timestamptz;
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

drop trigger if exists calculate_attendance_before_write on public.attendance;
create trigger calculate_attendance_before_write
before insert or update on public.attendance
for each row execute function public.calculate_attendance();

create or replace function public.has_permission(permission_key text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    join public.role_permissions rp on rp.role_id = r.id
    join public.permissions p on p.id = rp.permission_id
    where u.id = auth.uid()
      and u.status = 'active'
      and u.deleted_at is null
      and r.is_active = true
      and r.deleted_at is null
      and p.deleted_at is null
      and (p.module || '.' || p.action = permission_key)
  )
$$;

alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;

drop policy if exists "permissions readable by active users" on public.permissions;
create policy "permissions readable by active users" on public.permissions
for select using (auth.uid() is not null and deleted_at is null);

drop policy if exists "permissions admin write" on public.permissions;
create policy "permissions admin write" on public.permissions
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "role permissions readable by active users" on public.role_permissions;
create policy "role permissions readable by active users" on public.role_permissions
for select using (auth.uid() is not null);

drop policy if exists "role permissions admin write" on public.role_permissions;
create policy "role permissions admin write" on public.role_permissions
for all using (public.is_admin()) with check (public.is_admin());

insert into public.permissions (module, action, description)
values
  ('dashboard', 'view', 'View dashboard'),
  ('users', 'view', 'View users'),
  ('users', 'create', 'Create users'),
  ('users', 'edit', 'Edit users'),
  ('users', 'delete', 'Deactivate users'),
  ('roles', 'view', 'View roles'),
  ('roles', 'create', 'Create roles'),
  ('roles', 'edit', 'Edit roles'),
  ('roles', 'delete', 'Deactivate roles'),
  ('employees', 'view', 'View employees'),
  ('employees', 'create', 'Create employees'),
  ('employees', 'edit', 'Edit employees'),
  ('employees', 'delete', 'Deactivate employees'),
  ('attendance', 'view', 'View attendance'),
  ('attendance', 'create', 'Check in attendance'),
  ('attendance', 'edit', 'Check out or edit attendance'),
  ('looms', 'view', 'View looms'),
  ('looms', 'create', 'Create looms'),
  ('looms', 'edit', 'Edit looms'),
  ('looms', 'delete', 'Deactivate looms'),
  ('fabric_types', 'view', 'View fabric types'),
  ('fabric_types', 'create', 'Create fabric types'),
  ('fabric_types', 'edit', 'Edit fabric types'),
  ('fabric_types', 'delete', 'Deactivate fabric types'),
  ('raw_materials', 'view', 'View raw materials'),
  ('raw_materials', 'create', 'Create raw materials'),
  ('raw_materials', 'edit', 'Edit raw materials'),
  ('raw_materials', 'delete', 'Deactivate raw materials'),
  ('customers', 'view', 'View customers'),
  ('customers', 'create', 'Create customers'),
  ('customers', 'edit', 'Edit customers'),
  ('customers', 'delete', 'Deactivate customers'),
  ('production', 'view', 'View production'),
  ('production', 'create', 'Create production entries'),
  ('production', 'edit', 'Edit production entries'),
  ('rolls', 'view', 'View fabric rolls'),
  ('sales', 'view', 'View sales'),
  ('sales', 'create', 'Create sales orders'),
  ('sales', 'edit', 'Edit sales orders'),
  ('reports', 'view', 'View reports'),
  ('reports', 'export', 'Export reports'),
  ('audit_logs', 'view', 'View audit logs')
on conflict (module, action) do update
set description = excluded.description,
    updated_at = now();

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'admin'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on (p.module, p.action) in (
  ('dashboard', 'view'),
  ('production', 'view'),
  ('production', 'create'),
  ('production', 'edit'),
  ('rolls', 'view'),
  ('reports', 'view')
)
where r.name = 'operator'
on conflict do nothing;
