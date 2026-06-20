-- Migration: Add billing fields to sales_orders for Sales Entry workflow
ALTER TABLE public.sales_orders
ADD COLUMN IF NOT EXISTS bill_number TEXT,
ADD COLUMN IF NOT EXISTS bill_value NUMERIC(14,2);

-- Ensure "Purchase A/c" and "Sales A/c" system accounts exist
INSERT INTO public.customers (customer_name, alias, is_internal, status)
VALUES
  ('Purchase A/c', 'PURCHASE', 'profit and loss a/c', 'active'),
  ('Sales A/c', 'SALES', 'profit and loss a/c', 'active')
ON CONFLICT DO NOTHING;
