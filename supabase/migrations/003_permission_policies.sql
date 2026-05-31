drop policy if exists "roles admin write" on public.roles;
create policy "roles permission write" on public.roles
for all
using (public.is_admin() or public.has_permission('roles.edit') or public.has_permission('roles.delete'))
with check (public.is_admin() or public.has_permission('roles.create') or public.has_permission('roles.edit'));

drop policy if exists "permissions admin write" on public.permissions;
create policy "permissions role managers write" on public.permissions
for all
using (public.is_admin() or public.has_permission('roles.edit'))
with check (public.is_admin() or public.has_permission('roles.edit'));

drop policy if exists "role permissions admin write" on public.role_permissions;
create policy "role permissions role managers write" on public.role_permissions
for all
using (public.is_admin() or public.has_permission('roles.edit'))
with check (public.is_admin() or public.has_permission('roles.edit'));

drop policy if exists "masters admin write looms" on public.looms;
create policy "looms permission write" on public.looms
for all
using (public.is_admin() or public.has_permission('looms.edit') or public.has_permission('looms.delete'))
with check (public.is_admin() or public.has_permission('looms.create') or public.has_permission('looms.edit'));

drop policy if exists "masters admin write fabric" on public.fabric_types;
create policy "fabric types permission write" on public.fabric_types
for all
using (public.is_admin() or public.has_permission('fabric_types.edit') or public.has_permission('fabric_types.delete'))
with check (public.is_admin() or public.has_permission('fabric_types.create') or public.has_permission('fabric_types.edit'));

drop policy if exists "masters admin write raw" on public.raw_materials;
create policy "raw materials permission write" on public.raw_materials
for all
using (public.is_admin() or public.has_permission('raw_materials.edit') or public.has_permission('raw_materials.delete'))
with check (public.is_admin() or public.has_permission('raw_materials.create') or public.has_permission('raw_materials.edit'));

drop policy if exists "raw purchases admin write" on public.raw_material_purchases;
create policy "raw purchases permission write" on public.raw_material_purchases
for all
using (public.is_admin() or public.has_permission('raw_materials.edit'))
with check (public.is_admin() or public.has_permission('raw_materials.edit'));

drop policy if exists "masters admin write employees" on public.employees;
create policy "employees permission write" on public.employees
for all
using (public.is_admin() or public.has_permission('employees.edit') or public.has_permission('employees.delete'))
with check (public.is_admin() or public.has_permission('employees.create') or public.has_permission('employees.edit'));

drop policy if exists "masters admin write customers" on public.customers;
create policy "customers permission write" on public.customers
for all
using (public.is_admin() or public.has_permission('customers.edit') or public.has_permission('customers.delete'))
with check (public.is_admin() or public.has_permission('customers.create') or public.has_permission('customers.edit'));

drop policy if exists "attendance admin write" on public.attendance;
create policy "attendance permission write" on public.attendance
for all
using (public.is_admin() or public.has_permission('attendance.edit'))
with check (public.is_admin() or public.has_permission('attendance.create') or public.has_permission('attendance.edit'));

drop policy if exists "sales admin write" on public.sales_orders;
create policy "sales permission write" on public.sales_orders
for all
using (public.is_admin() or public.has_permission('sales.edit'))
with check (public.is_admin() or public.has_permission('sales.create') or public.has_permission('sales.edit'));

drop policy if exists "rolls admin write" on public.fabric_rolls;
create policy "rolls permission write" on public.fabric_rolls
for all
using (public.is_admin() or public.has_permission('production.edit'))
with check (public.is_admin() or public.has_permission('production.create') or public.has_permission('production.edit'));
