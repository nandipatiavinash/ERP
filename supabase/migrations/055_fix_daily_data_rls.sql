-- Migration 055: Fix Daily Data RLS Policies

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access on tape_line_entries" ON public.tape_line_entries;
DROP POLICY IF EXISTS "Allow write access on tape_line_entries" ON public.tape_line_entries;

DROP POLICY IF EXISTS "Allow read access on loom_shift_meters" ON public.loom_shift_meters;
DROP POLICY IF EXISTS "Allow write access on loom_shift_meters" ON public.loom_shift_meters;

DROP POLICY IF EXISTS "Allow read access on electricity_units_entries" ON public.electricity_units_entries;
DROP POLICY IF EXISTS "Allow write access on electricity_units_entries" ON public.electricity_units_entries;

-- Recreate policies with fabric.daily_data permission

-- 1. tape_line_entries
CREATE POLICY "Allow read access on tape_line_entries"
  ON public.tape_line_entries FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.view')
    OR public.has_permission('reports.view')
    OR public.has_permission('fabric.production')
    OR public.has_permission('fabric.daily_data')
  );

CREATE POLICY "Allow write access on tape_line_entries"
  ON public.tape_line_entries FOR ALL TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
    OR public.has_permission('fabric.daily_data')
  )
  WITH CHECK (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
    OR public.has_permission('fabric.daily_data')
  );

-- 2. loom_shift_meters
CREATE POLICY "Allow read access on loom_shift_meters"
  ON public.loom_shift_meters FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.view')
    OR public.has_permission('reports.view')
    OR public.has_permission('fabric.production')
    OR public.has_permission('fabric.daily_data')
  );

CREATE POLICY "Allow write access on loom_shift_meters"
  ON public.loom_shift_meters FOR ALL TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
    OR public.has_permission('fabric.daily_data')
  )
  WITH CHECK (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
    OR public.has_permission('fabric.daily_data')
  );

-- 3. electricity_units_entries
CREATE POLICY "Allow read access on electricity_units_entries"
  ON public.electricity_units_entries FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.view')
    OR public.has_permission('reports.view')
    OR public.has_permission('fabric.production')
    OR public.has_permission('fabric.daily_data')
  );

CREATE POLICY "Allow write access on electricity_units_entries"
  ON public.electricity_units_entries FOR ALL TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
    OR public.has_permission('fabric.daily_data')
  )
  WITH CHECK (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
    OR public.has_permission('fabric.daily_data')
  );
