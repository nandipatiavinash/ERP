-- Migration: Add journal_no to accounts_journal
ALTER TABLE public.accounts_journal ADD COLUMN IF NOT EXISTS journal_no TEXT;
