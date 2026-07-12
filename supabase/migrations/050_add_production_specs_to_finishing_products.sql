-- Migration 050: Add default production specifications to finishing_products
-- This allows catalog models to pre-define fabric materials, lamination, and print specs.

ALTER TABLE public.finishing_products 
  ADD COLUMN IF NOT EXISTS fabric_type_id UUID REFERENCES public.fabric_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS roto_product_id UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS offset_product_id UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lamination_type TEXT DEFAULT 'PLAIN',
  ADD COLUMN IF NOT EXISTS offset_type TEXT DEFAULT 'none';
