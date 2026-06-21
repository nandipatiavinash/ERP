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
