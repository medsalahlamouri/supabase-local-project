create extension if not exists "uuid-ossp";

create type consultation_status as enum (
  'scheduled',
  'completed',
  'cancelled'
);

create table public.patients (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  cid text not null unique,
  birth_date date not null,
  town text not null,
  created_at timestamptz default now()
);

create table public.consultations (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null,
  appointment_date timestamptz not null,
  status consultation_status not null default 'scheduled',
  reason text,
  notes text,
  created_at timestamptz default now(),

  constraint consultations_patient_id_fkey
    foreign key (patient_id)
    references public.patients(id)
    on delete cascade
);

create index idx_consultations_patient_id
on public.consultations(patient_id);

create index idx_consultations_appointment_date
on public.consultations(appointment_date);

alter table public.patients
enable row level security;

alter table public.consultations
enable row level security;

create policy "Allow all patients"
on public.patients
for all
using (true)
with check (true);

create policy "Allow all consultations"
on public.consultations
for all
using (true)
with check (true);
