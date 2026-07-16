-- Migration 052: Fix get_opening_balance to match account journal name-matching logic used by ledger reports

CREATE OR REPLACE FUNCTION public.get_opening_balance(p_account_id uuid, p_from_date date)
RETURNS TABLE (
  total_debit numeric,
  total_credit numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_customer_name text;
  v_alias text;
  v_name_with_ac text;
  v_alias_with_ac text;
BEGIN
  -- Fetch name and alias for the given customer/account
  SELECT customer_name, alias INTO v_customer_name, v_alias
  FROM public.customers
  WHERE id = p_account_id;

  v_name_with_ac := CASE 
    WHEN v_customer_name IS NOT NULL AND lower(v_customer_name) NOT LIKE '% a/c' THEN v_customer_name || ' A/c'
    ELSE v_customer_name
  END;

  v_alias_with_ac := CASE 
    WHEN v_alias IS NOT NULL AND lower(v_alias) NOT LIKE '% a/c' THEN v_alias || ' A/c'
    ELSE v_alias
  END;

  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN entry_type = 'debit' THEN amount ELSE 0 END), 0) AS total_debit,
    COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END), 0) AS total_credit
  FROM public.accounts_journal
  WHERE (
      account_id = p_account_id
      OR (v_customer_name IS NOT NULL AND lower(account_name) = lower(v_customer_name))
      OR (v_name_with_ac IS NOT NULL AND lower(account_name) = lower(v_name_with_ac))
      OR (v_alias IS NOT NULL AND lower(account_name) = lower(v_alias))
      OR (v_alias_with_ac IS NOT NULL AND lower(account_name) = lower(v_alias_with_ac))
    )
    AND entry_date < p_from_date
    AND deleted_at IS NULL;
END;
$$;
