-- Migration 047: Dedicated Client Orders Tables
-- These are separate from internal sales_orders to avoid schema conflicts.

-- 1. Client Orders Header
CREATE TABLE IF NOT EXISTS public.client_orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number  TEXT NOT NULL UNIQUE,
  customer_id   UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  order_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled')),
  notes         TEXT,
  created_by    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- 2. Client Order Items
CREATE TABLE IF NOT EXISTS public.client_order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES public.client_orders(id) ON DELETE CASCADE,
  item_type       TEXT NOT NULL CHECK (item_type IN ('fabric', 'finishing')),
  fabric_type_id  UUID REFERENCES public.fabric_types(id) ON DELETE SET NULL,
  finishing_product_id UUID REFERENCES public.finishing_products(id) ON DELETE SET NULL,
  quantity        NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  unit            TEXT NOT NULL DEFAULT 'pcs',
  unit_price      NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Auto-increment updated_at
CREATE OR REPLACE FUNCTION public.touch_client_orders_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS client_orders_touch_updated_at ON public.client_orders;
CREATE TRIGGER client_orders_touch_updated_at
  BEFORE UPDATE ON public.client_orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_client_orders_updated_at();

-- 4. RLS
ALTER TABLE public.client_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_order_items ENABLE ROW LEVEL SECURITY;

-- Admin / internal staff can read all
DROP POLICY IF EXISTS "client_orders_internal_all" ON public.client_orders;
CREATE POLICY "client_orders_internal_all" ON public.client_orders
  FOR ALL TO authenticated
  USING (public.is_internal_staff() OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid()))
  WITH CHECK (public.is_internal_staff() OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "client_order_items_internal_all" ON public.client_order_items;
CREATE POLICY "client_order_items_internal_all" ON public.client_order_items
  FOR ALL TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.client_orders
      WHERE public.is_internal_staff()
        OR customer_id = (SELECT customer_id FROM public.users WHERE id = auth.uid())
    )
  );

-- 5. Next order number function for client orders
CREATE OR REPLACE FUNCTION public.next_client_order_no()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year  TEXT := to_char(now() AT TIME ZONE 'Asia/Kolkata', 'YY');
  v_seq   INT;
BEGIN
  SELECT COUNT(*) + 1 INTO v_seq
  FROM public.client_orders
  WHERE order_number LIKE 'CO-' || v_year || '-%'
    AND deleted_at IS NULL;
  RETURN 'CO-' || v_year || '-' || LPAD(v_seq::TEXT, 4, '0');
END;
$$;
