import { useRef } from "react";
import parse from "html-react-parser";
import { FileText } from "lucide-react";
import LoaderSpinner from "../../../../../LoaderSpinner";
import CodeBlock from "./CodeBlock";
import "../../../../../css/viewer.css";

export default function MainContent({ doc, isLoading }) {
  const containerRef = useRef();

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

  return (
    <div className="flex-1 flex justify-center p-4">
      <div className="w-full max-w-4xl" ref={containerRef}>
        <h1 className="text-2xl font-bold mb-4">{doc.title}</h1>
        <div className="innerDoc">
          {parse(doc.html, { replace: transform })}
        </div>
      </div>
    </div>
  );
}
