import type { ConsultationStatus } from "../types/models";

/**
 * Consultation status options with labels for UI display.
 * Used in select dropdowns and status badges throughout the app.
 */
export const CONSULTATION_STATUS_OPTIONS: Array<{
  value: ConsultationStatus;
  label: string;
}> = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" }
];

/**
 * Get display label for a consultation status.
 * @param status The consultation status value
 * @returns The human-readable label
 */
export function getStatusLabel(status: ConsultationStatus): string {
  return CONSULTATION_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

/**
 * Check if a consultation status represents a past event.
 * @param status The consultation status
 * @returns true if the consultation is completed or cancelled
 */
export function isStatusClosed(status: ConsultationStatus): boolean {
  return status === "completed" || status === "cancelled";
}
