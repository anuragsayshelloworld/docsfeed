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
    <div className="flex-1 flex justify-center p-4 bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-200 p-8 my-4">
        {/* Document Title */}
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {doc.title}
          </h1>
        </div>

        {/* Document Content with Prose Styling */}
        <div
          className="
            prose prose-lg max-w-none
            prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-2
            prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
            prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-em:text-gray-600 prose-em:italic
            prose-code:bg-gray-100 prose-code:text-red-600 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-mono
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-4 prose-blockquote:pr-4 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:rounded-r-md
            prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-ol:mb-4
            prose-li:text-gray-700 prose-li:leading-relaxed
            prose-a:text-blue-600 prose-a:underline prose-a:decoration-blue-300 prose-a:underline-offset-2 hover:prose-a:text-blue-800 hover:prose-a:decoration-blue-500
            prose-hr:border-gray-300 prose-hr:my-8
            prose-table:border-collapse prose-table:border prose-table:border-gray-300 prose-table:rounded-lg prose-table:overflow-hidden
            prose-th:bg-gray-100 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900
            prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 prose-td:text-gray-700
          "
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </div>
    </div>
  );
}
