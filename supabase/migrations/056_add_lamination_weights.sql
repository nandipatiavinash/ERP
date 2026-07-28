-- Migration 056: Add Gross/Core/Net Weight to Lamination Rolls

ALTER TABLE public.lamination_rolls
  ADD COLUMN IF NOT EXISTS gross_weight NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS core_weight NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS net_weight NUMERIC(10,2);
