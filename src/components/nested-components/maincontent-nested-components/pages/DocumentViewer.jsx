import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchDocumentById } from "../../../../firebase";
import GoBack from "./documentviewer-components/GoBack";
import MainContent from "./documentviewer-components/MainContent";
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
    <div className="min-h-screen flex flex-col scrollbar-hide">
      <GoBack onClick={() => navigate(-1)} />
      <MainContent doc={doc} isLoading={isLoading} />
    </div>
  );
}
