"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/drive/breadcrumbs";
import { CreateFolderDialog } from "@/components/drive/create-folder-dialog";
import { FolderList } from "@/components/drive/folder-list";
import { RenameFolderDialog } from "@/components/drive/rename-folder-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  useDeleteFolder,
  useFolderPath,
  useFolders,
  useRenameFolder,
} from "@/hooks/use-folders";
import { messageForError } from "@/lib/api/error-message";
import type { Folder } from "@/types/folder";

type Props = {
  parentId?: string | null;
};

export function DriveBrowser({ parentId = null }: Props) {
  const { data, isLoading, isError, error, refetch, isFetching } = useFolders(parentId);
  const pathQuery = useFolderPath(parentId);
  const rename = useRenameFolder(parentId);
  const remove = useDeleteFolder(parentId);

  const [createOpen, setCreateOpen] = useState(false);
  const [renaming, setRenaming] = useState<Folder | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const folders = data?.folders ?? [];
  const path = pathQuery.data?.path ?? [];
  const title = parentId ? (path.at(-1)?.name ?? "Folder") : "My Drive";

  const onDelete = async (folder: Folder) => {
    setActionError(null);
    const ok = window.confirm(
      `Delete “${folder.name}”? It must be empty. This cannot be undone from the UI yet.`,
    );
    if (!ok) return;
    try {
      await remove.mutateAsync(folder.id);
    } catch (err) {
      setActionError(messageForError(err));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          {parentId ? <Breadcrumbs path={path} /> : null}
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        </div>
        <Button type="button" onClick={() => setCreateOpen(true)}>
          New folder
        </Button>
      </div>

      {actionError ? (
        <p className="text-sm text-(--danger)" role="alert">
          {actionError}
        </p>
      ) : null}

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
        <FolderList
          folders={folders}
          busyId={remove.isPending ? remove.variables : null}
          onRename={(folder) => {
            setActionError(null);
            rename.reset();
            setRenaming(folder);
          }}
          onDelete={(folder) => void onDelete(folder)}
        />
      ) : null}

      <CreateFolderDialog
        open={createOpen}
        parentId={parentId}
        onClose={() => setCreateOpen(false)}
      />

      <RenameFolderDialog
        folder={renaming}
        pending={rename.isPending}
        error={rename.error}
        onClose={() => {
          setRenaming(null);
          rename.reset();
        }}
        onSubmit={async (name) => {
          if (!renaming) return;
          await rename.mutateAsync({ id: renaming.id, name });
        }}
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
