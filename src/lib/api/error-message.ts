import { isApiError } from "@/lib/api/errors";

const messages: Record<string, string> = {
  INVALID_CREDENTIALS: "Email or password is incorrect.",
  EMAIL_TAKEN: "An account with that email already exists.",
  WEAK_PASSWORD: "Password must be 8 to 72 characters.",
  RATE_LIMITED: "Too many attempts. Please wait a moment and try again.",
  VALIDATION_ERROR: "Please check your details and try again.",
  UNAUTHENTICATED: "Please sign in again.",
  INVALID_REFRESH_TOKEN: "Your session expired. Please sign in again.",
  REFRESH_REUSED: "Your session expired. Please sign in again.",
};

export function messageForError(err: unknown, fallback = "Something went wrong."): string {
  if (isApiError(err) && messages[err.code]) return messages[err.code];
  if (isApiError(err) && err.message) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
