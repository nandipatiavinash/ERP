-- Align attendance and employee schema with the app's expected runtime fields

ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS joining_date DATE,
  ADD COLUMN IF NOT EXISTS shift_start TIME,
  ADD COLUMN IF NOT EXISTS shift_end TIME;

ALTER TABLE public.attendance
  ADD COLUMN IF NOT EXISTS check_in_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS check_out_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS working_hours NUMERIC(8,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS overtime_hours NUMERIC(8,2) DEFAULT 0;

UPDATE public.attendance
SET check_in_at = (
  (attendance_date + check_in) AT TIME ZONE 'Asia/Kolkata'
)
WHERE check_in_at IS NULL
  AND check_in IS NOT NULL
  AND attendance_date IS NOT NULL;

UPDATE public.attendance
SET check_out_at = (
  (attendance_date + check_out) AT TIME ZONE 'Asia/Kolkata'
)
WHERE check_out_at IS NULL
  AND check_out IS NOT NULL
  AND attendance_date IS NOT NULL;

UPDATE public.attendance
SET working_hours = COALESCE(working_hours, 0)
WHERE working_hours IS NULL;

UPDATE public.attendance
SET overtime_hours = COALESCE(overtime_hours, 0)
WHERE overtime_hours IS NULL;
