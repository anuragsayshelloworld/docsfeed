import { ArrowLeft } from "lucide-react";
export default function GoBack({ onClick }) {
  return (
    <div className="sticky top-0 p-4 border-b bg-white shadow-sm z-50">
      <button
        onClick={onClick}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 p-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Go back
      </button>
    </div>
  );
}
