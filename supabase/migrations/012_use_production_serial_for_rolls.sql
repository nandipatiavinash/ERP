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
