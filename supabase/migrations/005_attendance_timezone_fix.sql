create or replace function public.calculate_attendance()
returns trigger
language plpgsql
as $$
declare
  employee_shift_end time;
  local_check_in timestamp;
  local_check_out timestamp;
  hours_worked numeric(8,2);
  overtime numeric(8,2);
  shift_end_at timestamptz;
begin
  if new.check_in_at is not null then
    local_check_in = new.check_in_at at time zone 'Asia/Kolkata';
    new.check_in = local_check_in::time(0);
    new.attendance_date = local_check_in::date;
  end if;

  if new.check_out_at is not null then
    local_check_out = new.check_out_at at time zone 'Asia/Kolkata';
    new.check_out = local_check_out::time(0);
  end if;

  if new.check_in_at is not null and new.check_out_at is not null then
    hours_worked = round((extract(epoch from (new.check_out_at - new.check_in_at)) / 3600)::numeric, 2);
    if hours_worked < 0 then
      hours_worked = 0;
    end if;

    select shift_end into employee_shift_end
    from public.employees
    where id = new.employee_id;

    shift_end_at = ((new.attendance_date + coalesce(employee_shift_end, '18:00'::time)) at time zone 'Asia/Kolkata');
    overtime = greatest(round((extract(epoch from (new.check_out_at - shift_end_at)) / 3600)::numeric, 2), 0);

    new.working_hours = hours_worked;
    new.overtime_hours = overtime;
    new.status = case
      when hours_worked = 0 then 'absent'
      when hours_worked < 4 then 'half_day'
      else 'present'
    end;
  elsif new.check_in_at is not null then
    new.working_hours = 0;
    new.overtime_hours = 0;
    new.status = 'present';
  else
    new.working_hours = 0;
    new.overtime_hours = 0;
    new.status = 'absent';
  end if;

  return new;
end;
$$;

update public.attendance
set updated_at = updated_at
where check_in_at is not null
  and deleted_at is null;
