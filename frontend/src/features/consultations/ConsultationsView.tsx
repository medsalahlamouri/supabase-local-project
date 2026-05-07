import { useState, type FormEvent } from "react";
import type { Consultation, ConsultationInput, ConsultationStatus, Patient } from "../../types/models";
import { CONSULTATION_STATUS_OPTIONS } from "../../constants/consultationStatus";
import { UI_MESSAGES } from "../../constants/ui";
import { formatDateTime } from "../../utils/date";
import { validateConsultationForm } from "../../utils/validation";

type ConsultationForm = {
  patient_id: string;
  appointment_date_date: string;
  appointment_date_time: string;
  status: ConsultationStatus;
  reason: string;
  notes: string;
};

type ConsultationsViewProps = {
  consultations: Consultation[];
  patients: Patient[];
  disabled: boolean;
  saving: boolean;
  onCreate: (input: ConsultationInput) => Promise<boolean>;
  onUpdate: (id: string, input: ConsultationInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
};

const emptyConsultationForm: ConsultationForm = {
  patient_id: "",
  appointment_date_date: "",
  appointment_date_time: "",
  status: "scheduled",
  reason: "",
  notes: ""
};

function splitAppointmentDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { date: "", time: "" };
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`
  };
}

function buildAppointmentIso(datePart: string, timePart: string) {
  if (!datePart || !timePart) {
    return "";
  }

  const date = new Date(`${datePart}T${timePart}`);

  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function ConsultationsView({
  consultations,
  patients,
  disabled,
  saving,
  onCreate,
  onUpdate,
  onDelete
}: ConsultationsViewProps) {
  const [consultationForm, setConsultationForm] = useState<ConsultationForm>(emptyConsultationForm);
  const [editingConsultationId, setEditingConsultationId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  function resetForm() {
    setConsultationForm(emptyConsultationForm);
    setEditingConsultationId(null);
    setFormErrors([]);
  }

  function startEdit(consultation: Consultation) {
    setEditingConsultationId(consultation.id);
    const appointment = splitAppointmentDate(consultation.appointment_date);

    setConsultationForm({
      patient_id: consultation.patient_id,
      appointment_date_date: appointment.date,
      appointment_date_time: appointment.time,
      status: consultation.status,
      reason: consultation.reason ?? "",
      notes: consultation.notes ?? ""
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const appointmentDate = buildAppointmentIso(
      consultationForm.appointment_date_date,
      consultationForm.appointment_date_time
    );

    const errors = validateConsultationForm(consultationForm.patient_id, appointmentDate, consultationForm.reason);
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);

    const payload = {
      patient_id: consultationForm.patient_id,
      appointment_date: appointmentDate,
      status: consultationForm.status,
      reason: consultationForm.reason.trim() || null,
      notes: consultationForm.notes.trim() || null
    };

    const saved = editingConsultationId
      ? await onUpdate(editingConsultationId, payload)
      : await onCreate(payload);

    if (saved) {
      resetForm();
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm(UI_MESSAGES.CONFIRM_DELETE_CONSULTATION)) {
      await onDelete(id);
      if (editingConsultationId === id) {
        resetForm();
      }
    }
  }

  return (
    <section className="workspace">
      <div className="panel">
        <div className="panel-header">
          <h3>{editingConsultationId ? "Edit consultation" : "Add consultation"}</h3>
          {editingConsultationId && (
            <button className="secondary-button" type="button" onClick={resetForm} disabled={saving}>
              {UI_MESSAGES.CANCEL_EDIT}
            </button>
          )}
        </div>

        {formErrors.length > 0 && (
          <div className="form-errors" role="alert">
            {formErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}

        <form className="form consultation-form" onSubmit={handleSubmit}>
          <label>
            <span>Patient</span>
            <select
              required
              value={consultationForm.patient_id}
              onChange={(event) =>
                setConsultationForm((current) => ({ ...current, patient_id: event.target.value }))
              }
            >
              <option value="">Select patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.full_name} ({patient.cid})
                </option>
              ))}
            </select>
          </label>
          <label className="date-time-row">
            <span>Date and time</span>
            <div className="date-time-inputs">
              <input
                required
                type="date"
                value={consultationForm.appointment_date_date}
                onChange={(event) =>
                  setConsultationForm((current) => ({ ...current, appointment_date_date: event.target.value }))
                }
              />
              <input
                required
                type="time"
                value={consultationForm.appointment_date_time}
                onChange={(event) =>
                  setConsultationForm((current) => ({ ...current, appointment_date_time: event.target.value }))
                }
              />
            </div>
          </label>
          <label>
            <span>Status</span>
            <select
              value={consultationForm.status}
              onChange={(event) =>
                setConsultationForm((current) => ({
                  ...current,
                  status: event.target.value as ConsultationStatus
                }))
              }
            >
              {CONSULTATION_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Reason</span>
            <input
              placeholder="Reason"
              value={consultationForm.reason}
              onChange={(event) => setConsultationForm((current) => ({ ...current, reason: event.target.value }))}
            />
          </label>
          <label>
            <span>Notes</span>
            <input
              placeholder="Optional notes"
              value={consultationForm.notes}
              onChange={(event) => setConsultationForm((current) => ({ ...current, notes: event.target.value }))}
            />
          </label>
          <button className="primary-button" type="submit" disabled={disabled || saving || patients.length === 0}>
            {saving
              ? UI_MESSAGES.SAVING
              : editingConsultationId
                ? UI_MESSAGES.UPDATE_CONSULTATION
                : UI_MESSAGES.ADD_CONSULTATION}
          </button>
        </form>
      </div>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>CID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Town</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation) => (
              <tr key={consultation.id}>
                <td data-label="Patient">{consultation.patient?.full_name ?? "-"}</td>
                <td data-label="CID">{consultation.patient?.cid ?? "-"}</td>
                <td data-label="Date">{formatDateTime(consultation.appointment_date)}</td>
                <td data-label="Status">
                  <span className={`status ${consultation.status}`}>{consultation.status}</span>
                </td>
                <td data-label="Town">{consultation.patient?.town ?? "-"}</td>
                <td data-label="Actions">
                  <div className="actions-cell">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => startEdit(consultation)}
                      disabled={disabled || saving}
                    >
                      Edit
                    </button>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => void handleDelete(consultation.id)}
                      disabled={disabled || saving}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {consultations.length === 0 && (
              <tr>
                <td className="empty-state" colSpan={6}>
                  {UI_MESSAGES.NO_CONSULTATIONS}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
