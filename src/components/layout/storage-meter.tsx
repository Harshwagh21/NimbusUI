"use client";

import { useAuth } from "@/hooks/use-auth";
import { formatBytes } from "@/lib/utils/bytes";

export function StorageMeter() {
  const { user } = useAuth();
  const used = user?.storage_used ?? 0;
  const limit = user?.storage_limit ?? 0;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div aria-label="Storage usage">
      <div className="mb-1 flex justify-between text-xs text-[var(--muted)]">
        <span>Storage</span>
        <span>
          {formatBytes(used)} / {formatBytes(limit)}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
