export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  storage_used: number;
  storage_limit: number;
};

export type SessionResponse = {
  access_token: string;
  expires_in: number;
  user: User;
};

export type RegisterBody = {
  email: string;
  password: string;
  name: string;
};

export type LoginBody = {
  email: string;
  password: string;
};
