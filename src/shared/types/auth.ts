export interface AuthSession {
  userId: string;
  username: string;
  role: number;
  image: string | null;
  timestamp: number;
}
