import { Search as SearchIcon } from "lucide-react";
export default function SidebarSearch({ expanded }) {
  return (
    <div
      className={`flex items-center p-3 m-2 h-10 rounded-lg group hover:bg-gray-200 transition 
      ${expanded ? "justify-start" : "justify-center"}`}
      title={!expanded ? "Search" : undefined}
      aria-label="Search"
    >
      <SearchIcon
        className="text-gray-500 group-hover:text-black transition duration-300"
        size={20}
      />
      <div
        className={`overflow-hidden transition-all duration-300 ml-2 flex-1
        ${expanded ? "opacity-100" : "opacity-0 w-0"}`}
      >
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400"
        />
      </div>
    </div>
  );
}
