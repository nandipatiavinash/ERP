-- 1. Create Product Purchases Header Table
CREATE TABLE IF NOT EXISTS public.product_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_date DATE NOT NULL,
  supplier_name TEXT NOT NULL,
  bill_number TEXT NOT NULL,
  total_amount NUMERIC(15, 2) NOT NULL,
  remarks TEXT,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. Create Product Purchases Items Table
CREATE TABLE IF NOT EXISTS public.product_purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES public.product_purchases(id) ON DELETE CASCADE,
  department TEXT NOT NULL, -- 'fabric', 'roto-printing', 'lamination', 'offset-printing', 'finishing'
  product_id UUID, -- links to finishing_products, lamination_products, roto_products, offset_products
  fabric_type_id UUID REFERENCES public.fabric_types(id),
  lamination_type TEXT,
  offset_type TEXT,
  quantity NUMERIC(12, 2) NOT NULL, -- meters / bags
  weight NUMERIC(12, 2) NOT NULL, -- kg
  rate NUMERIC(12, 2) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- 3. Enable Row-Level Security
ALTER TABLE public.product_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_purchase_items ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies
DROP POLICY IF EXISTS "Allow read access to authenticated on product_purchases" ON public.product_purchases;
CREATE POLICY "Allow read access to authenticated on product_purchases" 
  ON public.product_purchases FOR SELECT TO authenticated USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Allow write access to authenticated on product_purchases" ON public.product_purchases;
CREATE POLICY "Allow write access to authenticated on product_purchases" 
  ON public.product_purchases FOR ALL TO authenticated;

DROP POLICY IF EXISTS "Allow read access to authenticated on product_purchase_items" ON public.product_purchase_items;
CREATE POLICY "Allow read access to authenticated on product_purchase_items" 
  ON public.product_purchase_items FOR SELECT TO authenticated USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Allow write access to authenticated on product_purchase_items" ON public.product_purchase_items;
CREATE POLICY "Allow write access to authenticated on product_purchase_items" 
  ON public.product_purchase_items FOR ALL TO authenticated;
