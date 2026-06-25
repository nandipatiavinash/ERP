-- Migration: Scalability and Performance Optimizations for Billion-Row capacity
-- Relates to: Optimizing trigger sequences and replacing heavy client-side table fetches with database RPCs

-- 1. Optimize next_year_number function to use O(1) ORDER BY DESC LIMIT 1 index scans
CREATE OR REPLACE FUNCTION public.next_year_number(prefix text, table_name text, column_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  yr text := to_char(current_date, 'YYYY');
  max_val text;
  next_number int;
  sql text;
BEGIN
  sql := format(
    'SELECT %I FROM public.%I WHERE %I LIKE %L ORDER BY %I DESC LIMIT 1',
    column_name, table_name, column_name, prefix || '-' || yr || '-%', column_name
  );
  EXECUTE sql INTO max_val;
  
  IF max_val IS NULL THEN
    next_number := 1;
  ELSE
    next_number := COALESCE((regexp_match(max_val, '-([0-9]+)$'))[1]::int, 0) + 1;
  END IF;
  
  RETURN prefix || '-' || yr || '-' || lpad(next_number::text, 6, '0');
END;
$$;

-- 2. Create index on accounts_journal(journal_no) for rapid sequence lookup
CREATE INDEX IF NOT EXISTS idx_accounts_journal_journal_no_desc 
ON public.accounts_journal (journal_no DESC NULLS LAST) 
WHERE deleted_at IS NULL;

-- 3. Define RPC to get the next Journal Entry number
CREATE OR REPLACE FUNCTION public.get_next_journal_no()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  max_no text;
  next_val integer;
BEGIN
  SELECT aj.journal_no INTO max_no
  FROM public.accounts_journal aj
  WHERE aj.deleted_at IS NULL
    AND aj.journal_no ~ '^JE-[0-9]+$'
  ORDER BY aj.journal_no DESC
  LIMIT 1;

  IF max_no IS NULL THEN
    next_val := 1;
  ELSE
    next_val := CAST(SUBSTRING(max_no FROM 4) AS integer) + 1;
  END IF;

  RETURN 'JE-' || lpad(next_val::text, 6, '0');
END;
$$;

-- 4. Define RPC to calculate the opening balance before a date
CREATE OR REPLACE FUNCTION public.get_opening_balance(p_account_id uuid, p_from_date date)
RETURNS TABLE (
  total_debit numeric,
  total_credit numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(SUM(CASE WHEN entry_type = 'debit' THEN amount ELSE 0 END), 0) AS total_debit,
    COALESCE(SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END), 0) AS total_credit
  FROM public.accounts_journal
  WHERE account_id = p_account_id
    AND entry_date < p_from_date
    AND deleted_at IS NULL;
$$;

-- 5. Define RPC to calculate debit/credit summaries by account for financial statements
CREATE OR REPLACE FUNCTION public.get_accounts_journal_summary_by_date(p_date date)
RETURNS TABLE (
  account_id uuid,
  account_name text,
  entry_type text,
  amount numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    aj.account_id,
    aj.account_name,
    aj.entry_type,
    SUM(aj.amount) AS amount
  FROM public.accounts_journal aj
  WHERE aj.entry_date <= p_date
    AND aj.deleted_at IS NULL
  GROUP BY aj.account_id, aj.account_name, aj.entry_type;
$$;
