"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { messageForError } from "@/lib/api/error-message";
import {
  createFolderSchema,
  type CreateFolderValues,
} from "@/lib/folders/schemas";
import { useCreateFolder } from "@/hooks/use-folders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  parentId?: string | null;
  onClose: () => void;
};

export function CreateFolderDialog({ open, parentId, onClose }: Props) {
  const titleId = useId();
  const create = useCreateFolder(parentId);
  const resetMutation = create.reset;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFolderValues>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({ name: "" });
    resetMutation();
  }, [open, reset, resetMutation]);

  if (!open) return null;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await create.mutateAsync({ name: values.name, parent_id: parentId ?? null });
      onClose();
    } catch {
      // error rendered from create.error below
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
          New folder
        </h2>
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4" noValidate>
          <div>
            <Label htmlFor="folder-name">Name</Label>
            <Input
              id="folder-name"
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

          {create.error ? (
            <p className="text-sm text-(--danger)" role="alert">
              {messageForError(create.error)}
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || create.isPending}>
              {create.isPending ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
