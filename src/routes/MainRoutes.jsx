import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../infrastructures/ProtectedRoute";
import LoaderSpinner from "../LoaderSpinner";
import Login from "../pages/Login";
import { ModeProvider } from "../context/ModeContext";

const Documentation = lazy(() =>
  import(
    "../components/nested-components/maincontent-nested-components/pages/Documentation"
  )
);
const Editor = lazy(() =>
  import(
    "../components/nested-components/maincontent-nested-components/pages/Editor"
  )
);
const DocumentViewer = lazy(() =>
  import(
    "../components/nested-components/maincontent-nested-components/pages/DocumentViewer"
  )
);

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <ModeProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<LoaderSpinner />}>
                  <Documentation />
                </Suspense>
              }
            />
            <Route
              path="editor/:dummy?"
              element={
                <Suspense fallback={<LoaderSpinner />}>
                  <Editor />
                </Suspense>
              }
            />
            <Route
              path="viewer/:id"
              element={
                <Suspense fallback={<LoaderSpinner />}>
                  <DocumentViewer />
                </Suspense>
              }
            />
          </Route>

          <Route path="login" element={<Login />} />
        </Routes>
      </ModeProvider>
    </BrowserRouter>
  );
}
