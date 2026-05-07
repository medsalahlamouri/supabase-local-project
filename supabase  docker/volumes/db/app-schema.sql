create extension if not exists pgcrypto;

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  cid text not null unique,
  birth_date date not null,
  town text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  appointment_date timestamptz not null,
  status text not null check (status in ('scheduled', 'completed', 'cancelled')),
  reason text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_patients_full_name on public.patients(full_name);
create index if not exists idx_patients_cid on public.patients(cid);
create index if not exists idx_patients_town on public.patients(town);
create index if not exists idx_consultations_patient_id on public.consultations(patient_id);
create index if not exists idx_consultations_appointment_date on public.consultations(appointment_date);
create index if not exists idx_consultations_status on public.consultations(status);

alter table public.patients enable row level security;
alter table public.consultations enable row level security;

drop policy if exists dev_all_patients on public.patients;
create policy dev_all_patients
on public.patients
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists dev_all_consultations on public.consultations;
create policy dev_all_consultations
on public.consultations
for all
to anon, authenticated
using (true)
with check (true);
