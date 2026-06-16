create or replace function public.create_or_sync_fabric_roll()
returns trigger
language plpgsql
as $$
declare
  new_roll_number text;
  fab_name text;
  serial_num int;
begin
  if tg_op = 'INSERT' then
    -- Get fabric name
    select fabric_name into fab_name
    from public.fabric_types
    where id = new.fabric_type_id;

    -- Count active entries for this fabric type up to this one (ordered by created_at)
    select count(*) into serial_num
    from public.loom_production_entries
    where fabric_type_id = new.fabric_type_id
      and deleted_at is null
      and created_at <= new.created_at;

    new_roll_number = fab_name || '-' || coalesce(serial_num, 1);

    insert into public.fabric_rolls (
      roll_number,
      production_entry_id,
      fabric_type_id,
      loom_id,
      weight,
      meters,
      production_date,
      status,
      current_stage,
      created_by,
      updated_by
    )
    values (
      new_roll_number,
      new.id,
      new.fabric_type_id,
      new.loom_id,
      new.net_weight,
      new.net_meters,
      new.entry_date,
      case when new.deleted_at is null then 'available' else 'voided' end,
      'loom',
      new.created_by,
      new.updated_by
    );
  elsif tg_op = 'UPDATE' then
    update public.fabric_rolls
    set fabric_type_id = new.fabric_type_id,
        loom_id = new.loom_id,
        weight = new.net_weight,
        meters = new.net_meters,
        production_date = new.entry_date,
        status = case when new.deleted_at is not null then 'voided' else status end,
        updated_by = new.updated_by,
        updated_at = now(),
        deleted_at = case when new.deleted_at is not null then now() else deleted_at end
    where production_entry_id = new.id;
  end if;

  return new;
end;
$$;
