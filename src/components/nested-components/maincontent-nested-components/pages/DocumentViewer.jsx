import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FileText } from "lucide-react";
import { fetchDocumentById } from "../../../../firebase";
import LoaderSpinner from "../../../../LoaderSpinner";
import GoBack from "./documentviewer-components/GoBack";
import "../../../../css/viewer.css";

export default function DocumentViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [doc, setDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state) {
      setDoc(location.state);
      sessionStorage.setItem("currentDoc", JSON.stringify(location.state));
      setIsLoading(false);
    } else {
      const storedDoc = sessionStorage.getItem("currentDoc");
      if (storedDoc) {
        setDoc(JSON.parse(storedDoc));
        setIsLoading(false);
      } else if (id) {
        (async () => {
          const fetchedDoc = await fetchDocumentById(id);
          setDoc(fetchedDoc);
          setIsLoading(false);
        })();
      } else {
        setIsLoading(false);
      }
    }
  }, [location.state, id]);

  return (
    <div className="min-h-screen flex flex-col">
      <GoBack onClick={() => navigate(-1)} />
      <MainContent doc={doc} isLoading={isLoading} />
    </div>
  );
}

function MainContent({ doc, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoaderSpinner />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <FileText className="w-8 h-8 text-gray-400 mb-2" />
        <h3 className="text-lg font-semibold text-gray-800">
          Document not found
        </h3>
        <p className="text-gray-500">
          The document you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">{doc.title}</h1>
        <div
          className="innerDoc"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </div>
    </div>
  );
}
