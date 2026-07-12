-- Migration 046: Make fabric_rolls production constraints nullable

ALTER TABLE public.fabric_rolls
  ALTER COLUMN production_entry_id DROP NOT NULL,
  ALTER COLUMN loom_id DROP NOT NULL;
