"use client";

import Link from "next/link";
import type { Folder } from "@/types/folder";

type Props = {
  folders: Folder[];
};

export function FolderList({ folders }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {folders.map((folder) => (
        <li key={folder.id}>
          <Link
            href={`/drive/${folder.id}`}
            className="flex items-center gap-3 rounded-md border border-(--border) bg-(--surface) px-4 py-3 text-sm transition hover:border-(--accent) hover:bg-(--surface-muted) focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
          >
            <span
              aria-hidden
              className="h-9 w-9 shrink-0 rounded-md border border-(--border) bg-(--surface-muted)"
            />
            <span className="min-w-0 truncate font-medium text-foreground">
              {folder.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
