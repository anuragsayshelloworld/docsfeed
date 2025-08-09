import MainRoutes from "./routes/MainRoutes";
import ErrorBoundary from "./infrastructures/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <MainRoutes />
    </ErrorBoundary>
  );
}
