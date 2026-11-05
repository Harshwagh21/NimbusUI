"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { meQueryKey } from "@/hooks/use-auth";
import * as authApi from "@/lib/api/auth";
import { trySilentRefresh } from "@/lib/api/client";
import { getAccessToken, setAccessToken } from "@/lib/auth/session";

type Status = "checking" | "authed" | "anon";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (getAccessToken()) {
        if (!cancelled) setStatus("authed");
        return;
      }

      const refreshed = await trySilentRefresh();
      if (cancelled) return;

      if (!refreshed || !getAccessToken()) {
        setStatus("anon");
        router.replace("/login");
        return;
      }

      try {
        const user = await authApi.me();
        if (cancelled) return;
        queryClient.setQueryData(meQueryKey, user);
        setStatus("authed");
      } catch {
        if (cancelled) return;
        setAccessToken(null);
        setStatus("anon");
        router.replace("/login");
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [queryClient, router]);

  if (status === "checking") {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  if (status !== "authed") return null;

  return <AppShell>{children}</AppShell>;
}
