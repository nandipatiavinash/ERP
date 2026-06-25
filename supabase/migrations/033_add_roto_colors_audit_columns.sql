-- Migration: Add audit columns to public.roto_colors for model compatibility and consistent history tracking

-- 1. Alter table to add audit columns
ALTER TABLE public.roto_colors
  ADD COLUMN created_by UUID REFERENCES public.users(id),
  ADD COLUMN updated_by UUID REFERENCES public.users(id),
  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN deleted_at TIMESTAMPTZ;

-- 2. Create trigger to automatically touch updated_at
CREATE TRIGGER touch_roto_colors
  BEFORE UPDATE ON public.roto_colors
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- 3. Drop legacy write policy and replace with standard permission policy
DROP POLICY IF EXISTS "Allow write access to admins on roto_colors" ON public.roto_colors;

CREATE POLICY "roto_colors permission write" ON public.roto_colors
  FOR ALL
  TO authenticated
  USING (
    public.is_admin() 
    OR public.has_permission('roto_colors.edit') 
    OR public.has_permission('roto_colors.delete')
  )
  WITH CHECK (
    public.is_admin() 
    OR public.has_permission('roto_colors.create') 
    OR public.has_permission('roto_colors.edit')
  );
