import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth/session";
import { ApiError, parseApiError } from "@/lib/api/errors";
import type { SessionResponse } from "@/types/auth";

const defaultBase = "http://localhost:8080";

export function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || defaultBase;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Skip Authorization header (login/register/refresh). */
  skipAuth?: boolean;
  /** Internal: do not attempt refresh on 401. */
  _retried?: boolean;
};

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${apiBaseUrl()}/api/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        clearAccessToken();
        return false;
      }
      const data = (await res.json()) as SessionResponse;
      setAccessToken(data.access_token);
      return true;
    } catch {
      clearAccessToken();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/** Exposed for the auth gate: try cookie refresh once when memory has no token. */
export async function trySilentRefresh(): Promise<boolean> {
  return refreshAccessToken();
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, skipAuth, _retried, headers: extraHeaders, ...init } = options;
  const headers = new Headers(extraHeaders);

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers,
    credentials: "include",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 401 && !skipAuth && !_retried) {
    const ok = await refreshAccessToken();
    if (ok) {
      return apiRequest<T>(path, { ...options, _retried: true });
    }
    throw await parseApiError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    throw await parseApiError(res);
  }

  if (res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export { ApiError };
