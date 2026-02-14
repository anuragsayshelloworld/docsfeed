import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../../widgets/layout/AppLayout';
import { getAuthSession } from '../../shared/lib/auth-storage';
import { LoaderSpinner } from '../../shared/ui/LoaderSpinner';
import { LoginPage } from '../../features/auth/ui/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';

const DocumentsPage = lazy(async () =>
  import('../../features/documents/ui/DocumentsPage').then((module) => ({
    default: module.DocumentsPage,
  })),
);

const EditorPage = lazy(async () =>
  import('../../features/editor/ui/EditorPage').then((module) => ({
    default: module.EditorPage,
  })),
);

const DocumentViewerPage = lazy(async () =>
  import('../../features/documents/ui/DocumentViewerPage').then((module) => ({
    default: module.DocumentViewerPage,
  })),
);

function RouteSuspense({ children }: { children: ReactNode }): JSX.Element {
  return <Suspense fallback={<LoaderSpinner />}>{children}</Suspense>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }): JSX.Element {
  const session = getAuthSession();
  if (session?.userId) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export function MainRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <RouteSuspense>
                <DocumentsPage />
              </RouteSuspense>
            }
          />
          <Route
            path="editor/:id?"
            element={
              <RouteSuspense>
                <EditorPage />
              </RouteSuspense>
            }
          />
          <Route
            path="viewer/:id"
            element={
              <RouteSuspense>
                <DocumentViewerPage />
              </RouteSuspense>
            }
          />
        </Route>

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
