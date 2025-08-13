import { FileText } from "lucide-react";
import LoaderSpinner from "../../../../../LoaderSpinner";
export default function MainContent({ doc, isLoading }) {
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
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </div>
    </div>
  );
}
