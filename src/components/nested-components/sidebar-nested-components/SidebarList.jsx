import { MoreVertical } from "lucide-react";
import React, { useContext, useEffect, useState, useRef } from "react";
import { fetchDocumentsByAuthor } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import ModeContext from "../../../context/ModeContext";
import SidebarListSkeleton from "../../UI/SkeletonForSidebarList";

function SidebarList({ expanded }) {
  const { setRender, render } = useContext(ModeContext);
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const getDocsByAuthor = async () => {
      setLoading(true);
      if (!auth?.username) {
        setLoading(false);
        return;
      }
      const response = await fetchDocumentsByAuthor(auth.username);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (e, docId) => {
    e.stopPropagation(); // Prevent navigation when clicking the dots
    setActiveDropdown(activeDropdown === docId ? null : docId);
  };

  const handleEdit = (e, doc) => {
    e.stopPropagation();
    setActiveDropdown(null);
    // Add your edit logic here
    console.log("Edit document:", doc);
    // Example: navigate to edit page
    // navigate(`/edit/${doc.id}`, { state: doc });
  };

  const handleDelete = (e, doc) => {
    e.stopPropagation();
    setActiveDropdown(null);
    // Add your delete logic here
    console.log("Delete document:", doc);
    // Example: show confirmation modal or delete directly
    // if (window.confirm("Are you sure you want to delete this document?")) {
    //   deleteDocument(doc.id);
    // }
  };

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
            className="group flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer text-sm text-gray-800 relative"
          >
            <span className="truncate flex-1">{doc.title}</span>

            {/* Three dots menu */}
            <div className="relative" ref={dropdownRef}>
              <MoreVertical
                className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-gray-700"
                onClick={(e) => handleDropdownToggle(e, doc.id)}
              />

              {/* Dropdown menu */}
              {activeDropdown === doc.id && (
                <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
                  <button
                    onClick={(e) => handleEdit(e, doc)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleEdit(e, doc)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Share
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, doc)}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(SidebarList);
