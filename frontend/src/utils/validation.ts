/**
 * Form validation utilities for patient and consultation forms.
 */

/**
 * Validates patient form input.
 * @param fullName Patient's full name
 * @param cid Patient's identification number
 * @param birthDate Patient's birth date
 * @param town Patient's town
 * @returns Array of validation errors, empty if valid
 */
export function validatePatientForm(
  fullName: string,
  cid: string,
  birthDate: string,
  town: string
): string[] {
  const errors: string[] = [];

  if (!fullName.trim()) {
    errors.push("Patient name is required");
  }

  if (!cid.trim()) {
    errors.push("CID is required");
  }

  if (!birthDate) {
    errors.push("Birth date is required");
  } else {
    const date = new Date(birthDate);
    if (Number.isNaN(date.getTime())) {
      errors.push("Invalid birth date");
    } else if (date > new Date()) {
      errors.push("Birth date cannot be in the future");
    }
  }

  if (!town.trim()) {
    errors.push("Town is required");
  }

  return errors;
}

/**
 * Validates consultation form input.
 * @param patientId Selected patient ID
 * @param appointmentDate Appointment date-time string
 * @param reason Consultation reason
 * @returns Array of validation errors, empty if valid
 */
export function validateConsultationForm(
  patientId: string,
  appointmentDate: string,
  reason: string
): string[] {
  const errors: string[] = [];

  if (!patientId) {
    errors.push("Patient selection is required");
  }

  if (!appointmentDate) {
    errors.push("Appointment date and time are required");
  } else {
    const date = new Date(appointmentDate);
    if (Number.isNaN(date.getTime())) {
      errors.push("Invalid appointment date");
    }
  }

  if (!reason.trim()) {
    errors.push("Reason is required");
  }

  return errors;
}

/**
 * Trims all string fields in an object.
 * @param obj Object with string properties
 * @returns New object with trimmed string values
 */
export function trimStringFields<T extends Record<string, unknown>>(obj: T): T {
  const trimmed = { ...obj };

  for (const key in trimmed) {
    if (typeof trimmed[key] === "string") {
      (trimmed[key] as string) = (trimmed[key] as string).trim();
    }
  }

  return trimmed;
}
