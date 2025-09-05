// SidebarSearch.jsx
import { Search as SearchIcon } from "lucide-react";

export default function SidebarSearch({
  expanded,
  expandWhenCollapsed,
  searchText,
  setSearchText,
}) {
  return (
    <div
      className={`cursor-pointer flex items-center p-3 m-2 h-10 rounded-lg group hover:bg-gray-200 transition 
      ${expanded ? "justify-start" : "justify-center"}`}
      title="Search"
      aria-label="Search"
      onClick={() => {
        if (!expanded) {
          expandWhenCollapsed();
        }
      }}
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
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400"
        />
      </div>
    </div>
  );
}
