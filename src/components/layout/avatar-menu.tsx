"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function AvatarMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const onLogout = async () => {
    setOpen(false);
    await logout.mutateAsync();
    router.replace("/login");
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="gap-2 px-2"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white"
          aria-hidden
        >
          {(user?.name?.[0] || "?").toUpperCase()}
        </span>
        <span className="hidden max-w-[10rem] truncate text-sm sm:inline">
          {user?.name ?? "Account"}
        </span>
      </Button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-56 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 shadow-sm"
        >
          <p className="truncate px-2 py-1 text-sm font-medium">{user?.name}</p>
          <p className="truncate px-2 pb-2 text-xs text-[var(--muted)]">{user?.email}</p>
          <Button
            variant="ghost"
            className="w-full justify-start"
            role="menuitem"
            onClick={onLogout}
            disabled={logout.isPending}
          >
            Sign out
          </Button>
        </div>
      ) : null}
    </div>
  );
}
