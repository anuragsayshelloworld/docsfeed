import { useState } from "react";
import { LogOut, Settings, HelpCircle } from "lucide-react";

export default function SidebarUser({ expanded }) {
  const [logoutSlider, setLogoutSlider] = useState(false);
  const user = JSON.parse(localStorage.getItem("auth"));

  return (
    <div className="relative">
      {/* Main user div */}
      <div
        onClick={() => setLogoutSlider(() => !logoutSlider)}
        className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition
        ${expanded ? "justify-start" : "justify-center"}`}
        title={`${user.username}'s image`}
        aria-label={`${user.username}'s image`}
      >
        <img
          src={user.image ? user.image : "/avatar.png"}
          alt={`${user.username}'s image`}
          className="rounded-full w-10 h-10"
        />

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden
          ${expanded ? "w-[140px] opacity-100 ml-3" : "w-0 opacity-0 ml-0"}`}
        >
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate text-gray-800">
              {user.username}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {user.userId}
            </span>
          </div>
        </div>
      </div>

      {/* Logout slider panel - adjusts width based on expanded state */}
      <div
        className={`absolute bottom-full bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300 ease-in-out z-50
        ${expanded ? "left-0 right-0" : "left-0 w-40"}
        ${
          logoutSlider
            ? "transform translate-y-0 opacity-100 visible"
            : "transform translate-y-4 opacity-0 invisible"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            localStorage.removeItem("auth");
            window.location.href = "/";
            setLogoutSlider(false);
          }}
          className="w-full p-3 text-sm text-red-600 hover:bg-red-50 rounded-t-lg transition-colors flex items-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Settings clicked");
            setLogoutSlider(false);
          }}
          className="w-full p-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2 border-t border-gray-100"
        >
          <Settings size={16} />
          Settings
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Learn more clicked");
            setLogoutSlider(false);
          }}
          className="w-full p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-b-lg transition-colors flex items-center gap-2 border-t border-gray-100"
        >
          <HelpCircle size={16} />
          Learn more
        </button>
      </div>

      {/* Backdrop to close slider */}
      {logoutSlider && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setLogoutSlider(false)}
        />
      )}
    </div>
  );
}
