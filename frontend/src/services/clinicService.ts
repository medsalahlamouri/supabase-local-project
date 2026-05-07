import { supabase } from "../lib/supabase";
import type {
  Consultation,
  ConsultationInput,
  ConsultationRow,
  Patient,
  PatientInput,
  PatientSummary
} from "../types/models";

export type ClinicData = {
  patients: Patient[];
  consultations: Consultation[];
};

type ConsultationResponse = ConsultationRow & {
  patient?: PatientSummary | PatientSummary[] | null;
};

const CONSULTATION_SELECT =
  "id,patient_id,appointment_date,status,reason,notes,created_at,patient:patients(full_name,cid,town)";

function requireClient() {
  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  return supabase;
}

function normalizeConsultation(row: ConsultationResponse): Consultation {
  const patient = Array.isArray(row.patient) ? row.patient[0] ?? null : row.patient ?? null;

  return {
    ...row,
    patient
  };
}

function toErrorMessage(...messages: (string | undefined)[]) {
  return messages.filter(Boolean).join(" ") || "Unexpected Supabase error.";
}

export async function fetchClinicData(signal?: AbortSignal): Promise<ClinicData> {
  const client = requireClient();

  const patientsQuery = client.from("patients").select("*").order("created_at", { ascending: false });
  const consultationsQuery = client
    .from("consultations")
    .select(CONSULTATION_SELECT)
    .order("appointment_date", { ascending: false });

  const [{ data: patients, error: patientsError }, { data: consultations, error: consultationsError }] =
    await Promise.all([
      signal ? patientsQuery.abortSignal(signal) : patientsQuery,
      signal ? consultationsQuery.abortSignal(signal) : consultationsQuery
    ]);

  if (patientsError || consultationsError) {
    throw new Error(toErrorMessage(patientsError?.message, consultationsError?.message));
  }

  return {
    patients: patients ?? [],
    consultations: ((consultations ?? []) as ConsultationResponse[]).map(normalizeConsultation)
  };
}

export async function createPatient(input: PatientInput): Promise<Patient> {
  const client = requireClient();
  const { data, error } = await client.from("patients").insert(input).select("*").single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Patient was created but no row was returned.");
  }

  return data;
}

export async function updatePatient(id: string, input: PatientInput): Promise<Patient> {
  const client = requireClient();
  const { data, error } = await client.from("patients").update(input).eq("id", id).select("*").single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Patient was updated but no row was returned.");
  }

  return data;
}

export async function createConsultation(input: ConsultationInput): Promise<Consultation> {
  const client = requireClient();
  const { data, error } = await client.from("consultations").insert(input).select(CONSULTATION_SELECT).single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Consultation was created but no row was returned.");
  }

  return normalizeConsultation(data as ConsultationResponse);
}

export async function updateConsultation(id: string, input: ConsultationInput): Promise<Consultation> {
  const client = requireClient();
  const { data, error } = await client
    .from("consultations")
    .update(input)
    .eq("id", id)
    .select(CONSULTATION_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Consultation was updated but no row was returned.");
  }

  return normalizeConsultation(data as ConsultationResponse);
}

export async function removePatient(id: string) {
  const client = requireClient();
  const { error } = await client.from("patients").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function removeConsultation(id: string) {
  const client = requireClient();
  const { error } = await client.from("consultations").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
