import { useContext, useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import { FileText, Edit, Trash2 } from "lucide-react";
import LoaderSpinner from "../../../../../LoaderSpinner";
import CodeBlock from "./CodeBlock";
import "../../../../../css/viewer.css";
import { useNavigate } from "react-router-dom";
import ModeContext from "../../../../../context/ModeContext";
import { deleteDocument } from "../../../../../firebase";
import useLocalstorage from "../../../../../hooks/useLocalStorage";

export default function MainContent({ doc, isLoading }) {
  const containerRef = useRef();
  const navigate = useNavigate();
  const { value: user } = useLocalstorage("auth");
  const role = user.role;
  const { setData, setTitle, setMode, setRender, render } =
    useContext(ModeContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (render) {
      navigate("/");
      setRender(false);
    }
  }, [render, navigate, setRender]);

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
    setMode("edit");
    setTitle(doc.title);
    setData(doc.html);
    navigate(`/editor/edit`, { state: doc.id });
  }
  async function handleDelete() {
    setShowDeleteConfirm(true);
  }

  async function confirmDelete() {
    setIsDeleting(true);
    await deleteDocument(doc.id);
    navigate("/");
    setRender(true);
  }

  return (
    <div className="flex-1 flex justify-center p-4">
      <div className="w-full max-w-4xl" ref={containerRef}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{doc.title}</h1>
          <div className="flex gap-2">
            {role === 1 && (
              <>
                <button
                  onClick={handleNavigate}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        <div className="innerDoc z-10">
          {parse(doc.html, { replace: transform })}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Document</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this document? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
