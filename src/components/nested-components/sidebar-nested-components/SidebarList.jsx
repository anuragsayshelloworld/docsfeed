import { MoreVertical } from "lucide-react";
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { deleteDocument, fetchDocumentsByAuthor } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import ModeContext from "../../../context/ModeContext";
import SidebarListSkeleton from "../../UI/SkeletonForSidebarList";

function SidebarList({ expanded }) {
  const { setRender, render, setMode, setData, setTitle } =
    useContext(ModeContext);

  // Memoize auth to prevent unnecessary re-renders
  const auth = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("auth"));
    } catch {
      return null;
    }
  }, []);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Memoize sorted items to prevent unnecessary re-sorting
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const dateA = a.savedAt?.toDate
        ? a.savedAt.toDate()
        : new Date(a.savedAt);
      const dateB = b.savedAt?.toDate
        ? b.savedAt.toDate()
        : new Date(b.savedAt);
      return dateB - dateA;
    });
  }, [items]);

  const fetchDocuments = useCallback(async () => {
    if (!auth?.username) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchDocumentsByAuthor(auth.username);
      setItems(response);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [auth?.username]);

  useEffect(() => {
    fetchDocuments();
    if (render) {
      setRender(false);
    }
  }, [fetchDocuments, render, setRender]);

  // Optimize click outside handler
  const handleClickOutside = useCallback((event) => {
    const isDropdownClick = event.target.closest(".dropdown-container");
    const isConfirmDialog = event.target.closest(".confirm-dialog");

    if (!isDropdownClick && !isConfirmDialog) {
      setActiveDropdown(null);
      setShowDeleteConfirm(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleDropdownToggle = useCallback((e, docId) => {
    e.stopPropagation();
    setActiveDropdown((current) => (current === docId ? null : docId));
  }, []);

  const handleEdit = useCallback(
    (e, doc) => {
      e.stopPropagation();
      setActiveDropdown(null);
      setMode("edit");
      setTitle(doc.title);
      setData(doc.html);
      navigate(`/editor/edit`, { state: doc.id });
    },
    [setMode, setTitle, setData, navigate]
  );

  const handleShare = useCallback((e, doc) => {
    e.stopPropagation();
    setActiveDropdown(null);
    console.log("Share document:", doc);
  }, []);

  const handleDeleteClick = useCallback((e, doc) => {
    e.stopPropagation();
    setActiveDropdown(null);
    setShowDeleteConfirm(doc.id);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (e, doc) => {
      e.stopPropagation();

      if (isDeleting) return; // Prevent double clicks

      try {
        setIsDeleting(true);
        setShowDeleteConfirm(null);

        await deleteDocument(doc.id);

        // Optimistically update the UI instead of re-fetching
        setItems((currentItems) =>
          currentItems.filter((item) => item.id !== doc.id)
        );
      } catch (error) {
        console.error("Error deleting document:", error);
        // Optionally show error message to user
        // You could add a toast notification here
      } finally {
        setIsDeleting(false);
      }
    },
    [isDeleting]
  );

  const handleDeleteCancel = useCallback((e) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  }, []);

  const handleDocumentClick = useCallback(
    (doc) => {
      navigate(`/viewer/${doc.id}`, { state: doc });
    },
    [navigate]
  );

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
        {sortedItems.map((doc) => (
          <SidebarListItem
            key={doc.id}
            doc={doc}
            activeDropdown={activeDropdown}
            showDeleteConfirm={showDeleteConfirm}
            isDeleting={isDeleting}
            onDocumentClick={handleDocumentClick}
            onDropdownToggle={handleDropdownToggle}
            onEdit={handleEdit}
            onShare={handleShare}
            onDeleteClick={handleDeleteClick}
            onDeleteConfirm={handleDeleteConfirm}
            onDeleteCancel={handleDeleteCancel}
          />
        ))}
      </div>
    </div>
  );
}

// Separate component for each list item to prevent unnecessary re-renders
const SidebarListItem = React.memo(
  ({
    doc,
    activeDropdown,
    showDeleteConfirm,
    isDeleting,
    onDocumentClick,
    onDropdownToggle,
    onEdit,
    onShare,
    onDeleteClick,
    onDeleteConfirm,
    onDeleteCancel,
  }) => {
    const handleClick = useCallback(() => {
      onDocumentClick(doc);
    }, [doc, onDocumentClick]);

    const handleDropdownToggle = useCallback(
      (e) => {
        onDropdownToggle(e, doc.id);
      },
      [doc.id, onDropdownToggle]
    );

    const handleEdit = useCallback(
      (e) => {
        onEdit(e, doc);
      },
      [doc, onEdit]
    );

    const handleShare = useCallback(
      (e) => {
        onShare(e, doc);
      },
      [doc, onShare]
    );

    const handleDeleteClick = useCallback(
      (e) => {
        onDeleteClick(e, doc);
      },
      [doc, onDeleteClick]
    );

    const handleDeleteConfirm = useCallback(
      (e) => {
        onDeleteConfirm(e, doc);
      },
      [doc, onDeleteConfirm]
    );

    return (
      <div
        onClick={handleClick}
        className="group flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer text-sm text-gray-800 relative"
      >
        <span className="truncate flex-1">{doc.title}</span>

        <div className="relative dropdown-container">
          <MoreVertical
            className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-gray-700"
            onClick={handleDropdownToggle}
          />

          {activeDropdown === doc.id && (
            <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
              <button
                onClick={handleEdit}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleShare}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Share
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
              >
                Delete
              </button>
            </div>
          )}

          {showDeleteConfirm === doc.id && (
            <div className="absolute -right-2 top-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[240px] confirm-dialog">
              <p className="text-sm text-gray-800 mb-3">
                Are you sure you want to delete this document?
              </p>
              <p className="text-xs text-gray-500 mb-4 font-medium">
                "{doc.title}"
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onDeleteCancel}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

SidebarListItem.displayName = "SidebarListItem";

export default React.memo(SidebarList);
