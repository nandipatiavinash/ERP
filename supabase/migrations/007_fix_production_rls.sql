-- Migration: Fix RLS policies to support dynamic permissions for all production stages and custom roles.

-- 1. LOOM PRODUCTION ENTRIES
DROP POLICY IF EXISTS "production insert admin operator" ON public.loom_production_entries;
DROP POLICY IF EXISTS "production update admin anytime operator own 12h" ON public.loom_production_entries;

CREATE POLICY "production insert permitted" ON public.loom_production_entries
FOR INSERT WITH CHECK (
  public.is_admin()
  OR (
    (public.has_permission('production.create') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
  )
);

CREATE POLICY "production update permitted" ON public.loom_production_entries
FOR UPDATE USING (
  public.is_admin()
  OR (
    (public.has_permission('production.edit') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
    AND created_at >= now() - interval '12 hours'
  )
) WITH CHECK (
  public.is_admin()
  OR (
    (public.has_permission('production.edit') OR public.has_permission('fabric.production') OR public.is_operator())
    AND created_by = auth.uid()
    AND created_at >= now() - interval '12 hours'
  )
);


-- 2. STAGE PRODUCTION ENTRIES
DROP POLICY IF EXISTS "Allow write access to permitted users on stage_production_entries" ON public.stage_production_entries;
DROP POLICY IF EXISTS "Allow write access to permitted users on stage_production_entrie" ON public.stage_production_entries;

CREATE POLICY "stage_production write permitted" ON public.stage_production_entries
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
  OR public.has_permission('lamination.production')
  OR public.has_permission('offset_printing.production')
  OR public.has_permission('finishing.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
  OR public.has_permission('lamination.production')
  OR public.has_permission('offset_printing.production')
  OR public.has_permission('finishing.production')
);


-- 3. ROTO FILM ROLLS
DROP POLICY IF EXISTS "Allow write access to permitted users on roto_film_rolls" ON public.roto_film_rolls;

CREATE POLICY "roto_film_rolls write permitted" ON public.roto_film_rolls
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
);


-- 4. ROTO METALLIC ROLLS
DROP POLICY IF EXISTS "Allow write access to permitted users on roto_metallic_rolls" ON public.roto_metallic_rolls;

CREATE POLICY "roto_metallic_rolls write permitted" ON public.roto_metallic_rolls
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('roto_printing.production')
);


-- 5. LAMINATION ROLLS
DROP POLICY IF EXISTS "Allow write access to permitted users on lamination_rolls" ON public.lamination_rolls;

CREATE POLICY "lamination_rolls write permitted" ON public.lamination_rolls
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('lamination.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('lamination.production')
);


-- 6. OFFSET ROLLS
DROP POLICY IF EXISTS "Allow write access to permitted users on offset_rolls" ON public.offset_rolls;

CREATE POLICY "offset_rolls write permitted" ON public.offset_rolls
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('offset_printing.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('offset_printing.production')
);


-- 7. FINISHING BUNDLES
DROP POLICY IF EXISTS "Allow write access to permitted users on finishing_bundles" ON public.finishing_bundles;

CREATE POLICY "finishing_bundles write permitted" ON public.finishing_bundles
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('finishing.production')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('finishing.production')
);
