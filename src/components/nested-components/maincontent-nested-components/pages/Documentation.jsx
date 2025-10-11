import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { fetchDocuments } from "../../../../firebase";
import SearchBar from "./documentation-components/SearchBar";
import LoaderSpinner from "../../../../LoaderSpinner";
import ModeContext from "../../../../context/ModeContext";
const DocumentsList = lazy(() =>
  import("./documentation-components/DocumentList")
);

export default function Documentation() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { render, setRender } = useContext(ModeContext);

  useEffect(() => {
    async function fetch() {
      const name = JSON.parse(localStorage.getItem("auth")).username;
      const fetchDocs = await fetchDocuments();

      // Filter by author on the client side
      const userDocs = fetchDocs.filter((doc) => doc.author === name);

      setDocuments(userDocs || []);
      setIsLoading(false);
    }
    fetch();
    if (render) {
      setRender(false);
    }
  }, [render, setRender]);

  const filteredDocs = documents.filter((doc) =>
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Suspense fallback={<LoaderSpinner />}>
        <DocumentsList documents={filteredDocs} isLoading={isLoading} />
      </Suspense>
    </div>
  );
}
