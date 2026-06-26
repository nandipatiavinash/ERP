-- Migration 038: Create roto_product_colors table to link roto products to multiple color images

CREATE TABLE IF NOT EXISTS public.roto_product_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roto_product_id UUID NOT NULL REFERENCES public.roto_products(id) ON DELETE CASCADE,
    color_id UUID NOT NULL REFERENCES public.roto_colors(id) ON DELETE CASCADE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (roto_product_id, color_id)
);

-- Enable RLS for roto_product_colors
ALTER TABLE public.roto_product_colors ENABLE ROW LEVEL SECURITY;

-- Add policies
DROP POLICY IF EXISTS "Allow read access to authenticated users on roto_product_colors" ON public.roto_product_colors;
CREATE POLICY "Allow read access to authenticated users on roto_product_colors" 
ON public.roto_product_colors FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow write access to admins on roto_product_colors" ON public.roto_product_colors;
CREATE POLICY "Allow write access to admins on roto_product_colors" 
ON public.roto_product_colors FOR ALL TO authenticated 
USING (auth.uid() IN (
    SELECT u.id FROM public.users u 
    JOIN public.roles r ON u.role_id = r.id 
    WHERE r.name = 'admin'
));
