import { PanelLeft } from "lucide-react";
export default function SidebarToggle({ expanded, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center p-3 m-2 h-10 hover:bg-gray-200 transition rounded-lg group"
      title={expanded ? "Collapse" : "Expand"}
      aria-label="Toggle sidebar"
    >
      <PanelLeft className="text-gray-500 group-hover:text-black" size={20} />
      <span
        className={`ml-2 text-sm font-medium text-gray-600 transition-all duration-300 whitespace-nowrap
          ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
      >
        Collapse
      </span>
    </button>
  );
}
