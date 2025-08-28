import { useContext, useRef } from "react";
import parse from "html-react-parser";
import { FileText, Edit } from "lucide-react";
import LoaderSpinner from "../../../../../LoaderSpinner";
import CodeBlock from "./CodeBlock";
import "../../../../../css/viewer.css";
import { useNavigate } from "react-router-dom";
import ModeContext from "../../../../../context/ModeContext";

export default function MainContent({ doc, isLoading }) {
  const containerRef = useRef();
  const navigate = useNavigate();
  const { setData, setTitle, setMode } = useContext(ModeContext);

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

  const transform = (node) => {
    if (node.name === "pre" && node.children?.length) {
      const codeNode = node.children.find((child) => child.name === "code");
      const codeText = codeNode?.children?.[0]?.data || "";
      return <CodeBlock code={codeText} key={Math.random()} />;
    }
  };

  function handleNavigate() {
    //setMode("edit");
    // use set mode for the publish or update
    //setTitle also require to do titile
    setMode("edit");
    setTitle(doc.title);
    setData(doc.html);
    navigate("/editor");
  }

  return (
    <div className="flex-1 flex justify-center p-4">
      <div className="w-full max-w-4xl" ref={containerRef}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{doc.title}</h1>
          <button
            onClick={handleNavigate}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
        <div className="innerDoc z-10">
          {parse(doc.html, { replace: transform })}
        </div>
      </div>
    </div>
  );
}
