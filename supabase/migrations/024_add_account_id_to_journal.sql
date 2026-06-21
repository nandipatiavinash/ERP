-- 1. Add account_id column referencing customers
ALTER TABLE public.accounts_journal
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.customers(id);

-- 2. Backpopulate account_id for existing records
UPDATE public.accounts_journal aj
SET account_id = c.id
FROM public.customers c
WHERE TRIM(LOWER(c.customer_name)) = TRIM(LOWER(aj.account_name))
   OR TRIM(LOWER(c.alias)) = TRIM(LOWER(aj.account_name))
   OR (aj.account_name = 'Purchase A/c' AND c.customer_name = 'Purchase A/c')
   OR (aj.account_name = 'Sales A/c' AND c.customer_name = 'Sales A/c');

-- 3. Create index for high availability reporting
CREATE INDEX IF NOT EXISTS idx_accounts_journal_account_id 
ON public.accounts_journal(account_id) 
WHERE deleted_at IS NULL;

-- 4. Create indexes for missing foreign keys to optimize database performance
CREATE INDEX IF NOT EXISTS idx_raw_material_purchases_material ON public.raw_material_purchases(raw_material_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_loom_production_entries_fabric ON public.loom_production_entries(fabric_type_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sales_order_items_order ON public.sales_order_items(sales_order_id);
