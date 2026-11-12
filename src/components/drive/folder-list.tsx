"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Folder } from "@/types/folder";

type Props = {
  folders: Folder[];
  onRename: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
  busyId?: string | null;
};

export function FolderList({ folders, onRename, onDelete, busyId }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {folders.map((folder) => {
        const busy = busyId === folder.id;
        return (
          <li key={folder.id}>
            <div className="flex items-stretch gap-1 rounded-md border border-(--border) bg-(--surface) p-1">
              <Link
                href={`/drive/${folder.id}`}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm transition hover:bg-(--surface-muted) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
              >
                <span
                  aria-hidden
                  className="h-9 w-9 shrink-0 rounded-md border border-(--border) bg-(--surface-muted)"
                />
                <span className="min-w-0 truncate font-medium text-foreground">
                  {folder.name}
                </span>
              </Link>
              <div className="flex shrink-0 flex-col justify-center gap-1 p-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="px-2 py-1 text-xs"
                  disabled={busy}
                  onClick={() => onRename(folder)}
                >
                  Rename
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-2 py-1 text-xs text-(--danger)"
                  disabled={busy}
                  onClick={() => onDelete(folder)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
