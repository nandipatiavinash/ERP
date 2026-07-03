-- ============================================================
-- Migration 004: Performance indexes only
-- (UNIQUE index on journal_no removed -- journal entries
--  legitimately have multiple rows per journal_no: debit + credit pairs)
-- ============================================================

-- DB-13 / Missing indexes: Add indexes identified in audit report
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
