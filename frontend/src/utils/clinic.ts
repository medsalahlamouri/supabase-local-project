import type { Consultation, Patient } from "../types/models";
import { timestamp, toDateKey } from "./date";

export type ClinicMetrics = {
  totalPatients: number;
  totalConsultations: number;
  todayConsultations: number;
  upcoming: number;
};

export function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

export function filterPatients(patients: Patient[], search: string) {
  const normalizedSearch = normalizeSearch(search);

  if (!normalizedSearch) {
    return patients;
  }

  return patients.filter((patient) =>
    [patient.full_name, patient.cid, patient.town]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch)
  );
}

export function filterConsultations(consultations: Consultation[], search: string) {
  const normalizedSearch = normalizeSearch(search);

  if (!normalizedSearch) {
    return consultations;
  }

  return consultations.filter((consultation) =>
    [
      consultation.patient?.full_name,
      consultation.patient?.cid,
      consultation.patient?.town,
      consultation.status,
      consultation.reason,
      consultation.notes
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch)
  );
}

export function getClinicMetrics(patients: Patient[], consultations: Consultation[]): ClinicMetrics {
  const today = toDateKey(new Date());

  return {
    totalPatients: patients.length,
    totalConsultations: consultations.length,
    todayConsultations: consultations.filter((consultation) => toDateKey(consultation.appointment_date) === today)
      .length,
    upcoming: consultations.filter((consultation) => toDateKey(consultation.appointment_date) > today).length
  };
}

export function sortPatientsByCreatedAtDesc(patients: Patient[]) {
  return [...patients].sort((first, second) => timestamp(second.created_at) - timestamp(first.created_at));
}

export function sortConsultationsByAppointmentDesc(consultations: Consultation[]) {
  return [...consultations].sort(
    (first, second) => timestamp(second.appointment_date) - timestamp(first.appointment_date)
  );
}
