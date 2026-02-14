import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../entities/auth/api/auth-api';
import { setAuthSession } from '../../../shared/lib/auth-storage';

interface LoginFormState {
  username: string;
  password: string;
  showPassword: boolean;
  isSubmitting: boolean;
  error: string;
}

interface ValidationResult {
  valid: boolean;
  message: string;
}

function validateCredentials(username: string, password: string): ValidationResult {
  if (!username || !password) {
    return { valid: false, message: 'Username and password are required' };
  }

  if (username.length < 3 || username.length > 20) {
    return { valid: false, message: 'Username must be 3-20 characters' };
  }

  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }

  return { valid: true, message: '' };
}

export function LoginPage(): JSX.Element {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormState>({
    username: '',
    password: '',
    showPassword: false,
    isSubmitting: false,
    error: '',
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const username = form.username.trim();
    const password = form.password.trim();

    const validation = validateCredentials(username, password);
    if (!validation.valid) {
      setForm((previous) => ({
        ...previous,
        error: validation.message,
      }));
      return;
    }

    setForm((previous) => ({
      ...previous,
      isSubmitting: true,
      error: '',
    }));

    const response = await loginUser(username, password);

    if (!response.success || !response.user) {
      setForm((previous) => ({
        ...previous,
        isSubmitting: false,
        error: response.message,
      }));
      return;
    }

    setAuthSession({
      userId: response.user.id,
      username: response.user.username,
      role: response.user.role,
      image: response.user.image,
      timestamp: Date.now(),
    });

    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xs rounded-2xl border border-slate-700/80 bg-slate-900/85 p-6 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="mb-5 text-center">
          <h1 className="mb-1 text-lg font-semibold text-slate-50">Login</h1>
          <p className="text-xs text-slate-400">Access your DocFeed workspace</p>
        </div>

        <div
          aria-live="polite"
          className={`overflow-hidden transition-all duration-300 ${
            form.error ? 'mb-4 max-h-24 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="rounded-md border border-rose-400/40 bg-rose-500/10 p-2">
            <p className="text-center text-xs text-rose-200">{form.error}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            id="username"
            value={form.username}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                username: event.target.value,
                error: '',
              }))
            }
            type="text"
            placeholder="Username"
            disabled={form.isSubmitting}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400"
          />

          <input
            id="password"
            value={form.password}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                password: event.target.value,
                error: '',
              }))
            }
            type={form.showPassword ? 'text' : 'password'}
            placeholder="Password"
            disabled={form.isSubmitting}
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400"
          />

          <label htmlFor="showPassword" className="flex items-center gap-2 text-sm text-slate-300">
            <input
              id="showPassword"
              type="checkbox"
              checked={form.showPassword}
              onChange={() =>
                setForm((previous) => ({
                  ...previous,
                  showPassword: !previous.showPassword,
                }))
              }
              disabled={form.isSubmitting}
            />
            Show password
          </label>

          <button
            type="submit"
            disabled={form.isSubmitting}
            className="w-full rounded-lg bg-cyan-500 py-2.5 font-medium text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {form.isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
