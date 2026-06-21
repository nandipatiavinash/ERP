-- 1. Indexes for product brand sorting
CREATE INDEX IF NOT EXISTS idx_roto_products_brand ON public.roto_products (brand);
CREATE INDEX IF NOT EXISTS idx_offset_products_brand ON public.offset_products (brand);

-- 2. Non-composite indexes for name/material_name sorting
CREATE INDEX IF NOT EXISTS idx_raw_materials_name ON public.raw_materials (material_name) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employees_name ON public.employees (name) WHERE deleted_at IS NULL;

-- 3. Composite index for sales order billing status & date lookups
CREATE INDEX IF NOT EXISTS idx_sales_orders_billing_status_date ON public.sales_orders (status, bill_number, order_date DESC) WHERE deleted_at IS NULL;
