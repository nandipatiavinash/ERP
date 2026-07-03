-- DB-04 / DB-05: Advisory locking functions for order and dispatch number generation
-- to prevent race conditions (duplicates) under concurrent operations.

CREATE OR REPLACE FUNCTION public.get_next_order_no(p_order_date text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_mm_dd text;
  v_max_seq int := 0;
  v_seq int;
  v_rec record;
BEGIN
  -- Date is formatted as YYYY-MM-DD
  v_mm_dd := split_part(p_order_date, '-', 2) || '-' || split_part(p_order_date, '-', 3);
  
  -- Acquire advisory lock for this date to serialize concurrent updates
  PERFORM pg_advisory_xact_lock(hashtext('order_no_' || p_order_date));

  FOR v_rec IN 
    SELECT order_number 
    FROM public.sales_orders 
    WHERE order_date = p_order_date::date
      AND deleted_at IS NULL
  LOOP
    IF v_rec.order_number LIKE v_mm_dd || '-%' THEN
      v_seq := NULLIF(split_part(v_rec.order_number, '-', 2), '')::int;
      IF v_seq IS NOT NULL AND v_seq > v_max_seq THEN
        v_max_seq := v_seq;
      END IF;
    END IF;
  END LOOP;

  RETURN v_mm_dd || '-' || lpad((v_max_seq + 1)::text, 2, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.get_next_dispatch_no(p_delivery_date text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_mm_dd text;
  v_max_seq int := 0;
  v_seq int;
  v_rec record;
BEGIN
  v_mm_dd := split_part(p_delivery_date, '-', 2) || '-' || split_part(p_delivery_date, '-', 3);
  
  -- Acquire advisory lock for this date to serialize concurrent updates
  PERFORM pg_advisory_xact_lock(hashtext('dispatch_no_' || p_delivery_date));

  FOR v_rec IN 
    SELECT order_number 
    FROM public.sales_orders 
    WHERE order_number LIKE 'DP-' || v_mm_dd || '-%'
      AND deleted_at IS NULL
  LOOP
    v_seq := NULLIF(split_part(v_rec.order_number, '-', 4), '')::int;
    IF v_seq IS NOT NULL AND v_seq > v_max_seq THEN
      v_max_seq := v_seq;
    END IF;
  END LOOP;

  RETURN 'DP-' || v_mm_dd || '-' || lpad((v_max_seq + 1)::text, 2, '0');
END;
$$;
