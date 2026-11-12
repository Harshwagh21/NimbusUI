export type Folder = {
  id: string;
  parent_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
};

export type FoldersResponse = {
  folders: Folder[];
};

export type FolderPathResponse = {
  path: Folder[];
};

export type CreateFolderBody = {
  name: string;
  parent_id?: string | null;
};
