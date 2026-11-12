"use client";

import Link from "next/link";
import type { Folder } from "@/types/folder";

type Props = {
  path: Folder[];
};

export function Breadcrumbs({ path }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link
            href="/drive"
            className="rounded-sm text-(--muted) hover:text-foreground focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
          >
            My Drive
          </Link>
        </li>
        {path.map((folder, index) => {
          const isLast = index === path.length - 1;
          return (
            <li key={folder.id} className="flex items-center gap-1">
              <span aria-hidden className="text-(--muted)">
                /
              </span>
              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {folder.name}
                </span>
              ) : (
                <Link
                  href={`/drive/${folder.id}`}
                  className="rounded-sm text-(--muted) hover:text-foreground focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                >
                  {folder.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
