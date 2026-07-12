-- Migration 049: Add selling_price column to finishing_products
-- This allows Finished Bags to have a defined selling price in the catalogue.

ALTER TABLE public.finishing_products 
  ADD COLUMN IF NOT EXISTS selling_price NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (selling_price >= 0);
