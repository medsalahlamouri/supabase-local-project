/**
 * UI Message constants used throughout the app.
 * Centralizing messages for consistency and easier maintenance.
 */
export const UI_MESSAGES = {
  // Errors
  SUPABASE_NOT_CONFIGURED:
    "Supabase is not configured. Copy frontend/.env.example to frontend/.env and fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
  SUPABASE_CONFIG_WARNING: "Supabase is not configured yet.",
  ERROR_LOAD_DATA: "Unable to load clinic data.",
  ERROR_ADD_PATIENT: "Unable to add patient.",
  ERROR_UPDATE_PATIENT: "Unable to update patient.",
  ERROR_DELETE_PATIENT: "Unable to delete patient.",
  ERROR_ADD_CONSULTATION: "Unable to add consultation.",
  ERROR_UPDATE_CONSULTATION: "Unable to update consultation.",
  ERROR_DELETE_CONSULTATION: "Unable to delete consultation.",

  // Success
  SUCCESS_ADD_PATIENT: "Patient added.",
  SUCCESS_UPDATE_PATIENT: "Patient updated.",
  SUCCESS_DELETE_PATIENT: "Patient deleted.",
  SUCCESS_ADD_CONSULTATION: "Consultation added.",
  SUCCESS_UPDATE_CONSULTATION: "Consultation updated.",
  SUCCESS_DELETE_CONSULTATION: "Consultation deleted.",

  // Confirmations
  CONFIRM_DELETE_PATIENT: "Delete this patient?",
  CONFIRM_DELETE_CONSULTATION: "Delete this consultation?",

  // Loading states
  LOADING: "Loading data...",
  SAVING: "Saving...",

  // Empty states
  NO_PATIENTS: "No patients found.",
  NO_CONSULTATIONS: "No consultations found.",

  // Button labels
  CANCEL_EDIT: "Cancel edit",
  ADD_PATIENT: "Add patient",
  UPDATE_PATIENT: "Update patient",
  ADD_CONSULTATION: "Add consultation",
  UPDATE_CONSULTATION: "Update consultation",
} as const;
