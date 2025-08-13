import LoaderSpinner from "../../../../../LoaderSpinner";
import DocumentItem from "./DocumentItem";
export default function DocumentsList({ documents, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoaderSpinner />
      </div>
    );
  }
  if (documents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>No Documents</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
      <div className="space-y-4">
        {documents.map((doc) => (
          <DocumentItem key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}
