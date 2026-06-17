create or replace function public.prepare_production_entry()
returns trigger
language plpgsql
as $$
declare
  last_end numeric(12,2);
  loom_lock uuid;
begin
  -- Concurrency Fix: Acquire an exclusive row-level lock on the parent loom record.
  -- This blocks any concurrent transactions attempting to insert/update entries for the same loom.
  -- They will wait until this transaction commits, ensuring sequential, non-overlapping meter values.
  select id into loom_lock
  from public.looms
  where id = new.loom_id
  for update;

  if new.serial_number is null or new.serial_number = '' then
    new.serial_number = public.next_year_number('PROD', 'loom_production_entries', 'serial_number');
  end if;

  if new.entry_date is null then
    new.entry_date = current_date;
  end if;

  select lpe.end_meters into last_end
  from public.loom_production_entries lpe
  where lpe.loom_id = new.loom_id
    and lpe.deleted_at is null
  order by lpe.created_at desc
  limit 1;

  if tg_op = 'INSERT' and not public.is_admin() then
    new.initial_meters = coalesce(last_end, 0);
    new.initial_meter_overridden = false;
  elsif tg_op = 'INSERT' and public.is_admin() then
    if new.initial_meters is null then
      new.initial_meters = coalesce(last_end, 0);
    else
      new.initial_meter_overridden = new.initial_meters is distinct from coalesce(last_end, 0);
    end if;
  elsif tg_op = 'UPDATE' and not public.is_admin() then
    new.initial_meters = old.initial_meters;
    new.initial_meter_overridden = old.initial_meter_overridden;
  end if;

  return new;
end;
$$;
