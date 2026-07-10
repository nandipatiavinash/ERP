-- Migration: Add dynamic products for lamination and finishing, rename finishing types, add stock roll associations, and add detail columns to sales order items.

-- 1. CREATE LAMINATION PRODUCTS MASTER TABLE
CREATE TABLE IF NOT EXISTS public.lamination_products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);

ALTER TABLE public.lamination_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lamination_products read authenticated"
ON public.lamination_products FOR SELECT TO authenticated
USING (deleted_at IS NULL);

CREATE POLICY "lamination_products write admin"
ON public.lamination_products FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 2. CREATE FINISHING PRODUCTS MASTER TABLE
CREATE TABLE IF NOT EXISTS public.finishing_products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);

ALTER TABLE public.finishing_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "finishing_products read authenticated"
ON public.finishing_products FOR SELECT TO authenticated
USING (deleted_at IS NULL);

CREATE POLICY "finishing_products write admin"
ON public.finishing_products FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 3. SEED DEFAULT LAMINATION AND FINISHING PRODUCTS
INSERT INTO public.lamination_products (name)
VALUES ('Laminated Film 2.5 mil'), ('Laminated Film 3.0 mil')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.finishing_products (name)
VALUES ('Finished Bags W-28'), ('Finished Bags W-32')
ON CONFLICT (name) DO NOTHING;


-- 4. SEED SYSTEM PERMISSIONS FOR THESE NEW MASTER TABLES
INSERT INTO public.permissions (module, action, description)
VALUES 
  ('lamination_products', 'create', 'Create lamination products'),
  ('lamination_products', 'edit', 'Edit lamination products'),
  ('lamination_products', 'delete', 'Deactivate lamination products'),
  ('finishing_products', 'create', 'Create finishing products'),
  ('finishing_products', 'edit', 'Edit finishing products'),
  ('finishing_products', 'delete', 'Deactivate finishing products')
ON CONFLICT (module, action) DO NOTHING;


-- 5. UPDATE LAMINATION ROLLS TABLE
ALTER TABLE public.lamination_rolls
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.lamination_products(id) ON DELETE RESTRICT;


-- 6. UPDATE FINISHING BUNDLES TABLE (RENAME finish_type, ADD stock roll links and product_id)
ALTER TABLE public.finishing_bundles
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.finishing_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'voided')),
ADD COLUMN IF NOT EXISTS source_fabric_roll_id UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS source_offset_roll_id UUID REFERENCES public.offset_rolls(id) ON DELETE RESTRICT;

-- Drop old check constraint on finish_type and replace it
ALTER TABLE public.finishing_bundles DROP CONSTRAINT IF EXISTS finishing_bundles_finish_type_check;

-- Migrate existing records in finishing_bundles to new type names
UPDATE public.finishing_bundles SET finish_type = 'FABRIC' WHERE finish_type = 'PLAIN';
UPDATE public.finishing_bundles SET finish_type = 'LAMINATION' WHERE finish_type = 'LAMINATED';
UPDATE public.finishing_bundles SET finish_type = 'OFFSET' WHERE finish_type = 'NW';

-- Add new CHECK constraint
ALTER TABLE public.finishing_bundles ADD CONSTRAINT finishing_bundles_finish_type_check CHECK (finish_type IN ('FABRIC', 'LAMINATION', 'OFFSET'));


-- 7. ALTER SALES ORDER ITEMS TABLE (ADD detailed columns for department-specific specs)
ALTER TABLE public.sales_order_items
ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE RESTRICT,
ADD COLUMN IF NOT EXISTS film_type TEXT,
ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS lamination_type TEXT,
ADD COLUMN IF NOT EXISTS offset_type TEXT;
