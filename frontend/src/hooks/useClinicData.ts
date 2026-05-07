import { useCallback, useEffect, useState } from "react";
import { supabaseConfigured } from "../lib/supabase";
import {
  createConsultation,
  createPatient,
  fetchClinicData,
  removeConsultation,
  removePatient,
  updateConsultation,
  updatePatient
} from "../services/clinicService";
import type { Consultation, ConsultationInput, Patient, PatientInput } from "../types/models";
import { sortConsultationsByAppointmentDesc, sortPatientsByCreatedAtDesc } from "../utils/clinic";
import { extractErrorMessage } from "../utils/errorHandling";

/**
 * Notice displayed to user with type and message.
 * - success: Operation completed successfully
 * - error: Operation failed
 * - warning: User should take note but operation continues
 */
export type Notice = { type: "success" | "error" | "warning"; message: string } | null;

export function useClinicData() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotice(null);

    try {
      const data = await fetchClinicData(signal);

      if (signal?.aborted) {
        return;
      }

      setPatients(data.patients);
      setConsultations(data.consultations);
    } catch (error) {
      if (!signal?.aborted) {
        setNotice({
          type: "error",
          message: extractErrorMessage(error, "Unable to load clinic data.")
        });
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void refresh(controller.signal);

    return () => controller.abort();
  }, [refresh]);

  const addPatient = useCallback(async (input: PatientInput) => {
    if (!supabaseConfigured) {
      setNotice({ type: "warning", message: "Supabase is not configured yet." });
      return false;
    }

    setSaving(true);
    setNotice(null);

    try {
      const patient = await createPatient(input);

      setPatients((current) =>
        sortPatientsByCreatedAtDesc([patient, ...current.filter((item) => item.id !== patient.id)])
      );
      setNotice({ type: "success", message: "Patient added." });
      return true;
    } catch (error) {
      setNotice({ type: "error", message: extractErrorMessage(error, "Unable to add patient.") });
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const editPatient = useCallback(async (id: string, input: PatientInput) => {
    if (!supabaseConfigured) {
      setNotice({ type: "warning", message: "Supabase is not configured yet." });
      return false;
    }

    setSaving(true);
    setNotice(null);

    try {
      const patient = await updatePatient(id, input);

      setPatients((current) =>
        sortPatientsByCreatedAtDesc([patient, ...current.filter((item) => item.id !== patient.id)])
      );
      setNotice({ type: "success", message: "Patient updated." });
      return true;
    } catch (error) {
      setNotice({ type: "error", message: extractErrorMessage(error, "Unable to update patient.") });
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const addConsultation = useCallback(async (input: ConsultationInput) => {
    if (!supabaseConfigured) {
      setNotice({ type: "warning", message: "Supabase is not configured yet." });
      return false;
    }

    setSaving(true);
    setNotice(null);

    try {
      const consultation = await createConsultation(input);

      setConsultations((current) =>
        sortConsultationsByAppointmentDesc([
          consultation,
          ...current.filter((item) => item.id !== consultation.id)
        ])
      );
      setNotice({ type: "success", message: "Consultation added." });
      return true;
    } catch (error) {
      setNotice({ type: "error", message: extractErrorMessage(error, "Unable to add consultation.") });
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const editConsultation = useCallback(async (id: string, input: ConsultationInput) => {
    if (!supabaseConfigured) {
      setNotice({ type: "warning", message: "Supabase is not configured yet." });
      return false;
    }

    setSaving(true);
    setNotice(null);

    try {
      const consultation = await updateConsultation(id, input);

      setConsultations((current) =>
        sortConsultationsByAppointmentDesc([
          consultation,
          ...current.filter((item) => item.id !== consultation.id)
        ])
      );
      setNotice({ type: "success", message: "Consultation updated." });
      return true;
    } catch (error) {
      setNotice({ type: "error", message: extractErrorMessage(error, "Unable to update consultation.") });
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const deletePatient = useCallback(async (id: string) => {
    if (!supabaseConfigured) {
      setNotice({ type: "warning", message: "Supabase is not configured yet." });
      return false;
    }

    setSaving(true);
    setNotice(null);

    try {
      await removePatient(id);
      setPatients((current) => current.filter((patient) => patient.id !== id));
      setConsultations((current) => current.filter((consultation) => consultation.patient_id !== id));
      setNotice({ type: "success", message: "Patient deleted." });
      return true;
    } catch (error) {
      setNotice({ type: "error", message: extractErrorMessage(error, "Unable to delete patient.") });
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteConsultation = useCallback(async (id: string) => {
    if (!supabaseConfigured) {
      setNotice({ type: "warning", message: "Supabase is not configured yet." });
      return false;
    }

    setSaving(true);
    setNotice(null);

    try {
      await removeConsultation(id);
      setConsultations((current) => current.filter((consultation) => consultation.id !== id));
      setNotice({ type: "success", message: "Consultation deleted." });
      return true;
    } catch (error) {
      setNotice({ type: "error", message: extractErrorMessage(error, "Unable to delete consultation.") });
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    patients,
    consultations,
    loading,
    saving,
    notice,
    refresh,
    addPatient,
    editPatient,
    addConsultation,
    editConsultation,
    deletePatient,
    deleteConsultation
  };
}
