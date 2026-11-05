import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGate } from "@/components/auth/auth-gate";
import { clearAccessToken } from "@/lib/auth/session";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  usePathname: () => "/drive",
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

describe("AuthGate", () => {
  beforeEach(() => {
    clearAccessToken();
    replace.mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("redirects unauthenticated visits to /login", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 401 }));

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <AuthGate>
          <div>secret drive</div>
        </AuthGate>
      </QueryClientProvider>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
    expect(screen.queryByText("secret drive")).not.toBeInTheDocument();
  });
});
