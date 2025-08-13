import { lazy, Suspense, useEffect, useState } from "react";
import { fetchDocuments } from "../../../../firebase";
import SearchBar from "./documentation-components/SearchBar";
import LoaderSpinner from "../../../../LoaderSpinner";
const DocumentsList = lazy(() =>
  import("./documentation-components/DocumentList")
);

export default function Documentation() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const fetchDocs = await fetchDocuments();
      setDocuments(fetchDocs || []);
      setIsLoading(false);
    }
    fetch();
  }, []);

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
