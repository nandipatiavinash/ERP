-- Rename the old generated column
ALTER TABLE public.raw_material_purchases RENAME COLUMN total_amount TO total_amount_old;

-- Add a new regular column
ALTER TABLE public.raw_material_purchases ADD COLUMN total_amount numeric(14,2);

-- Copy existing data to preserve history
UPDATE public.raw_material_purchases SET total_amount = COALESCE(total_amount_old, quantity * rate);

-- Drop the old generated column
ALTER TABLE public.raw_material_purchases DROP COLUMN total_amount_old;

-- Drop and recreate write policy to include accounts.purchase permission
DROP POLICY IF EXISTS "raw purchases permission write" ON public.raw_material_purchases;
CREATE POLICY "raw purchases permission write" ON public.raw_material_purchases
FOR ALL
USING (
  public.is_admin()
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('accounts.purchase')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('accounts.purchase')
);

-- Drop and recreate select policy to include accounts.purchase permission
DROP POLICY IF EXISTS "raw purchases read permitted users" ON public.raw_material_purchases;
CREATE POLICY "raw purchases read permitted users" ON public.raw_material_purchases
FOR SELECT
USING (
  deleted_at IS NULL
  AND (
    public.is_admin()
    OR public.has_permission('raw_materials.view')
    OR public.has_permission('reports.view')
    OR public.has_permission('accounts.purchase')
  )
);
