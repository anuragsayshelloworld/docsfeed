import { Plus } from "lucide-react";
import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ModeContext from "../../../context/ModeContext";
export default function SidebarItem({ expanded }) {
  const navigate = useNavigate();
  const { setData, setMode } = useContext(ModeContext);
  const handleNavigate = useCallback(() => {
    setMode("");
    setData(null);
    navigate("/editor");
  }, [setMode, setData, navigate]);

  return (
    <div
      onClick={handleNavigate}
      className={`flex items-center p-3 m-2 h-10 hover:bg-gray-200 transition rounded-lg group cursor-pointer 
      ${expanded ? "justify-start" : "justify-center"}`}
      title="New Document"
      aria-label="New Document"
    >
      <Plus className="text-gray-500 group-hover:text-black" size={20} />
      <span
        className={`ml-2 text-sm font-medium text-gray-600 transition-all duration-300 whitespace-nowrap 
        ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
      >
        Create new
      </span>
    </div>
  );
}
