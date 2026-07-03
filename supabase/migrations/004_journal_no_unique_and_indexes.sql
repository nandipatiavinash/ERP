-- DB-11: Add UNIQUE constraint on accounts_journal.journal_no
-- This enforces at DB level that no two journal entries can share the same
-- journal_no, closing the race condition window that existed when the number
-- was generated purely in application code.
-- NOTE: Run only after verifying there are no existing duplicates:
--   SELECT journal_no, COUNT(*) FROM accounts_journal GROUP BY journal_no HAVING COUNT(*) > 1;
CREATE UNIQUE INDEX IF NOT EXISTS accounts_journal_journal_no_unique
  ON public.accounts_journal (journal_no)
  WHERE deleted_at IS NULL;

-- DB-13 / Missing indexes: Add indexes that the audit identified as missing
-- for common query patterns (ledger lookups, date-range reports, filtering).

-- accounts_journal: entry_date (date-range reports)
CREATE INDEX IF NOT EXISTS idx_accounts_journal_entry_date
  ON public.accounts_journal (entry_date)
  WHERE deleted_at IS NULL;

-- accounts_journal: account_name text lookup (ledger queries)
CREATE INDEX IF NOT EXISTS idx_accounts_journal_account_name
  ON public.accounts_journal (account_name)
  WHERE deleted_at IS NULL;

-- raw_material_purchases: supplier_name (purchase filtering)
CREATE INDEX IF NOT EXISTS idx_raw_material_purchases_supplier_name
  ON public.raw_material_purchases (supplier_name)
  WHERE deleted_at IS NULL;

-- customers: is_internal (account-type filtering used on every journal save)
CREATE INDEX IF NOT EXISTS idx_customers_is_internal
  ON public.customers (is_internal)
  WHERE deleted_at IS NULL;

-- stage_production_entries: roll_id (roll stage lookups)
CREATE INDEX IF NOT EXISTS idx_stage_production_entries_roll_id
  ON public.stage_production_entries (roll_id)
  WHERE deleted_at IS NULL;
