-- Add color_id to sales_order_items
ALTER TABLE public.sales_order_items 
ADD COLUMN IF NOT EXISTS color_id UUID REFERENCES public.roto_colors(id);
