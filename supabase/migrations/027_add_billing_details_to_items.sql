-- Migration: Add billing details to sales order items and sales orders for Sales Confirmation Report
ALTER TABLE public.sales_order_items ADD COLUMN IF NOT EXISTS price NUMERIC(12,2) DEFAULT 0;
ALTER TABLE public.sales_orders ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 18;
