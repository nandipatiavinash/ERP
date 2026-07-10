-- Migration: Allow 'sold' and 'voided' statuses for offset, lamination, and roto rolls.

DO $$
DECLARE
    r RECORD;
BEGIN
    -- For offset_rolls
    FOR r IN
        SELECT tc.constraint_name 
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = 'offset_rolls' 
          AND tc.constraint_type = 'CHECK'
          AND ccu.column_name = 'status'
    LOOP
        EXECUTE 'ALTER TABLE public.offset_rolls DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;

    -- For lamination_rolls
    FOR r IN
        SELECT tc.constraint_name 
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = 'lamination_rolls' 
          AND tc.constraint_type = 'CHECK'
          AND ccu.column_name = 'status'
    LOOP
        EXECUTE 'ALTER TABLE public.lamination_rolls DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;

    -- For roto_film_rolls
    FOR r IN
        SELECT tc.constraint_name 
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = 'roto_film_rolls' 
          AND tc.constraint_type = 'CHECK'
          AND ccu.column_name = 'status'
    LOOP
        EXECUTE 'ALTER TABLE public.roto_film_rolls DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;

    -- For roto_metallic_rolls
    FOR r IN
        SELECT tc.constraint_name 
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = 'roto_metallic_rolls' 
          AND tc.constraint_type = 'CHECK'
          AND ccu.column_name = 'status'
    LOOP
        EXECUTE 'ALTER TABLE public.roto_metallic_rolls DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- Add updated check constraints allowing 'sold' and 'voided' statuses
ALTER TABLE public.offset_rolls ADD CONSTRAINT offset_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
ALTER TABLE public.lamination_rolls ADD CONSTRAINT lamination_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
ALTER TABLE public.roto_film_rolls ADD CONSTRAINT roto_film_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
ALTER TABLE public.roto_metallic_rolls ADD CONSTRAINT roto_metallic_rolls_status_check CHECK (status IN ('available', 'sold', 'voided', 'consumed'));
