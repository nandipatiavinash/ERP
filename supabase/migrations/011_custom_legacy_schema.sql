-- Migration: Custom Legacy ERP Schema and Performance Optimizations

-- 1. Categorization and Critical Levels for Raw Materials
ALTER TABLE public.raw_materials 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS critical_level NUMERIC DEFAULT 0;

-- Update existing raw materials to Fabric department by default
UPDATE public.raw_materials SET department = 'Fabric' WHERE department IS NULL;

-- 2. Custom Client/Account Fields
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS alias TEXT,
ADD COLUMN IF NOT EXISTS is_internal BOOLEAN DEFAULT false;

-- 3. Create Roto Printing Products Table
CREATE TABLE IF NOT EXISTS public.roto_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    width NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    num_cylinders INTEGER NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);

-- Enable RLS for roto_products
ALTER TABLE public.roto_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_products" ON public.roto_products;
CREATE POLICY "Allow read access to authenticated users on roto_products" 
ON public.roto_products FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write access to admins on roto_products" ON public.roto_products;
CREATE POLICY "Allow write access to admins on roto_products" 
ON public.roto_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));

-- 4. Create Offset Printing Products Table
CREATE TABLE IF NOT EXISTS public.offset_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    width NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);

-- Enable RLS for offset_products
ALTER TABLE public.offset_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on offset_products" ON public.offset_products;
CREATE POLICY "Allow read access to authenticated users on offset_products" 
ON public.offset_products FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write access to admins on offset_products" ON public.offset_products;
CREATE POLICY "Allow write access to admins on offset_products" 
ON public.offset_products FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));

-- 5. Create Roto Colors Table
CREATE TABLE IF NOT EXISTS public.roto_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    color_name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);

-- Enable RLS for roto_colors
ALTER TABLE public.roto_colors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_colors" ON public.roto_colors;
CREATE POLICY "Allow read access to authenticated users on roto_colors" 
ON public.roto_colors FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write access to admins on roto_colors" ON public.roto_colors;
CREATE POLICY "Allow write access to admins on roto_colors" 
ON public.roto_colors FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT u.id FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE r.name = 'admin'));

-- 6. Create Sales Order Items Table (Multi-Item Order Support)
CREATE TABLE IF NOT EXISTS public.sales_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID NOT NULL REFERENCES public.sales_orders(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    product_id UUID NOT NULL,
    quantity NUMERIC NOT NULL,
    selected_roll_ids UUID[] DEFAULT '{}'::uuid[]
);

-- Enable RLS for sales_order_items
ALTER TABLE public.sales_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to authenticated users on sales_order_items" ON public.sales_order_items;
CREATE POLICY "Allow read access to authenticated users on sales_order_items" 
ON public.sales_order_items FOR SELECT TO authenticated
USING (
  public.has_permission('sales.view')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
);

DROP POLICY IF EXISTS "Allow write access to authenticated users on sales_order_items" ON public.sales_order_items;
CREATE POLICY "Allow write access to authenticated users on sales_order_items" 
ON public.sales_order_items FOR ALL TO authenticated
USING (
  public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.is_admin()
);

-- 7. Alter sales_orders to support optional columns during transition
ALTER TABLE public.sales_orders 
ALTER COLUMN fabric_type_id DROP NOT NULL,
ALTER COLUMN quantity_meters DROP NOT NULL,
ALTER COLUMN rate DROP NOT NULL,
ALTER COLUMN total_amount DROP NOT NULL;

-- 8. Complete Deletion of Audit Logs
DROP TABLE IF EXISTS public.audit_logs CASCADE;

-- 9. Performance Index Additions (under 3ms queries)
CREATE INDEX IF NOT EXISTS idx_rolls_type_status ON public.fabric_rolls(fabric_type_id, status) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_production_entry_date ON public.loom_production_entries(entry_date) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON public.sales_orders(customer_id) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date) WHERE (deleted_at IS NULL);
