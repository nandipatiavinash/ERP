-- Migration: Add product purchase tracking columns to stock tables and purchase items table.

-- 1. Add supplier_roll_id to stock tables
ALTER TABLE public.fabric_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.lamination_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.offset_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.roto_film_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.roto_metallic_rolls ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;
ALTER TABLE public.finishing_bundles ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT;

-- 2. Add enhancement columns to product_purchase_items
ALTER TABLE public.product_purchase_items
  ADD COLUMN IF NOT EXISTS supplier_roll_id TEXT,
  ADD COLUMN IF NOT EXISTS source_roll_id UUID,
  ADD COLUMN IF NOT EXISTS film_type TEXT,
  ADD COLUMN IF NOT EXISTS is_metallic BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS color_id UUID REFERENCES public.roto_colors(id);
