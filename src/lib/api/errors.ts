import type { ApiErrorBody, ApiErrorCode } from "@/types/api-error";

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;

  constructor(status: number, code: ApiErrorCode, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

export async function parseApiError(res: Response): Promise<ApiError> {
  let code: ApiErrorCode = "UNKNOWN";
  let message = res.statusText || "request failed";
  try {
    const body = (await res.json()) as ApiErrorBody;
    if (body?.error?.code) code = body.error.code;
    if (body?.error?.message) message = body.error.message;
  } catch {
    // non-JSON body — keep defaults
  }
  return new ApiError(res.status, code, message);
}
