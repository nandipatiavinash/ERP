-- Migration: Create Material Sales Table and Triggers for Stock Adjustment

-- 1. Create material_sales table
CREATE TABLE IF NOT EXISTS public.material_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    bill_number TEXT NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('raw_material', 'waste')),
    department TEXT, -- null if waste
    raw_material_id UUID REFERENCES public.raw_materials(id) ON DELETE CASCADE, -- null if waste
    quantity NUMERIC(12,3) NOT NULL CHECK (quantity > 0),
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    inc_gst BOOLEAN NOT NULL DEFAULT FALSE,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    journal_no TEXT, -- Reference to the accounts_journal entry group
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.material_sales ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to permitted users on material_sales" ON public.material_sales;
DROP POLICY IF EXISTS "Allow write access to permitted users on material_sales" ON public.material_sales;

-- 4. Create RLS Policies
CREATE POLICY "Allow read access to permitted users on material_sales"
ON public.material_sales FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.view')
);

CREATE POLICY "Allow write access to permitted users on material_sales"
ON public.material_sales FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
);

-- 5. Trigger to automatically adjust raw materials stock
CREATE OR REPLACE FUNCTION public.apply_material_sales_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    IF NEW.deleted_at IS NULL AND NEW.type = 'raw_material' AND NEW.raw_material_id IS NOT NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock - NEW.quantity,
          updated_at = now(),
          updated_by = NEW.updated_by
      WHERE id = NEW.raw_material_id;
    END IF;
  ELSIF tg_op = 'UPDATE' THEN
    -- If soft-deleted
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      IF OLD.type = 'raw_material' AND OLD.raw_material_id IS NOT NULL THEN
        UPDATE public.raw_materials
        SET current_stock = current_stock + OLD.quantity,
            updated_at = now(),
            updated_by = NEW.updated_by
        WHERE id = OLD.raw_material_id;
      END IF;
    -- If restored
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      IF NEW.type = 'raw_material' AND NEW.raw_material_id IS NOT NULL THEN
        UPDATE public.raw_materials
        SET current_stock = current_stock - NEW.quantity,
            updated_at = now(),
            updated_by = NEW.updated_by
        WHERE id = NEW.raw_material_id;
      END IF;
    -- Normal update
    ELSIF NEW.deleted_at IS NULL THEN
      IF OLD.raw_material_id = NEW.raw_material_id THEN
        IF NEW.type = 'raw_material' AND NEW.raw_material_id IS NOT NULL THEN
          UPDATE public.raw_materials
          SET current_stock = current_stock + OLD.quantity - NEW.quantity,
              updated_at = now(),
              updated_by = NEW.updated_by
          WHERE id = NEW.raw_material_id;
        END IF;
      ELSE
        IF OLD.type = 'raw_material' AND OLD.raw_material_id IS NOT NULL THEN
          UPDATE public.raw_materials
          SET current_stock = current_stock + OLD.quantity,
              updated_at = now(),
              updated_by = OLD.updated_by
          WHERE id = OLD.raw_material_id;
        END IF;
        IF NEW.type = 'raw_material' AND NEW.raw_material_id IS NOT NULL THEN
          UPDATE public.raw_materials
          SET current_stock = current_stock - NEW.quantity,
              updated_at = now(),
              updated_by = NEW.updated_by
          WHERE id = NEW.raw_material_id;
        END IF;
      END IF;
    END IF;
  ELSIF tg_op = 'DELETE' THEN
    IF OLD.deleted_at IS NULL AND OLD.type = 'raw_material' AND OLD.raw_material_id IS NOT NULL THEN
      UPDATE public.raw_materials
      SET current_stock = current_stock + OLD.quantity,
          updated_at = now(),
          updated_by = OLD.updated_by
      WHERE id = OLD.raw_material_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS material_sales_updates_stock ON public.material_sales;
CREATE TRIGGER material_sales_updates_stock
AFTER INSERT OR UPDATE OR DELETE ON public.material_sales
FOR EACH ROW EXECUTE FUNCTION public.apply_material_sales_stock();
