"use client";

import { useState } from "react";
import { CreateFolderDialog } from "@/components/drive/create-folder-dialog";
import { FolderList } from "@/components/drive/folder-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { useFolders } from "@/hooks/use-folders";
import { messageForError } from "@/lib/api/error-message";

type Props = {
  parentId?: string | null;
  title?: string;
};

export function DriveBrowser({ parentId = null, title = "My Drive" }: Props) {
  const { data, isLoading, isError, error, refetch, isFetching } = useFolders(parentId);
  const [createOpen, setCreateOpen] = useState(false);
  const folders = data?.folders ?? [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <Button type="button" onClick={() => setCreateOpen(true)}>
          New folder
        </Button>
      </div>

      {isLoading ? <FolderListSkeleton /> : null}

      {!isLoading && isError ? (
        <div className="flex flex-col items-start gap-3 rounded-md border border-(--border) bg-(--surface) p-4">
          <p className="text-sm text-(--danger)" role="alert">
            {messageForError(error, "Could not load folders.")}
          </p>
          <Button type="button" variant="ghost" onClick={() => void refetch()}>
            {isFetching ? "Retrying…" : "Retry"}
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && folders.length === 0 ? (
        <EmptyState
          title="Your sky is clear"
          description="Create a folder to start organizing — uploads arrive in a later phase."
        />
      ) : null}

      {!isLoading && !isError && folders.length > 0 ? (
        <FolderList folders={folders} />
      ) : null}

      <CreateFolderDialog
        open={createOpen}
        parentId={parentId}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}

function FolderListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-14 animate-pulse rounded-md border border-(--border) bg-(--surface-muted)"
        />
      ))}
    </div>
  );
}
