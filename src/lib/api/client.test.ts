import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "@/lib/api/client";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth/session";
import { ApiError } from "@/lib/api/errors";

describe("apiRequest", () => {
  beforeEach(() => {
    clearAccessToken();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearAccessToken();
  });

  it("parses the API error envelope", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: { code: "VALIDATION_ERROR", message: "bad" },
        }),
        { status: 400 },
      ),
    );

    await expect(
      apiRequest("/api/v1/me", { skipAuth: true }),
    ).rejects.toMatchObject({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "bad",
    } satisfies Partial<ApiError>);
  });

  it("refreshes once on 401 then replays the original request", async () => {
    setAccessToken("expired");
    const fetchMock = vi.mocked(fetch);

    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            access_token: "fresh",
            expires_in: 900,
            user: {
              id: "1",
              email: "a@b.co",
              name: "A",
              storage_used: 0,
              storage_limit: 1,
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "1",
            email: "a@b.co",
            name: "A",
            storage_used: 0,
            storage_limit: 1,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );

    const user = await apiRequest<{ id: string }>("/api/v1/me");

    expect(user.id).toBe("1");
    expect(getAccessToken()).toBe("fresh");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[1][0])).toContain("/api/v1/auth/refresh");
  });

  it("single-flights concurrent 401 refreshes", async () => {
    setAccessToken("expired");
    const fetchMock = vi.mocked(fetch);
    let refreshCalls = 0;

    fetchMock.mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("/auth/refresh")) {
        refreshCalls += 1;
        await new Promise((r) => setTimeout(r, 20));
        return new Response(
          JSON.stringify({
            access_token: "fresh",
            expires_in: 900,
            user: {
              id: "1",
              email: "a@b.co",
              name: "A",
              storage_used: 0,
              storage_limit: 1,
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (getAccessToken() === "expired") {
        return new Response(null, { status: 401 });
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    const [a, b] = await Promise.all([
      apiRequest<{ ok: boolean }>("/api/v1/me"),
      apiRequest<{ ok: boolean }>("/api/v1/me"),
    ]);

    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
    expect(refreshCalls).toBe(1);
    expect(getAccessToken()).toBe("fresh");
  });
});
