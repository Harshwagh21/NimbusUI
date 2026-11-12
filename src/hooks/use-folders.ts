"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as foldersApi from "@/lib/api/folders";
import type { CreateFolderBody } from "@/types/folder";

export function foldersQueryKey(parentId?: string | null) {
  return ["folders", parentId ?? "root"] as const;
}

export function folderQueryKey(id: string) {
  return ["folder", id] as const;
}

export function folderPathQueryKey(id: string) {
  return ["folder-path", id] as const;
}

export function useFolders(parentId?: string | null) {
  return useQuery({
    queryKey: foldersQueryKey(parentId),
    queryFn: () => foldersApi.listFolders(parentId),
  });
}

export function useCreateFolder(parentId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateFolderBody) =>
      foldersApi.createFolder({
        name: body.name,
        parent_id: body.parent_id ?? parentId ?? null,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: foldersQueryKey(parentId) });
    },
  });
}
