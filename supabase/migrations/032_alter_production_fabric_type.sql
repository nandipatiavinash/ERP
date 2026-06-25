-- Migration: Alter Lamination, Offset, and Finishing to use fabric_type_id instead of fabric_roll_id

-- 1. Alter public.lamination_rolls
ALTER TABLE public.lamination_rolls DROP CONSTRAINT IF EXISTS lamination_rolls_fabric_roll_id_fkey;
ALTER TABLE public.lamination_rolls RENAME COLUMN fabric_roll_id TO fabric_type_id;

ALTER TABLE public.lamination_rolls
  ADD CONSTRAINT lamination_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;

-- 2. Alter public.offset_rolls
ALTER TABLE public.offset_rolls DROP CONSTRAINT IF EXISTS offset_rolls_source_fabric_roll_id_fkey;
ALTER TABLE public.offset_rolls RENAME COLUMN source_fabric_roll_id TO fabric_type_id;

ALTER TABLE public.offset_rolls
  ADD CONSTRAINT offset_rolls_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;

-- 3. Alter public.finishing_bundles
ALTER TABLE public.finishing_bundles DROP CONSTRAINT IF EXISTS finishing_bundles_source_fabric_roll_id_fkey;
ALTER TABLE public.finishing_bundles RENAME COLUMN source_fabric_roll_id TO fabric_type_id;

ALTER TABLE public.finishing_bundles
  ADD CONSTRAINT finishing_bundles_fabric_type_id_fkey FOREIGN KEY (fabric_type_id) REFERENCES public.fabric_types(id) ON DELETE SET NULL;

-- 4. Update trigger apply_lamination_consumption
CREATE OR REPLACE FUNCTION public.apply_lamination_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Film roll is consumed if present
    IF NEW.film_roll_id IS NOT NULL THEN
      UPDATE public.roto_metallic_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.film_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.film_roll_id IS NOT NULL THEN
      UPDATE public.roto_metallic_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.film_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 5. Update trigger apply_offset_consumption
CREATE OR REPLACE FUNCTION public.apply_offset_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.offset_type IN ('NW_LAM', 'PLAIN_LAM') AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.offset_type IN ('NW_LAM', 'PLAIN_LAM') AND OLD.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.source_lam_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 6. Update trigger apply_finishing_consumption
CREATE OR REPLACE FUNCTION public.apply_finishing_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.finish_type = 'LAMINATED' AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.finish_type = 'LAMINATED' AND OLD.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.source_lam_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
