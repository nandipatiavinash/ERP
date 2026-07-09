-- Migration: Fix RBAC triggers and policies for Loom Production Entry (initial meters override) and Sales Order / Fabric Rolls SELECT access.

-- 1. RE-DEFINE TRIGGER FUNCTION TO ALLOW admin.looms PERMISSION HOLDERS TO SET/EDIT INITIAL METERS
CREATE OR REPLACE FUNCTION public.prepare_production_entry()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  last_end numeric(12,2);
  loom_lock uuid;
  serial_num integer;
  is_privileged boolean;
BEGIN
  -- Check if user is admin or holds the 'admin.looms' permission
  is_privileged := public.is_admin() OR public.has_permission('admin.looms');

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
$$;


-- 2. UPDATE LOOM PRODUCTION UPDATE POLICY TO ALLOW admin.looms PERMISSION HOLDERS TO EDIT
DROP POLICY IF EXISTS "production update permitted" ON public.loom_production_entries;
CREATE POLICY "production update permitted" ON public.loom_production_entries
FOR UPDATE USING (
  public.is_admin()
  OR public.has_permission('admin.looms')
  OR (
    (public.has_permission('production.edit') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
    AND created_at >= now() - interval '12 hours'
  )
) WITH CHECK (
  public.is_admin()
  OR public.has_permission('admin.looms')
  OR (
    (public.has_permission('production.edit') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
    AND created_at >= now() - interval '12 hours'
  )
);


-- 3. UPDATE LOOM PRODUCTION SELECT POLICY TO INCLUDE fabric.production PERMISSION
DROP POLICY IF EXISTS "production read permitted users" ON public.loom_production_entries;
CREATE POLICY "production read permitted users" ON public.loom_production_entries
FOR SELECT TO authenticated USING (
  deleted_at is null
  and (
    public.is_admin()
    or public.has_permission('production.view')
    or public.has_permission('fabric.production')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
  )
);


-- 4. UPDATE SALES ORDERS SELECT POLICY TO INCLUDE ORDER CONFIRMATION & DELIVERY ENTRY
DROP POLICY IF EXISTS "sales read permitted users" ON public.sales_orders;
CREATE POLICY "sales read permitted users" ON public.sales_orders
FOR SELECT TO authenticated USING (
  deleted_at is null
  and (
    public.is_admin()
    or public.has_permission('sales.view')
    or public.has_permission('sales.order_confirmation')
    or public.has_permission('sales.delivery_entry')
    or public.has_permission('reports.view')
  )
);


-- 5. UPDATE SALES ORDER ITEMS SELECT POLICY TO INCLUDE ORDER CONFIRMATION & DELIVERY ENTRY
DROP POLICY IF EXISTS "Allow read access to permitted users on sales_order_items" ON public.sales_order_items;
DROP POLICY IF EXISTS "sales_order_items read permitted" ON public.sales_order_items;
CREATE POLICY "sales_order_items read permitted" ON public.sales_order_items
FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.view')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
);


-- 6. UPDATE FABRIC ROLLS SELECT POLICY TO INCLUDE DELIVERY ENTRY, PRODUCTION & STOCK
DROP POLICY IF EXISTS "rolls read permitted users" ON public.fabric_rolls;
CREATE POLICY "rolls read permitted users" ON public.fabric_rolls
FOR SELECT TO authenticated USING (
  deleted_at is null
  and (
    public.is_admin()
    or public.has_permission('rolls.view')
    or public.has_permission('sales.view')
    or public.has_permission('reports.view')
    or public.has_permission('dashboard.view')
    or public.has_permission('sales.delivery_entry')
    or public.has_permission('fabric.production')
    or public.has_permission('fabric.stock')
    or public.has_permission('roto_printing.production')
    or public.has_permission('lamination.production')
    or public.has_permission('offset_printing.production')
    or public.has_permission('finishing.production')
  )
);
