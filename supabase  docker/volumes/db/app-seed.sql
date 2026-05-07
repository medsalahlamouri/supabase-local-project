insert into public.patients (id, full_name, cid, birth_date, town)
values
  ('11111111-1111-1111-1111-111111111111', 'Alice Dupont', 'C123456', '1990-01-01', 'Lyon')
on conflict (id) do nothing;

insert into public.consultations (id, patient_id, appointment_date, status, reason, notes)
values
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    date_trunc('hour', now()) + interval '1 day',
    'scheduled',
    'Checkup',
    'Initial local demo consultation'
  )
on conflict (id) do nothing;
