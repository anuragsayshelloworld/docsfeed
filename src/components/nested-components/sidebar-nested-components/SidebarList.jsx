import { MoreVertical } from "lucide-react";
import React, { useEffect, useState } from "react";
import { fetchDocumentsByAuthor } from "../../../firebase";
import { useNavigate } from "react-router-dom";

function SidebarList({ expanded }) {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getDocsByAuthor = async () => {
      if (!auth?.username) return;
      const response = await fetchDocumentsByAuthor(auth.username);
      setItems(response);
    };
    getDocsByAuthor();
  }, [auth?.username]);

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
