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
