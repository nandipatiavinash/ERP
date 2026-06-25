-- Migration: Add index and function for scalable next serial number calculation
-- Relates to: Optimizing page.tsx loading performance for high volume of production entries

-- 1. Create a composite index to allow instant lookup of the latest entry per fabric type
CREATE INDEX IF NOT EXISTS idx_lpe_fabric_created 
ON public.loom_production_entries (fabric_type_id, created_at DESC) 
WHERE deleted_at IS NULL;

-- 2. Define the RPC function to compute next serial numbers
CREATE OR REPLACE FUNCTION public.get_next_serial_numbers()
RETURNS TABLE (
  fabric_type_id uuid,
  next_serial integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ft.id AS fabric_type_id,
    COALESCE(
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
    ) + 1 AS next_serial
  FROM public.fabric_types ft
  WHERE ft.deleted_at IS NULL;
END;
$$;
