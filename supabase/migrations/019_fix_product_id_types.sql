-- Migration: Fix product_id column types for non-UUID product identifiers
-- Lamination and Finishing departments use string IDs (e.g., 'lam-film-25', 'finished-bags-28')
-- instead of UUID references, so we need TEXT columns.

-- Fix sales_order_items.product_id: UUID -> TEXT
ALTER TABLE public.sales_order_items ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;
