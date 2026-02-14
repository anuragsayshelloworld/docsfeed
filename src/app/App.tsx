import { MainRouter } from './router/MainRouter';
import { ErrorBoundary } from '../shared/ui/ErrorBoundary';

export function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <MainRouter />
    </ErrorBoundary>
  );
}
