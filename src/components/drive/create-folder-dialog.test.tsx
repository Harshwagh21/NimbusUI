import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CreateFolderDialog } from "@/components/drive/create-folder-dialog";
import { clearAccessToken, setAccessToken } from "@/lib/auth/session";

function renderDialog() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const onClose = vi.fn();
  render(
    <QueryClientProvider client={client}>
      <CreateFolderDialog open parentId={null} onClose={onClose} />
    </QueryClientProvider>,
  );
  return { onClose };
}

describe("CreateFolderDialog", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    clearAccessToken();
  });

  beforeEach(() => {
    setAccessToken("test-token");
    vi.stubGlobal("fetch", vi.fn());
  });

  it("shows a validation error for an empty name", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await screen.findByText("folder name is required")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("creates a folder and closes on success", async () => {
    const user = userEvent.setup();
    const { onClose } = renderDialog();
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: "11111111-1111-1111-1111-111111111111",
          parent_id: null,
          name: "Docs",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      ),
    );

    await user.type(screen.getByLabelText("Name"), "Docs");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(fetch).toHaveBeenCalled();
  });
});
