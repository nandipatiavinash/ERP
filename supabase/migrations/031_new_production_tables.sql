-- Migration: 031_new_production_tables.sql
-- Create production tables for Roto, Lamination, Offset, and Finishing, and set up automatic consumption triggers.

-- 1. Drop check constraint on status of public.fabric_rolls and recreate with 'consumed' option
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT tc.constraint_name 
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = 'fabric_rolls' 
          AND tc.constraint_type = 'CHECK'
          AND ccu.column_name = 'status'
    LOOP
        EXECUTE 'ALTER TABLE public.fabric_rolls DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

ALTER TABLE public.fabric_rolls ADD CONSTRAINT fabric_rolls_status_check
  CHECK (status IN ('available', 'reserved', 'sold', 'voided', 'consumed'));


-- 2. Create Roto Film Rolls Table
CREATE TABLE IF NOT EXISTS public.roto_film_rolls (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id         TEXT UNIQUE NOT NULL,
  brand_id        UUID REFERENCES public.roto_products(id) ON DELETE SET NULL,
  film_type       TEXT NOT NULL CHECK (film_type IN ('gloss', 'matt')),
  color_id        UUID REFERENCES public.roto_colors(id) ON DELETE SET NULL,
  weight_kg       NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  meters          NUMERIC(10,2) NOT NULL CHECK (meters > 0),
  entry_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  status          TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by      UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by      UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);

ALTER TABLE public.roto_film_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on roto_film_rolls"
ON public.roto_film_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

CREATE POLICY "Allow write access to permitted users on roto_film_rolls"
ON public.roto_film_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);


-- 3. Create Roto Metallic Rolls Table
CREATE TABLE IF NOT EXISTS public.roto_metallic_rolls (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id              TEXT UNIQUE NOT NULL,
  source_film_roll_id  UUID NOT NULL REFERENCES public.roto_film_rolls(id) ON DELETE RESTRICT,
  is_split             BOOLEAN NOT NULL DEFAULT FALSE,
  weight_kg            NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  meters               NUMERIC(10,2) NOT NULL CHECK (meters > 0),
  entry_date           DATE NOT NULL DEFAULT CURRENT_DATE,
  status               TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at           TIMESTAMPTZ
);

ALTER TABLE public.roto_metallic_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on roto_metallic_rolls"
ON public.roto_metallic_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

CREATE POLICY "Allow write access to permitted users on roto_metallic_rolls"
ON public.roto_metallic_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);


-- 4. Create Lamination Rolls Table
CREATE TABLE IF NOT EXISTS public.lamination_rolls (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id           TEXT UNIQUE NOT NULL,
  lam_type          TEXT NOT NULL CHECK (lam_type IN ('BOX', 'F_S', 'H_S', 'NW', 'PLAIN')),
  fabric_roll_id    UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
  film_roll_id      UUID REFERENCES public.roto_metallic_rolls(id) ON DELETE RESTRICT,
  nw_material_id    UUID REFERENCES public.raw_materials(id) ON DELETE SET NULL,
  weight_kg         NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  meters            NUMERIC(10,2) NOT NULL CHECK (meters > 0),
  entry_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  status            TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ
);

ALTER TABLE public.lamination_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on lamination_rolls"
ON public.lamination_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

CREATE POLICY "Allow write access to permitted users on lamination_rolls"
ON public.lamination_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);


-- 5. Create Offset Rolls Table
CREATE TABLE IF NOT EXISTS public.offset_rolls (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_id                   TEXT UNIQUE NOT NULL,
  offset_type               TEXT NOT NULL CHECK (offset_type IN ('NW', 'NW_LAM', 'PLAIN_LAM', 'FABRIC')),
  brand_id                  UUID REFERENCES public.offset_products(id) ON DELETE SET NULL,
  source_fabric_roll_id     UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
  source_lam_roll_id        UUID REFERENCES public.lamination_rolls(id) ON DELETE RESTRICT,
  weight_kg                 NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  entry_date                DATE NOT NULL DEFAULT CURRENT_DATE,
  status                    TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'consumed')),
  created_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at                TIMESTAMPTZ
);

ALTER TABLE public.offset_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on offset_rolls"
ON public.offset_rolls FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

CREATE POLICY "Allow write access to permitted users on offset_rolls"
ON public.offset_rolls FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);


-- 6. Create Finishing Bundles Table
CREATE TABLE IF NOT EXISTS public.finishing_bundles (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id                 TEXT NOT NULL,
  finish_type               TEXT NOT NULL CHECK (finish_type IN ('LAMINATED', 'NW', 'PLAIN')),
  source_lam_roll_id        UUID REFERENCES public.lamination_rolls(id) ON DELETE RESTRICT,
  source_fabric_roll_id     UUID REFERENCES public.fabric_rolls(id) ON DELETE RESTRICT,
  source_nw_material_id     UUID REFERENCES public.raw_materials(id) ON DELETE SET NULL,
  num_bags                  INTEGER NOT NULL CHECK (num_bags > 0),
  weight_kg                 NUMERIC(10,2) NOT NULL CHECK (weight_kg > 0),
  entry_date                DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by                UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at                TIMESTAMPTZ
);

ALTER TABLE public.finishing_bundles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to permitted users on finishing_bundles"
ON public.finishing_bundles FOR SELECT TO authenticated
USING (
  public.has_permission('production.view')
  OR public.has_permission('rolls.view')
  OR public.has_permission('reports.view')
  OR public.is_admin()
);

CREATE POLICY "Allow write access to permitted users on finishing_bundles"
ON public.finishing_bundles FOR ALL TO authenticated
USING (
  public.has_permission('production.edit')
  OR public.is_admin()
)
WITH CHECK (
  public.has_permission('production.edit')
  OR public.is_admin()
);


-- 7. Trigger Functions and Triggers for Consumption Logic

-- Roto Metallic consumes Film Roll
CREATE OR REPLACE FUNCTION public.apply_roto_metallic_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_split = FALSE THEN
      UPDATE public.roto_film_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_film_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.roto_film_rolls
    SET status = 'available', updated_at = now()
    WHERE id = OLD.source_film_roll_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS metallic_roll_consumes_film ON public.roto_metallic_rolls;
CREATE TRIGGER metallic_roll_consumes_film
AFTER INSERT OR DELETE ON public.roto_metallic_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_roto_metallic_consumption();


-- Lamination consumes Fabric + Film
CREATE OR REPLACE FUNCTION public.apply_lamination_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Fabric roll is always consumed
    UPDATE public.fabric_rolls
    SET status = 'consumed', current_stage = 'lamination', updated_at = now()
    WHERE id = NEW.fabric_roll_id;

    -- Film roll is consumed if present
    IF NEW.film_roll_id IS NOT NULL THEN
      UPDATE public.roto_metallic_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.film_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.fabric_rolls
    SET status = 'available', current_stage = 'loom', updated_at = now()
    WHERE id = OLD.fabric_roll_id;

    IF OLD.film_roll_id IS NOT NULL THEN
      UPDATE public.roto_metallic_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.film_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lamination_roll_consumes_inputs ON public.lamination_rolls;
CREATE TRIGGER lamination_roll_consumes_inputs
AFTER INSERT OR DELETE ON public.lamination_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_lamination_consumption();


-- Offset consumes Lamination roll or Fabric roll
CREATE OR REPLACE FUNCTION public.apply_offset_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.offset_type = 'FABRIC' AND NEW.source_fabric_roll_id IS NOT NULL THEN
      UPDATE public.fabric_rolls
      SET status = 'consumed', current_stage = 'offset_printing', updated_at = now()
      WHERE id = NEW.source_fabric_roll_id;
    ELSIF NEW.offset_type IN ('NW_LAM', 'PLAIN_LAM') AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.offset_type = 'FABRIC' AND OLD.source_fabric_roll_id IS NOT NULL THEN
      UPDATE public.fabric_rolls
      SET status = 'available', current_stage = 'loom', updated_at = now()
      WHERE id = OLD.source_fabric_roll_id;
    ELSIF OLD.offset_type IN ('NW_LAM', 'PLAIN_LAM') AND OLD.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.source_lam_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS offset_roll_consumes_inputs ON public.offset_rolls;
CREATE TRIGGER offset_roll_consumes_inputs
AFTER INSERT OR DELETE ON public.offset_rolls
FOR EACH ROW EXECUTE FUNCTION public.apply_offset_consumption();


-- Finishing consumes Lamination roll or Fabric roll
CREATE OR REPLACE FUNCTION public.apply_finishing_consumption()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.finish_type = 'LAMINATED' AND NEW.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'consumed', updated_at = now()
      WHERE id = NEW.source_lam_roll_id;
    ELSIF NEW.finish_type = 'PLAIN' AND NEW.source_fabric_roll_id IS NOT NULL THEN
      UPDATE public.fabric_rolls
      SET status = 'consumed', current_stage = 'finishing', updated_at = now()
      WHERE id = NEW.source_fabric_roll_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.finish_type = 'LAMINATED' AND OLD.source_lam_roll_id IS NOT NULL THEN
      UPDATE public.lamination_rolls
      SET status = 'available', updated_at = now()
      WHERE id = OLD.source_lam_roll_id;
    ELSIF OLD.finish_type = 'PLAIN' AND OLD.source_fabric_roll_id IS NOT NULL THEN
      UPDATE public.fabric_rolls
      SET status = 'available', current_stage = 'loom', updated_at = now()
      WHERE id = OLD.source_fabric_roll_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS finishing_bundle_consumes_inputs ON public.finishing_bundles;
CREATE TRIGGER finishing_bundle_consumes_inputs
AFTER INSERT OR DELETE ON public.finishing_bundles
FOR EACH ROW EXECUTE FUNCTION public.apply_finishing_consumption();
