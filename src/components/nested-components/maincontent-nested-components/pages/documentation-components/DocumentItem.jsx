import { ArrowRight, FileText, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useCallback } from "react";

const DocumentItem = React.memo(function DocumentItem({ doc }) {
  const date = doc.savedAt?.toDate
    ? doc.savedAt.toDate().toLocaleString()
    : "N/A";

  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(`/viewer/${doc.id}`, { state: doc });
  }, [navigate, doc]);

  return (
    <div
      onClick={handleClick}
      className="group flex items-center justify-between border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 bg-white cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {doc.title}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{doc.author}</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </div>
      <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-200">
        <span>View</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
});

export default DocumentItem;
