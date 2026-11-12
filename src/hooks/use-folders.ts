"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as foldersApi from "@/lib/api/folders";
import type { CreateFolderBody, Folder, FoldersResponse } from "@/types/folder";

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

export function useFolderPath(folderId: string | null) {
  return useQuery({
    queryKey: folderPathQueryKey(folderId ?? ""),
    queryFn: () => foldersApi.getFolderPath(folderId!),
    enabled: !!folderId,
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

export function useRenameFolder(parentId?: string | null) {
  const queryClient = useQueryClient();
  const listKey = foldersQueryKey(parentId);

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      foldersApi.updateFolder(id, { name }),
    onMutate: async ({ id, name }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<FoldersResponse>(listKey);
      queryClient.setQueryData<FoldersResponse>(listKey, (current) => {
        if (!current) return current;
        return {
          folders: current.folders.map((folder) =>
            folder.id === id ? { ...folder, name } : folder,
          ),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous);
      }
    },
    onSettled: (_data, _err, vars) => {
      void queryClient.invalidateQueries({ queryKey: listKey });
      void queryClient.invalidateQueries({ queryKey: folderPathQueryKey(vars.id) });
      void queryClient.invalidateQueries({ queryKey: folderQueryKey(vars.id) });
    },
  });
}

export function useDeleteFolder(parentId?: string | null) {
  const queryClient = useQueryClient();
  const listKey = foldersQueryKey(parentId);

  return useMutation({
    mutationFn: (id: string) => foldersApi.deleteFolder(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<FoldersResponse>(listKey);
      queryClient.setQueryData<FoldersResponse>(listKey, (current) => {
        if (!current) return current;
        return { folders: current.folders.filter((folder) => folder.id !== id) };
      });
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}

export type { Folder };
