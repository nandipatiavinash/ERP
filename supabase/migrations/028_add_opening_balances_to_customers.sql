-- Migration: Add opening balances to customers table
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS opening_debit NUMERIC(12,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS opening_credit NUMERIC(12,2) NOT NULL DEFAULT 0;
