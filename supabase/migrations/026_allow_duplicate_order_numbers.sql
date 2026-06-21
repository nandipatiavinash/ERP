-- Migration: Allow duplicate order numbers in sales_orders table
ALTER TABLE public.sales_orders DROP CONSTRAINT IF EXISTS sales_orders_order_number_key;
