import { apiRequest } from "@/lib/api/client";
import type { LoginBody, RegisterBody, SessionResponse, User } from "@/types/auth";

export function register(body: RegisterBody): Promise<SessionResponse> {
  return apiRequest<SessionResponse>("/api/v1/auth/register", {
    method: "POST",
    body,
    skipAuth: true,
  });
}

export function login(body: LoginBody): Promise<SessionResponse> {
  return apiRequest<SessionResponse>("/api/v1/auth/login", {
    method: "POST",
    body,
    skipAuth: true,
  });
}

export function refresh(): Promise<SessionResponse> {
  return apiRequest<SessionResponse>("/api/v1/auth/refresh", {
    method: "POST",
    skipAuth: true,
  });
}

export function logout(): Promise<void> {
  // Logout is cookie-scoped on the API; skip Bearer so an expired access token
  // does not trigger a pointless refresh before clearing the session.
  return apiRequest<void>("/api/v1/auth/logout", {
    method: "POST",
    skipAuth: true,
  });
}

export function me(): Promise<User> {
  return apiRequest<User>("/api/v1/me", { method: "GET" });
}
