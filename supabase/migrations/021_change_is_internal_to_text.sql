-- Migration: Change is_internal column of customers from BOOLEAN to TEXT with account types
ALTER TABLE public.customers ALTER COLUMN is_internal DROP DEFAULT;

ALTER TABLE public.customers 
  ALTER COLUMN is_internal TYPE TEXT 
  USING (CASE WHEN is_internal = true THEN 'profit and loss a/c' ELSE 'client a/c' END);

ALTER TABLE public.customers ALTER COLUMN is_internal SET DEFAULT 'client a/c';
