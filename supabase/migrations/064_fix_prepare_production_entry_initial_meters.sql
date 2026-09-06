-- Migration 064: Fix prepare_production_entry trigger to honor submitted initial_meters for fabric production managers & operators
-- Prevents check_end_meters constraint violations when loom meters are reset or overridden.

CREATE OR REPLACE FUNCTION public.prepare_production_entry()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  last_end numeric(12,2);
  loom_lock uuid;
  latest_serial integer;
  is_privileged boolean;
BEGIN
  is_privileged := public.is_admin() OR public.has_permission('admin.looms') OR public.has_permission('fabric.production');

  SELECT id INTO loom_lock
  FROM public.looms
  WHERE id = new.loom_id
  FOR UPDATE;

  IF new.serial_number IS NULL OR new.serial_number = '' THEN
    SELECT COALESCE(
      (
        SELECT CAST(lpe.serial_number AS integer)
        FROM public.loom_production_entries lpe
        WHERE lpe.fabric_type_id = new.fabric_type_id
          AND lpe.deleted_at IS NULL
          AND lpe.serial_number ~ '^[0-9]+$'
        ORDER BY lpe.created_at DESC
        LIMIT 1
      ),
      0
    ) INTO latest_serial;

    IF latest_serial >= 500 THEN
      new.serial_number := '1';
    ELSE
      new.serial_number := (latest_serial + 1)::text;
    END IF;
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

  IF tg_op = 'INSERT' THEN
    IF new.initial_meters IS NULL THEN
      new.initial_meters := COALESCE(last_end, 0);
    END IF;
    new.initial_meter_overridden := new.initial_meters IS DISTINCT FROM COALESCE(last_end, 0);
  ELSIF tg_op = 'UPDATE' THEN
    IF new.initial_meters IS NULL THEN
      new.initial_meters := old.initial_meters;
    END IF;
    new.initial_meter_overridden := new.initial_meters IS DISTINCT FROM COALESCE(last_end, 0);
  END IF;

  RETURN new;
END;
$function$;
