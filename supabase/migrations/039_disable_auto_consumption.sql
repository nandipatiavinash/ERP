-- Migration 039: Disable automatic consumption triggers on production entries
-- The status of source rolls will only change to 'consumed' when explicitly logged in the Consumption page.

CREATE OR REPLACE FUNCTION public.apply_roto_metallic_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source film rolls
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.apply_lamination_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source film rolls and fabric rolls
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.apply_offset_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source lamination rolls
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.apply_finishing_consumption()
RETURNS TRIGGER AS $$
BEGIN
  -- Do nothing to disable automatic consumption of source lamination rolls
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
