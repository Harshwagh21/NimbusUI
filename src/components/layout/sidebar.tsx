"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StorageMeter } from "@/components/layout/storage-meter";
import { useUiStore } from "@/stores/ui";

const nav = [
  { href: "/drive", label: "My Drive" },
  { href: "/shared", label: "Shared" },
  { href: "/starred", label: "Starred" },
  { href: "/recent", label: "Recent" },
  { href: "/trash", label: "Trash" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const open = useUiStore((s) => s.sidebarOpen);

  if (!open) return null;

  return (
    <aside
      className="flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]"
      aria-label="Primary"
    >
      <div className="px-4 py-5">
        <Link
          href="/drive"
          className="font-display text-lg font-semibold tracking-tight text-[var(--brand-deep)]"
        >
          NimbusCloud
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {nav.map((item) => {
          const active =
            item.href === "/drive"
              ? pathname === "/drive" || pathname.startsWith("/drive/")
              : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                active
                  ? "bg-[var(--surface-muted)] font-medium text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[var(--border)] p-4">
        <StorageMeter />
      </div>
    </aside>
  );
}
