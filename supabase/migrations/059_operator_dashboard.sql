-- Migration 059: Create operator_dashboard_status table to track closed order items

CREATE TABLE IF NOT EXISTS public.operator_dashboard_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_order_item_id UUID NOT NULL REFERENCES public.sales_order_items(id) ON DELETE CASCADE,
  department TEXT NOT NULL, -- 'roto', 'lamination', 'offset'
  is_closed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (sales_order_item_id, department)
);

-- Enable RLS
ALTER TABLE public.operator_dashboard_status ENABLE ROW LEVEL SECURITY;

-- Create policy for reading and updating status
CREATE POLICY "operator_dashboard_status_all" ON public.operator_dashboard_status
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
