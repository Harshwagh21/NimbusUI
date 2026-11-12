import { z } from "zod";

/** Mirrors Go folder name rules: trim, required, max 255. */
export const folderNameSchema = z
  .string()
  .trim()
  .min(1, "folder name is required")
  .max(255, "folder name is too long");

export const createFolderSchema = z.object({
  name: folderNameSchema,
});

export type CreateFolderValues = z.infer<typeof createFolderSchema>;
