/**
 * Error handling utilities for consistent error management across the app.
 */

/**
 * Extracts a readable error message from various error sources.
 * Handles Error objects, Supabase errors, and unknown error types.
 *
 * @param error The error object from any source
 * @param fallback Default message if error cannot be parsed
 * @returns Human-readable error message
 */
export function extractErrorMessage(error: unknown, fallback: string): string {
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle Supabase API errors with message property
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as Record<string, unknown>).message;
    if (typeof message === "string") {
      return message;
    }
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Fallback for unknown error types
  return fallback;
}

/**
 * Async wrapper that ensures errors are properly handled and logged.
 * Useful for wrapping async operations with consistent error handling.
 *
 * @param fn Async function to execute
 * @param errorMessage Message to log if error occurs
 * @returns Result or throws Error with extracted message
 */
export async function executeAsync<T>(
  fn: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const message = extractErrorMessage(error, errorMessage);
    if (import.meta.env.DEV) {
      console.error(message, error);
    }
    throw new Error(message);
  }
}
