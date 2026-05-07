import { useState, type FormEvent } from "react";
import type { Patient, PatientInput } from "../../types/models";
import { UI_MESSAGES } from "../../constants/ui";
import { validatePatientForm } from "../../utils/validation";

type PatientsViewProps = {
  patients: Patient[];
  disabled: boolean;
  saving: boolean;
  onCreate: (input: PatientInput) => Promise<boolean>;
  onUpdate: (id: string, input: PatientInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
};

const emptyPatientForm: PatientInput = {
  full_name: "",
  cid: "",
  birth_date: "",
  town: ""
};

export function PatientsView({ patients, disabled, saving, onCreate, onUpdate, onDelete }: PatientsViewProps) {
  const [patientForm, setPatientForm] = useState<PatientInput>(emptyPatientForm);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  function resetForm() {
    setPatientForm(emptyPatientForm);
    setEditingPatientId(null);
    setFormErrors([]);
  }

  function startEdit(patient: Patient) {
    setEditingPatientId(patient.id);
    setPatientForm({
      full_name: patient.full_name,
      cid: patient.cid,
      birth_date: patient.birth_date,
      town: patient.town
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const payload = {
      full_name: patientForm.full_name.trim(),
      cid: patientForm.cid.trim(),
      birth_date: patientForm.birth_date,
      town: patientForm.town.trim()
    };

    const errors = validatePatientForm(payload.full_name, payload.cid, payload.birth_date, payload.town);
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);

    const saved = editingPatientId ? await onUpdate(editingPatientId, payload) : await onCreate(payload);

    if (saved) {
      resetForm();
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm(UI_MESSAGES.CONFIRM_DELETE_PATIENT)) {
      await onDelete(id);
      if (editingPatientId === id) {
        resetForm();
      }
    }
  }

  return (
    <section className="workspace">
      <div className="panel">
        <div className="panel-header">
          <h3>{editingPatientId ? "Edit patient" : "Add patient"}</h3>
          {editingPatientId && (
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

        <form className="form" onSubmit={handleSubmit}>
          <label>
            <span>Patient name</span>
            <input
              required
              placeholder="Full name"
              value={patientForm.full_name}
              onChange={(event) => setPatientForm((current) => ({ ...current, full_name: event.target.value }))}
            />
          </label>
          <label>
            <span>CID</span>
            <input
              required
              placeholder="CID"
              value={patientForm.cid}
              onChange={(event) => setPatientForm((current) => ({ ...current, cid: event.target.value }))}
            />
          </label>
          <label>
            <span>Birth date</span>
            <input
              required
              type="date"
              value={patientForm.birth_date}
              onChange={(event) => setPatientForm((current) => ({ ...current, birth_date: event.target.value }))}
            />
          </label>
          <label>
            <span>Town</span>
            <input
              required
              placeholder="Town"
              value={patientForm.town}
              onChange={(event) => setPatientForm((current) => ({ ...current, town: event.target.value }))}
            />
          </label>
          <button className="primary-button" type="submit" disabled={disabled || saving}>
            {saving ? UI_MESSAGES.SAVING : editingPatientId ? UI_MESSAGES.UPDATE_PATIENT : UI_MESSAGES.ADD_PATIENT}
          </button>
        </form>
      </div>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>CID</th>
              <th>Birth date</th>
              <th>Town</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td data-label="Name">{patient.full_name}</td>
                <td data-label="CID">{patient.cid}</td>
                <td data-label="Birth date">{patient.birth_date}</td>
                <td data-label="Town">{patient.town}</td>
                <td data-label="Actions">
                  <div className="actions-cell">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => startEdit(patient)}
                      disabled={disabled || saving}
                    >
                      Edit
                    </button>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => void handleDelete(patient.id)}
                      disabled={disabled || saving}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td className="empty-state" colSpan={5}>
                  {UI_MESSAGES.NO_PATIENTS}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
