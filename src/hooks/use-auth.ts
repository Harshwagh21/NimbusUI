"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authApi from "@/lib/api/auth";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth/session";
import type { LoginBody, RegisterBody, User } from "@/types/auth";

export const meQueryKey = ["me"] as const;

export function useMe(enabled = true) {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: authApi.me,
    enabled: enabled && !!getAccessToken(),
    retry: false,
  });
}

export function useAuth() {
  const queryClient = useQueryClient();
  const me = useMe();

  const applySession = (accessToken: string, user: User) => {
    setAccessToken(accessToken);
    queryClient.setQueryData(meQueryKey, user);
  };

  const login = useMutation({
    mutationFn: (body: LoginBody) => authApi.login(body),
    onSuccess: (session) => applySession(session.access_token, session.user),
  });

  const register = useMutation({
    mutationFn: (body: RegisterBody) => authApi.register(body),
    onSuccess: (session) => applySession(session.access_token, session.user),
  });

  const logout = useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } finally {
        clearAccessToken();
        queryClient.clear();
      }
    },
  });

  return {
    user: me.data,
    isLoadingUser: me.isLoading || me.isFetching,
    login,
    register,
    logout,
    refetchMe: me.refetch,
  };
}
