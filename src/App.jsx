import ErrorBoundary from "./infrastructures/ErrorBoundary";
import Layout from "./layout/Layout";

export default function App() {
  return (
    <ErrorBoundary>
      <Layout></Layout>
    </ErrorBoundary>
  );
}
