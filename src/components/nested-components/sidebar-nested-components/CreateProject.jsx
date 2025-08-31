import { FolderPlus } from "lucide-react";

export default function CreateProject({ expanded }) {
  return (
    <div
      className={`flex items-center p-3 m-2 h-10 hover:bg-gray-200 transition rounded-lg group cursor-pointer 
      ${expanded ? "justify-start" : "justify-center"}`}
      title="Create Project"
      aria-label="Create Project"
    >
      <FolderPlus className="text-gray-500 group-hover:text-black" size={20} />
      <span
        className={`ml-2 text-sm font-medium text-gray-600 transition-all duration-300 whitespace-nowrap 
        ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
      >
        Create Project
      </span>
    </div>
  );
}
