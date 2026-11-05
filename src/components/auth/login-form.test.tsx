import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/auth/login-form";
import { clearAccessToken, getAccessToken } from "@/lib/auth/session";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

function renderForm() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <LoginForm />
    </QueryClientProvider>,
  );
}

describe("LoginForm", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    clearAccessToken();
    replace.mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("shows an inline error for invalid credentials", async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: { code: "INVALID_CREDENTIALS", message: "email or password is incorrect" },
        }),
        { status: 401 },
      ),
    );

    renderForm();
    await user.type(screen.getByLabelText("Email"), "ada@nimbus.test");
    await user.type(screen.getByLabelText("Password"), "wrong-pass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /email or password is incorrect/i,
    );
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects to /drive after a successful login", async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          access_token: "tok",
          expires_in: 900,
          user: {
            id: "1",
            email: "ada@nimbus.test",
            name: "Ada",
            storage_used: 0,
            storage_limit: 10,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    renderForm();
    await user.type(screen.getByLabelText("Email"), "ada@nimbus.test");
    await user.type(screen.getByLabelText("Password"), "password1");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/drive"));
    expect(getAccessToken()).toBe("tok");
  });
});
