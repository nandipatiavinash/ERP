-- ============================================================
-- Migration 005: Safe cleanup of duplicate journal entries
-- Strategy: SOFT-DELETE only - no data is hard-deleted.
-- For each duplicate set, keep the OLDEST entry (first created)
-- and set deleted_at on all newer copies.
-- ============================================================

-- STEP 1 (diagnostic - run this first to see what will be affected):
-- SELECT
--   journal_no,
--   entry_date,
--   account_name,
--   entry_type,
--   amount,
--   COUNT(*) AS occurrences
-- FROM public.accounts_journal
-- WHERE deleted_at IS NULL
-- GROUP BY journal_no, entry_date, account_name, entry_type, amount
-- HAVING COUNT(*) > 1
-- ORDER BY journal_no;

-- STEP 2: Soft-delete duplicate rows.
-- For each (journal_no, entry_date, account_name, entry_type, amount) group
-- that appears more than once, keep only the earliest row (MIN id by created_at)
-- and soft-delete the rest.

WITH ranked AS (
  SELECT
    id,
    journal_no,
    entry_date,
    account_name,
    entry_type,
    amount,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY journal_no, entry_date, account_name, entry_type, amount
      ORDER BY created_at ASC
    ) AS rn
  FROM public.accounts_journal
  WHERE deleted_at IS NULL
),
duplicates AS (
  SELECT id FROM ranked WHERE rn > 1
)
UPDATE public.accounts_journal
SET deleted_at = NOW()
WHERE id IN (SELECT id FROM duplicates);

-- STEP 3: Verify - this should return 0 rows after cleanup
-- SELECT journal_no, entry_date, account_name, entry_type, amount, COUNT(*)
-- FROM public.accounts_journal
-- WHERE deleted_at IS NULL
-- GROUP BY journal_no, entry_date, account_name, entry_type, amount
-- HAVING COUNT(*) > 1;
