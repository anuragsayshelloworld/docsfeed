export default function SidebarUser({ expanded, name, email, avatarUrl }) {
  return (
    <div
      className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition
      ${expanded ? "justify-start" : "justify-center"}`}
      title={!expanded ? name : undefined}
      aria-label="User profile"
    >
      <img src={avatarUrl} alt={name} className="rounded-full w-10 h-10" />

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden
        ${expanded ? "w-[140px] opacity-100 ml-3" : "w-0 opacity-0 ml-0"}`}
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold truncate text-gray-800">
            {name}
          </span>
          <span className="text-xs text-gray-500 truncate">{email}</span>
        </div>
      </div>
    </div>
  );
}
