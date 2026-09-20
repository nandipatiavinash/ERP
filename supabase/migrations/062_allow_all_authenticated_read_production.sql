-- Allow all authenticated users to read loom_production_entries for delivery entry, dispatches, and reports
DROP POLICY IF EXISTS "production read permitted users" ON public.loom_production_entries;
DROP POLICY IF EXISTS "production read active users" ON public.loom_production_entries;
DROP POLICY IF EXISTS "production_read_all_authenticated" ON public.loom_production_entries;

CREATE POLICY "production_read_all_authenticated" 
ON public.loom_production_entries 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);
