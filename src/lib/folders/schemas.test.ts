import { describe, expect, it } from "vitest";
import { createFolderSchema } from "@/lib/folders/schemas";

describe("createFolderSchema", () => {
  it("rejects blank names", () => {
    expect(createFolderSchema.safeParse({ name: "   " }).success).toBe(false);
  });

  it("rejects names longer than 255", () => {
    expect(
      createFolderSchema.safeParse({ name: "a".repeat(256) }).success,
    ).toBe(false);
  });

  it("trims and accepts a valid name", () => {
    const result = createFolderSchema.safeParse({ name: "  Docs  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Docs");
  });
});
