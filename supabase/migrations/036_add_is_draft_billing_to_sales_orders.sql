-- Migration: Add is_draft_billing flag to sales_orders for staged billing flow
ALTER TABLE public.sales_orders
ADD COLUMN IF NOT EXISTS is_draft_billing BOOLEAN NOT NULL DEFAULT FALSE;
