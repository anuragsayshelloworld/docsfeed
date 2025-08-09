import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import { lazy, Suspense } from "react";
import LoaderSpinner from "../LoaderSpinner";
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
                <Editor />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
