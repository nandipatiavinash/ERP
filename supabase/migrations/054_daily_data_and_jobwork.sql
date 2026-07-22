-- Migration 054: Daily Data & Jobwork Updates

-- 1. Add Jobwork metrics to sales_order_items
ALTER TABLE public.sales_order_items 
  ADD COLUMN IF NOT EXISTS pp_percent NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS filler_percent NUMERIC(5,2) DEFAULT 0;

-- 2. Add priority sorting to sales_orders
ALTER TABLE public.sales_orders 
  ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- 3. Create Tape Line Entries Table
CREATE TABLE IF NOT EXISTS public.tape_line_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  tape_type TEXT NOT NULL,
  loads NUMERIC(10,2) NOT NULL CHECK (loads >= 0),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE public.tape_line_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access on tape_line_entries"
  ON public.tape_line_entries FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.view')
    OR public.has_permission('reports.view')
    OR public.has_permission('fabric.production')
  );

CREATE POLICY "Allow write access on tape_line_entries"
  ON public.tape_line_entries FOR ALL TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
  )
  WITH CHECK (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
  );

-- 4. Create Loom Shift Meters Table
CREATE TABLE IF NOT EXISTS public.loom_shift_meters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  loom_id UUID NOT NULL REFERENCES public.looms(id) ON DELETE RESTRICT,
  day_shift_meters NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (day_shift_meters >= 0),
  night_shift_meters NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (night_shift_meters >= 0),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE public.loom_shift_meters ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS idx_loom_shift_meters_unique 
  ON public.loom_shift_meters (entry_date, loom_id) 
  WHERE deleted_at IS NULL;

CREATE POLICY "Allow read access on loom_shift_meters"
  ON public.loom_shift_meters FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.view')
    OR public.has_permission('reports.view')
    OR public.has_permission('fabric.production')
  );

CREATE POLICY "Allow write access on loom_shift_meters"
  ON public.loom_shift_meters FOR ALL TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
  )
  WITH CHECK (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
  );

-- 5. Create Electricity Units Entries Table
CREATE TABLE IF NOT EXISTS public.electricity_units_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  units NUMERIC(12,2) NOT NULL CHECK (units >= 0),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE public.electricity_units_entries ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS idx_electricity_units_unique 
  ON public.electricity_units_entries (entry_date) 
  WHERE deleted_at IS NULL;

CREATE POLICY "Allow read access on electricity_units_entries"
  ON public.electricity_units_entries FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.view')
    OR public.has_permission('reports.view')
    OR public.has_permission('fabric.production')
  );

CREATE POLICY "Allow write access on electricity_units_entries"
  ON public.electricity_units_entries FOR ALL TO authenticated
  USING (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
  )
  WITH CHECK (
    public.is_admin()
    OR public.has_permission('production.edit')
    OR public.has_permission('fabric.production')
  );

-- 6. Seed Permissions and Role Mapping
INSERT INTO public.permissions (module, action, description)
VALUES ('fabric', 'daily_data', 'Manage daily data entry')
ON CONFLICT (module, action) DO NOTHING;

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'operator' AND p.module = 'fabric' AND p.action = 'daily_data'
ON CONFLICT DO NOTHING;
