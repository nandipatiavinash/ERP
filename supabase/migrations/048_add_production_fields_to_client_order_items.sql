-- Migration 048: Add Production Fields to client_order_items
-- This allows clients to specify lamination, printing, film types, etc., when ordering.

ALTER TABLE public.client_order_items 
  ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lamination_type TEXT,
  ADD COLUMN IF NOT EXISTS offset_type TEXT;
