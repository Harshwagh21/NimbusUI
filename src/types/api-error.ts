export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "WEAK_PASSWORD"
  | "EMAIL_TAKEN"
  | "INVALID_CREDENTIALS"
  | "UNAUTHENTICATED"
  | "INVALID_REFRESH_TOKEN"
  | "REFRESH_REUSED"
  | "RATE_LIMITED"
  | string;
