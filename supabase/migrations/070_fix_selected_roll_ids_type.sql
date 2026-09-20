CREATE OR REPLACE FUNCTION public.create_sales_order_with_vehicle(
  p_customer_id UUID,
  p_order_number TEXT,
  p_order_date TEXT,
  p_status TEXT DEFAULT 'confirmed',
  p_is_draft_billing BOOLEAN DEFAULT false,
  p_gst_rate NUMERIC DEFAULT 18,
  p_selected_roll_ids TEXT[] DEFAULT '{}',
  p_vehicle_number TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL,
  p_updated_by UUID DEFAULT NULL
) RETURNS sales_orders AS $$
DECLARE
  v_order sales_orders;
BEGIN
  INSERT INTO sales_orders (
    customer_id,
    order_number,
    order_date,
    status,
    is_draft_billing,
    gst_rate,
    selected_roll_ids,
    vehicle_number,
    created_by,
    updated_by
  ) VALUES (
    p_customer_id,
    p_order_number,
    p_order_date::date,
    p_status,
    p_is_draft_billing,
    p_gst_rate,
    p_selected_roll_ids::uuid[],
    p_vehicle_number,
    p_created_by,
    p_updated_by
  ) RETURNING * INTO v_order;

  RETURN v_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
