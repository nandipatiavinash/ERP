-- Migration: Relax SELECT policies on all master tables and add plain text password storage to users profile

-- 1. Add password column to users profile
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;

-- 2. Relax SELECT policies on looms
DROP POLICY IF EXISTS "looms read permitted users" ON public.looms;
DROP POLICY IF EXISTS "masters read active users looms" ON public.looms;
CREATE POLICY "looms read authenticated" ON public.looms FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 3. Relax SELECT policies on fabric_types
DROP POLICY IF EXISTS "fabric types read permitted users" ON public.fabric_types;
DROP POLICY IF EXISTS "masters read active users fabric" ON public.fabric_types;
CREATE POLICY "fabric types read authenticated" ON public.fabric_types FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 4. Relax SELECT policies on raw_materials
DROP POLICY IF EXISTS "raw materials read permitted users" ON public.raw_materials;
DROP POLICY IF EXISTS "masters read active users raw" ON public.raw_materials;
CREATE POLICY "raw materials read authenticated" ON public.raw_materials FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 5. Relax SELECT policies on fabric_rolls
DROP POLICY IF EXISTS "rolls read permitted users" ON public.fabric_rolls;
DROP POLICY IF EXISTS "rolls read active users" ON public.fabric_rolls;
CREATE POLICY "rolls read authenticated" ON public.fabric_rolls FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 6. Relax SELECT policies on customers
DROP POLICY IF EXISTS "customers read permitted users" ON public.customers;
DROP POLICY IF EXISTS "masters read active users customers" ON public.customers;
CREATE POLICY "customers read authenticated" ON public.customers FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 7. Relax SELECT policies on loom_production_entries
DROP POLICY IF EXISTS "production read permitted users" ON public.loom_production_entries;
DROP POLICY IF EXISTS "production read active users" ON public.loom_production_entries;
CREATE POLICY "production read authenticated" ON public.loom_production_entries FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 8. Relax SELECT policies on sales_orders
DROP POLICY IF EXISTS "sales read permitted users" ON public.sales_orders;
DROP POLICY IF EXISTS "sales read active users" ON public.sales_orders;
CREATE POLICY "sales read authenticated" ON public.sales_orders FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);

-- 9. Relax SELECT policies on sales_order_items
DROP POLICY IF EXISTS "Allow read access to authenticated users on sales_order_items" ON public.sales_order_items;
CREATE POLICY "sales items read authenticated" ON public.sales_order_items FOR SELECT TO authenticated USING (true);

-- 10. Relax SELECT policies on roto_film_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on roto_film_rolls" ON public.roto_film_rolls;
CREATE POLICY "Allow read access to authenticated on roto_film_rolls" ON public.roto_film_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 11. Relax SELECT policies on roto_metallic_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on roto_metallic_rolls" ON public.roto_metallic_rolls;
CREATE POLICY "Allow read access to authenticated on roto_metallic_rolls" ON public.roto_metallic_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 12. Relax SELECT policies on lamination_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on lamination_rolls" ON public.lamination_rolls;
CREATE POLICY "Allow read access to authenticated on lamination_rolls" ON public.lamination_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 13. Relax SELECT policies on offset_rolls
DROP POLICY IF EXISTS "Allow read access to permitted users on offset_rolls" ON public.offset_rolls;
CREATE POLICY "Allow read access to authenticated on offset_rolls" ON public.offset_rolls FOR SELECT TO authenticated USING (deleted_at IS NULL);

-- 14. Relax SELECT policies on finishing_bundles
DROP POLICY IF EXISTS "Allow read access to permitted users on finishing_bundles" ON public.finishing_bundles;
CREATE POLICY "Allow read access to authenticated on finishing_bundles" ON public.finishing_bundles FOR SELECT TO authenticated USING (deleted_at IS NULL);
