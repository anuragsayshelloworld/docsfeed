export interface CredentialUser {
  id: string;
  username: string;
  role: number;
  image: string | null;
}

export interface LoginResult {
  success: boolean;
  message: string;
  user: CredentialUser | null;
}
