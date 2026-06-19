-- Migration: Add description to raw_materials table
ALTER TABLE public.raw_materials 
ADD COLUMN IF NOT EXISTS description TEXT;
