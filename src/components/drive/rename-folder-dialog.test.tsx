import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RenameFolderDialog } from "@/components/drive/rename-folder-dialog";
import type { Folder } from "@/types/folder";

const folder: Folder = {
  id: "11111111-1111-1111-1111-111111111111",
  parent_id: null,
  name: "Docs",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("RenameFolderDialog", () => {
  afterEach(() => cleanup());

  it("shows a validation error for an empty name", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <RenameFolderDialog
        folder={folder}
        pending={false}
        error={null}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.clear(screen.getByLabelText("Name"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("folder name is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
