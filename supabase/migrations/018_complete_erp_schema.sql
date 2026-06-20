-- Migration: Complete ERP Stage Workflows, Consumptions, Accounting Journals, and Bug Fixes

-- 1. Drop the legacy audit trigger on role_permissions (since audit_logs table was removed)
DROP TRIGGER IF EXISTS audit_role_permissions ON public.role_permissions CASCADE;
DROP FUNCTION IF EXISTS public.audit_role_permission_change() CASCADE;

-- 2. Redefine raw material purchase stock adjustment to handle soft-deletes correctly
CREATE OR REPLACE FUNCTION public.apply_raw_material_purchase()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    UPDATE public.raw_materials
    SET current_stock = current_stock + NEW.quantity,
        updated_at = now(),
        updated_by = NEW.updated_by
    WHERE id = NEW.raw_material_id;
  ELSIF tg_op = 'UPDATE' THEN
    -- If soft-deleted
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock - OLD.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = OLD.raw_material_id;
    -- If restored
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock + NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
    -- Normal update
    ELSIF NEW.deleted_at IS NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock - OLD.quantity + NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 3. Create Raw Material Consumptions Table
CREATE TABLE IF NOT EXISTS public.raw_material_consumptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consumption_date DATE NOT NULL DEFAULT CURRENT_DATE,
    raw_material_id UUID NOT NULL REFERENCES public.raw_materials(id),
    department TEXT NOT NULL,
    quantity NUMERIC(12,3) NOT NULL CHECK (quantity > 0),
    remarks TEXT,
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Enable RLS for raw_material_consumptions
ALTER TABLE public.raw_material_consumptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on raw_material_consumptions" ON public.raw_material_consumptions;
DROP POLICY IF EXISTS "Allow read access to permitted users on raw_material_consumptio" ON public.raw_material_consumptions;
CREATE POLICY "Allow read access to permitted users on raw_material_consumptions"
ON public.raw_material_consumptions FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('raw_materials.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Allow write access to permitted users on raw_material_consumptions" ON public.raw_material_consumptions;
DROP POLICY IF EXISTS "Allow write access to permitted users on raw_material_consumptio" ON public.raw_material_consumptions;
CREATE POLICY "Allow write access to permitted users on raw_material_consumptions"
ON public.raw_material_consumptions FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.is_admin()
);

-- Trigger for stock updates on consumption changes
CREATE OR REPLACE FUNCTION public.apply_raw_material_consumption()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    UPDATE public.raw_materials
    SET current_stock = current_stock - NEW.quantity,
        updated_at = now(),
        updated_by = NEW.updated_by
    WHERE id = NEW.raw_material_id;
  ELSIF tg_op = 'UPDATE' THEN
    -- If soft-deleted
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock + OLD.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = OLD.raw_material_id;
    -- If restored
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock - NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
    -- Normal update
    ELSIF NEW.deleted_at IS NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock + OLD.quantity - NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS raw_consumption_updates_stock ON public.raw_material_consumptions;
CREATE TRIGGER raw_consumption_updates_stock
AFTER INSERT OR UPDATE ON public.raw_material_consumptions
FOR EACH ROW EXECUTE FUNCTION public.apply_raw_material_consumption();


-- 4. Create Stage Production Entries Table
CREATE TABLE IF NOT EXISTS public.stage_production_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    roll_id UUID NOT NULL REFERENCES public.fabric_rolls(id),
    stage TEXT NOT NULL CHECK (stage IN ('roto_printing', 'lamination', 'offset_printing', 'finishing')),
    product_id TEXT,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    remarks TEXT,
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Enable RLS for stage_production_entries
ALTER TABLE public.stage_production_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on stage_production_entries" ON public.stage_production_entries;
DROP POLICY IF EXISTS "Allow read access to permitted users on stage_production_entrie" ON public.stage_production_entries;
CREATE POLICY "Allow read access to permitted users on stage_production_entries"
ON public.stage_production_entries FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Allow write access to permitted users on stage_production_entries" ON public.stage_production_entries;
DROP POLICY IF EXISTS "Allow write access to permitted users on stage_production_entrie" ON public.stage_production_entries;
CREATE POLICY "Allow write access to permitted users on stage_production_entries"
ON public.stage_production_entries FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);

-- Trigger to progress fabric roll stage
CREATE OR REPLACE FUNCTION public.apply_stage_production()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    UPDATE public.fabric_rolls
    SET current_stage = NEW.stage,
        updated_at = now(),
        updated_by = NEW.updated_by
    WHERE id = NEW.roll_id;
  ELSIF tg_op = 'UPDATE' THEN
    -- If soft-deleted
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      -- Revert roll current_stage back to previous logical stage or 'loom'
      UPDATE public.fabric_rolls
      SET current_stage = CASE
            WHEN NEW.stage = 'finishing' THEN 'offset_printing'
            WHEN NEW.stage = 'offset_printing' THEN 'lamination'
            WHEN NEW.stage = 'lamination' THEN 'roto_printing'
            WHEN NEW.stage = 'roto_printing' THEN 'loom'
            ELSE 'loom'
          END,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.roll_id;
    -- Restored or updated
    ELSE
      UPDATE public.fabric_rolls
      SET current_stage = NEW.stage,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.roll_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stage_production_updates_roll ON public.stage_production_entries;
CREATE TRIGGER stage_production_updates_roll
AFTER INSERT OR UPDATE ON public.stage_production_entries
FOR EACH ROW EXECUTE FUNCTION public.apply_stage_production();


-- 5. Create Accounting Journal Entries Table
CREATE TABLE IF NOT EXISTS public.accounts_journal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    account_name TEXT NOT NULL,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('debit', 'credit')),
    amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
    description TEXT,
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Enable RLS for accounts_journal
ALTER TABLE public.accounts_journal ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to permitted users on accounts_journal" ON public.accounts_journal;
DROP POLICY IF EXISTS "Allow read access to permitted users on accounts_journa" ON public.accounts_journal;
CREATE POLICY "Allow read access to permitted users on accounts_journal"
ON public.accounts_journal FOR SELECT TO authenticated
USING (
  public.has_permission('sales.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Allow write access to permitted users on accounts_journal" ON public.accounts_journal;
DROP POLICY IF EXISTS "Allow write access to permitted users on accounts_journa" ON public.accounts_journal;
CREATE POLICY "Allow write access to permitted users on accounts_journal"
ON public.accounts_journal FOR ALL TO authenticated
USING (
  public.has_permission('sales.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('sales.edit')
  OR public.is_admin()
);
