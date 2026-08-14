-- Migration 057: Add Daily Waste Entries Table

CREATE TABLE IF NOT EXISTS public.daily_waste_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  plant_waste NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (plant_waste >= 0),
  bobon_waste NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (bobon_waste >= 0),
  loom_waste NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (loom_waste >= 0),
  pipe_cutting_waste NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (pipe_cutting_waste >= 0),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE public.daily_waste_entries ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_waste_unique 
  ON public.daily_waste_entries (entry_date) 
  WHERE deleted_at IS NULL;

-- Read policies
CREATE POLICY "Allow read access on daily_waste_entries"
  ON public.daily_waste_entries FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.view')
    OR public.has_permission('reports.view')
    OR public.has_permission('fabric.production')
    OR public.has_permission('fabric.daily_data')
  );

-- Write policies
CREATE POLICY "Allow write access on daily_waste_entries"
  ON public.daily_waste_entries FOR ALL TO authenticated
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
