-- Add is_jobwork tag to raw_material_purchases
ALTER TABLE public.raw_material_purchases
  ADD COLUMN IF NOT EXISTS is_jobwork BOOLEAN NOT NULL DEFAULT FALSE;

-- Add is_jobwork tag to sales_orders
ALTER TABLE public.sales_orders
  ADD COLUMN IF NOT EXISTS is_jobwork BOOLEAN NOT NULL DEFAULT FALSE;
