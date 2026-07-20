-- Migration: Reset fabric roll serial number to 1 after reaching upper limit of 500
-- Relates to: Fabric production serial numbering requirement

-- 1. Drop unique constraint index so serial numbers can cycle (1..500)
DROP INDEX IF EXISTS public.uq_lpe_fabric_type_serial CASCADE;

-- 2. Update prepare_production_entry trigger function
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
  is_privileged := public.is_admin() OR public.has_permission('admin.looms');

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

  IF tg_op = 'INSERT' AND NOT is_privileged THEN
    new.initial_meters := COALESCE(last_end, 0);
    new.initial_meter_overridden := false;
  ELSIF tg_op = 'INSERT' AND is_privileged THEN
    IF new.initial_meters IS NULL THEN
      new.initial_meters := COALESCE(last_end, 0);
    ELSE
      new.initial_meter_overridden := new.initial_meters IS DISTINCT FROM COALESCE(last_end, 0);
    END IF;
  ELSIF tg_op = 'UPDATE' AND NOT is_privileged THEN
    new.initial_meters := old.initial_meters;
    new.initial_meter_overridden := old.initial_meter_overridden;
  END IF;

  RETURN new;
END;
$function$;

-- 3. Update get_next_serial_numbers RPC function
CREATE OR REPLACE FUNCTION public.get_next_serial_numbers()
RETURNS TABLE(fabric_type_id uuid, next_serial integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ft.id AS fabric_type_id,
    CASE 
      WHEN COALESCE(
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
      ) >= 500 THEN 1
      ELSE COALESCE(
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
      ) + 1
    END AS next_serial
  FROM public.fabric_types ft
  WHERE ft.deleted_at IS NULL;
END;
$function$;
