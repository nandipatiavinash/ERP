DROP FUNCTION IF EXISTS public.create_sales_order_with_vehicle(UUID, TEXT, DATE, TEXT, BOOLEAN, NUMERIC, TEXT[], TEXT, UUID, UUID);
NOTIFY pgrst, 'reload schema';
