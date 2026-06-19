-- Migration: Use Production Entry Serial Number as Roll/Stock Number
-- Relates to: Using the serial number generated on production entry as the universal roll/stock number.

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

-- Align existing fabric rolls with their production entry serial number
UPDATE public.fabric_rolls fr
SET roll_number = lpe.serial_number
FROM public.loom_production_entries lpe
WHERE fr.production_entry_id = lpe.id;
