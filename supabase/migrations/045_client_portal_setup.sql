-- Migration 045: Setup Client Portal & Product Isolation

-- 1. Create client role if not exists
INSERT INTO public.roles (name, description)
VALUES ('client', 'External client portal access')
ON CONFLICT (name) DO NOTHING;

-- 2. Link users to customers
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- 3. Link fabric_types to customers and add product image URLs
ALTER TABLE public.fabric_types
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 4. Link finishing_products to customers and add product image / details
ALTER TABLE public.finishing_products
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS dimensions TEXT;

-- 5. Helper function to check if the current user is an internal staff member (not a client)
CREATE OR REPLACE FUNCTION public.is_internal_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u
    JOIN public.roles r ON r.id = u.role_id
    WHERE u.id = auth.uid()
      AND r.name != 'client'
      AND u.status = 'active'
      AND u.deleted_at IS NULL
      AND r.is_active = true
      AND r.deleted_at IS NULL
  )
$$;

-- 6. Row Level Security (RLS) Policies for Client Isolation
-- Clients can only read their own user record
DROP POLICY IF EXISTS "client_read_self" ON public.users;
CREATE POLICY "client_read_self" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_internal_staff());

-- Clients can only read/write their own sales orders
DROP POLICY IF EXISTS "client_sales_orders_policy" ON public.sales_orders;
CREATE POLICY "client_sales_orders_policy" ON public.sales_orders
  FOR ALL TO authenticated
  USING (
    customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    OR created_by = auth.uid()
  );

-- Clients can only read/write items belonging to their own sales orders
DROP POLICY IF EXISTS "client_sales_order_items_policy" ON public.sales_order_items;
CREATE POLICY "client_sales_order_items_policy" ON public.sales_order_items
  FOR ALL TO authenticated
  USING (
    sales_order_id IN (
      SELECT id FROM public.sales_orders
      WHERE customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    )
  );

-- Clients can only read fabric types that are General or belong to them
DROP POLICY IF EXISTS "fabric_types_read_policy" ON public.fabric_types;
CREATE POLICY "fabric_types_read_policy" ON public.fabric_types
  FOR SELECT TO authenticated
  USING (
    customer_id IS NULL
    OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    OR public.is_internal_staff()
  );

-- Clients can only read finishing products that are General or belong to them
DROP POLICY IF EXISTS "finishing_products_read_policy" ON public.finishing_products;
CREATE POLICY "finishing_products_read_policy" ON public.finishing_products
  FOR SELECT TO authenticated
  USING (
    customer_id IS NULL
    OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    OR public.is_internal_staff()
  );
