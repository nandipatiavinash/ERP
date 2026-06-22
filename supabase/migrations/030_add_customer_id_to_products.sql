-- Migration: Add customer_id (client) to roto_products and offset_products

-- 1. Add customer_id to roto_products
ALTER TABLE public.roto_products
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- 2. Add customer_id to offset_products
ALTER TABLE public.offset_products
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
