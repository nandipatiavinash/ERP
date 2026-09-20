GRANT EXECUTE ON FUNCTION public.create_sales_order_with_vehicle(UUID, TEXT, TEXT, TEXT, BOOLEAN, NUMERIC, TEXT[], TEXT, UUID, UUID) TO service_role, authenticated, anon;
NOTIFY pgrst, 'reload schema';
