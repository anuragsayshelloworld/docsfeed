import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import { lazy, Suspense } from "react";
import LoaderSpinner from "../LoaderSpinner";
import Documentation from "../components/nested-components/maincontent-nested-components/pages/Documentation";
import DocumentViewer from "../components/nested-components/maincontent-nested-components/pages/DocumentViewer";
const Editor = lazy(() =>
  import(
    "../components/nested-components/maincontent-nested-components/pages/Editor"
  )
);
export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<LoaderSpinner />}>
                <Documentation />
              </Suspense>
            }
          />
          <Route path="/editor" element={<Editor />} />
          <Route path="/viewer/:id" element={<DocumentViewer />} />
        </Route>
        <Route path="/login" element={<h1>login</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
