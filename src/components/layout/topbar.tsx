"use client";

import { AvatarMenu } from "@/components/layout/avatar-menu";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui";

export function Topbar() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <header className="flex h-14 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4">
      <Button
        variant="ghost"
        className="px-2"
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
      >
        Menu
      </Button>
      <div className="flex-1">
        <input
          type="search"
          disabled
          placeholder="Search coming soon"
          aria-label="Search"
          className="w-full max-w-xl rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm text-[var(--muted)]"
        />
      </div>
      <AvatarMenu />
    </header>
  );
}
