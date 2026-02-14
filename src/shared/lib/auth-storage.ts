import type { AuthSession } from '../types/auth';

const AUTH_STORAGE_KEY = 'auth';

export function getAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (!parsed.userId || !parsed.username) return null;

    return {
      userId: parsed.userId,
      username: parsed.username,
      role: typeof parsed.role === 'number' ? parsed.role : 0,
      image: parsed.image ?? null,
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now(),
    };
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
