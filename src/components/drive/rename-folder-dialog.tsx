"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { messageForError } from "@/lib/api/error-message";
import {
  createFolderSchema,
  type CreateFolderValues,
} from "@/lib/folders/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Folder } from "@/types/folder";

type Props = {
  folder: Folder | null;
  pending: boolean;
  error: unknown;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
};

export function RenameFolderDialog({
  folder,
  pending,
  error,
  onClose,
  onSubmit,
}: Props) {
  const titleId = useId();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFolderValues>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: { name: folder?.name ?? "" },
  });

  useEffect(() => {
    if (!folder) return;
    reset({ name: folder.name });
  }, [folder, reset]);

  if (!folder) return null;

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values.name);
      onClose();
    } catch {
      // parent keeps error for display
    }
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-sm rounded-lg border border-(--border) bg-(--surface) p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-base font-semibold text-foreground">
          Rename folder
        </h2>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-4" noValidate>
          <div>
            <Label htmlFor="rename-folder-name">Name</Label>
            <Input
              id="rename-folder-name"
              autoFocus
              invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-(--danger)" role="alert">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          {error ? (
            <p className="text-sm text-(--danger)" role="alert">
              {messageForError(error)}
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
