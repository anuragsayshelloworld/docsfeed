import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function SidebarLogo({ expanded }) {
  return (
    <div
      className="flex items-center px-5 py-4 transition-all duration-300"
      title="Home"
    >
      <Link
        to="/"
        className="flex items-center gap-2 text-gray-800 hover:text-gray-900 transition-colors duration-200"
      >
        <Home className="w-5 h-5" />
        <span
          className={`font-semibold text-lg overflow-hidden transition-all duration-300
            ${expanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}
        >
          DocFeed
        </span>
      </Link>
    </div>
  );
}
