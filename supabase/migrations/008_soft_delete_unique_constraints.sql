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
