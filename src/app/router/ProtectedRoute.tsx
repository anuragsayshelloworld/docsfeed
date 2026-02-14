import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthSession } from '../../shared/lib/auth-storage';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const session = getAuthSession();

  if (!session?.userId) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
