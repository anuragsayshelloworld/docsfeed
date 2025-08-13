import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function SidebarItem({ label, expanded, tooltip }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/editor")}
      className={`flex items-center p-3 m-2 h-10 hover:bg-gray-200 transition rounded-lg group cursor-pointer 
      ${expanded ? "justify-start" : "justify-center"}`}
      title={!expanded ? tooltip : undefined}
      aria-label={tooltip}
    >
      <Plus className="text-gray-500 group-hover:text-black" size={20} />
      <span
        className={`ml-2 text-sm font-medium text-gray-600 transition-all duration-300 whitespace-nowrap 
        ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
      >
        {label}
      </span>
    </div>
  );
}
