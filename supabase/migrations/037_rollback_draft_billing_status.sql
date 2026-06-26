-- Migration: Roll back any active draft billing states to standard confirmed status
UPDATE public.sales_orders
SET is_draft_billing = false
WHERE is_draft_billing = true;
