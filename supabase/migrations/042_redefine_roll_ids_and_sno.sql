-- Migration: Redefine roll/bundle IDs, drop unique constraints, add s_no column, and migrate existing data.

-- 1. DROP UNIQUE CONSTRAINTS ON roll_id DYNAMICALLY
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop unique constraint on roto_film_rolls
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
          AND table_name = 'roto_film_rolls' 
          AND constraint_type = 'UNIQUE'
    ) LOOP
        EXECUTE 'ALTER TABLE public.roto_film_rolls DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
    
    -- Drop unique constraint on roto_metallic_rolls
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
          AND table_name = 'roto_metallic_rolls' 
          AND constraint_type = 'UNIQUE'
    ) LOOP
        EXECUTE 'ALTER TABLE public.roto_metallic_rolls DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;

    -- Drop unique constraint on lamination_rolls
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
          AND table_name = 'lamination_rolls' 
          AND constraint_type = 'UNIQUE'
    ) LOOP
        EXECUTE 'ALTER TABLE public.lamination_rolls DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;

    -- Drop unique constraint on offset_rolls
    FOR r IN (
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
          AND table_name = 'offset_rolls' 
          AND constraint_type = 'UNIQUE'
    ) LOOP
        EXECUTE 'ALTER TABLE public.offset_rolls DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;


-- 2. ADD s_no COLUMNS (TEMPORARILY NULLABLE)
ALTER TABLE public.roto_film_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.roto_metallic_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.lamination_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.offset_rolls ADD COLUMN IF NOT EXISTS s_no INTEGER;
ALTER TABLE public.finishing_bundles ADD COLUMN IF NOT EXISTS s_no INTEGER;


-- 3. MIGRATE DATA & CAPITALIZE IDS

-- A. Roto Film Rolls (Generate sequential s_no grouped by roll_id)
WITH seq_assigned AS (
  SELECT id, row_number() OVER (PARTITION BY roll_id ORDER BY created_at) as new_s_no
  FROM public.roto_film_rolls
)
UPDATE public.roto_film_rolls r
SET 
  s_no = s.new_s_no,
  roll_id = UPPER(r.roll_id)
FROM seq_assigned s
WHERE r.id = s.id;

-- B. Roto Metallic Rolls (Inherit s_no from source film roll and force uppercase on (MT))
UPDATE public.roto_metallic_rolls m
SET 
  s_no = f.s_no,
  roll_id = UPPER(regexp_replace(m.roll_id, '\(Mt\)$', '(MT)', 'i'))
FROM public.roto_film_rolls f
WHERE m.source_film_roll_id = f.id;

UPDATE public.roto_metallic_rolls SET s_no = 1 WHERE s_no IS NULL;

-- C. Lamination Rolls (Parse sequence suffix, remove redundant plain/NW lamination suffix)
UPDATE public.lamination_rolls
SET 
  s_no = CASE 
    WHEN roll_id ~ '\(([0-9]+)\)$' THEN (substring(roll_id from '\(([0-9]+)\)$'))::integer 
    ELSE 1 
  END,
  roll_id = CASE
    WHEN UPPER(roll_id) ~ '\((P|NW)\)\(([0-9]+)\)$' THEN UPPER(regexp_replace(roll_id, '\((p|nw|P|NW)\)\(([0-9]+)\)$', ''))
    WHEN roll_id ~ '\(([0-9]+)\)$' THEN UPPER(regexp_replace(roll_id, '\(([0-9]+)\)$', ''))
    ELSE UPPER(roll_id)
  END;

-- D. Offset Rolls (Parse sequence suffix, capitalize)
UPDATE public.offset_rolls
SET
  s_no = CASE
    WHEN roll_id ~ '\(([0-9]+)\)$' THEN (substring(roll_id from '\(([0-9]+)\)$'))::integer
    ELSE 1
  END,
  roll_id = CASE
    WHEN roll_id ~ '\(([0-9]+)\)$' THEN UPPER(regexp_replace(roll_id, '\(([0-9]+)\)$', ''))
    ELSE UPPER(roll_id)
  END;

-- E. Finishing Bundles (Parse sequence suffix, remove redundant plain/NW lamination suffix)
UPDATE public.finishing_bundles
SET
  s_no = CASE
    WHEN bundle_id ~ '\(([0-9]+)\)$' THEN (substring(bundle_id from '\(([0-9]+)\)$'))::integer
    ELSE 1
  END,
  bundle_id = CASE
    WHEN UPPER(bundle_id) ~ '\((P|NW)\)\(([0-9]+)\)$' THEN UPPER(regexp_replace(bundle_id, '\((p|nw|P|NW)\)\(([0-9]+)\)$', ''))
    WHEN bundle_id ~ '\(([0-9]+)\)$' THEN UPPER(regexp_replace(bundle_id, '\(([0-9]+)\)$', ''))
    ELSE UPPER(bundle_id)
  END;


-- 4. CONSTRAIN s_no COLUMNS TO NOT NULL
ALTER TABLE public.roto_film_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.roto_metallic_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.lamination_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.offset_rolls ALTER COLUMN s_no SET NOT NULL;
ALTER TABLE public.finishing_bundles ALTER COLUMN s_no SET NOT NULL;
