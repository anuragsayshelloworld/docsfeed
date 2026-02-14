import { AlertCircle, Home, RotateCcw } from 'lucide-react';

export function FallbackPage(): JSX.Element {
  const goHome = (): void => {
    window.location.href = '/';
  };

  const refreshPage = (): void => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15">
            <AlertCircle className="h-8 w-8 text-rose-300" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-slate-100">Something went wrong</h1>
          <p className="leading-relaxed text-slate-400">
            The app hit an unexpected error. Refresh the page or return home.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={refreshPage}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition-colors hover:bg-cyan-400"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>

          <button
            type="button"
            onClick={goHome}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 font-medium text-slate-200 transition-colors hover:bg-slate-800"
          >
            <Home className="h-4 w-4" />
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
}
