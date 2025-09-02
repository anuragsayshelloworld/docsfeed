import { MoreVertical } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { fetchDocumentsByAuthor } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import ModeContext from "../../../context/ModeContext";

function SidebarListSkeleton({ expanded, itemCount = 5 }) {
  return (
    <div
      className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 
      ${expanded ? "opacity-100" : "opacity-0 max-h-0"}`}
    >
      {/* Header skeleton */}
      <div className="px-6 pt-4 pb-2">
        <div className="h-3 bg-gray-300 rounded animate-pulse w-24"></div>
      </div>

      {/* Document list skeleton */}
      <div className="space-y-1 px-2 pb-2 pr-1 overflow-y-auto flex-1">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-3 py-2 rounded-md"
          >
            {/* Document title skeleton */}
            <div
              className="h-4 bg-gray-300 rounded animate-pulse flex-1"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            ></div>

            {/* More button skeleton */}
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse ml-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarList({ expanded }) {
  const { setRender, render } = useContext(ModeContext);
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getDocsByAuthor = async () => {
      setLoading(true);
      if (!auth?.username) {
        setLoading(false);
        return;
      }
      const response = await fetchDocumentsByAuthor(auth.username);

      // Sort by savedAt date (newest first)
      const sortedItems = response.sort((a, b) => {
        const dateA = a.savedAt?.toDate
          ? a.savedAt.toDate()
          : new Date(a.savedAt);
        const dateB = b.savedAt?.toDate
          ? b.savedAt.toDate()
          : new Date(b.savedAt);
        return dateB - dateA;
      });

      setItems(sortedItems);
      setLoading(false);
      if (render) {
        setRender(false);
      }
    };
    getDocsByAuthor();
  }, [auth?.username, render, setRender]);

  if (loading) {
    return <SidebarListSkeleton expanded={expanded} itemCount={6} />;
  }

  return (
    <div
      className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 
      ${expanded ? "opacity-100" : "opacity-0 max-h-0"}`}
    >
      <div className="px-6 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">
        My Documents
      </div>

      <div className="space-y-1 px-2 pb-2 pr-1 overflow-y-auto flex-1 scrollbar-hide">
        {items.map((doc) => (
          <div
            onClick={() => navigate(`/viewer/${doc.id}`, { state: doc })}
            key={doc.id}
            className="group flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer text-sm text-gray-800"
          >
            <span className="truncate flex-1">{doc.title}</span>
            <MoreVertical className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(SidebarList);
