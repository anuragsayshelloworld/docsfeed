import { Search } from "lucide-react";

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="p-4 bg-white shadow-sm">
      <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 w-full max-w-md mx-auto shadow-sm bg-white focus-within:ring-2 focus-within:ring-gray-800 focus-within:border-blue-300 transition-all duration-200">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>
  );
}
