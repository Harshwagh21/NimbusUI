import { apiRequest } from "@/lib/api/client";
import type {
  CreateFolderBody,
  Folder,
  FolderPathResponse,
  FoldersResponse,
} from "@/types/folder";

export function listFolders(parentId?: string | null): Promise<FoldersResponse> {
  const query =
    parentId === undefined || parentId === null
      ? ""
      : `?parent_id=${encodeURIComponent(parentId)}`;
  return apiRequest<FoldersResponse>(`/api/v1/folders${query}`, { method: "GET" });
}

export function getFolder(id: string): Promise<Folder> {
  return apiRequest<Folder>(`/api/v1/folders/${id}`, { method: "GET" });
}

export function getFolderPath(id: string): Promise<FolderPathResponse> {
  return apiRequest<FolderPathResponse>(`/api/v1/folders/${id}/path`, {
    method: "GET",
  });
}

export function createFolder(body: CreateFolderBody): Promise<Folder> {
  return apiRequest<Folder>("/api/v1/folders", {
    method: "POST",
    body,
  });
}

export function updateFolder(
  id: string,
  body: { name?: string; parent_id?: string | null },
): Promise<Folder> {
  return apiRequest<Folder>(`/api/v1/folders/${id}`, {
    method: "PATCH",
    body,
  });
}

export function deleteFolder(id: string): Promise<void> {
  return apiRequest<void>(`/api/v1/folders/${id}`, { method: "DELETE" });
}
