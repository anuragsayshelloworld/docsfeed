export default function SidebarListSkeleton({ expanded, itemCount = 5 }) {
  return (
    <div
      className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 
      ${expanded ? "opacity-100" : "opacity-0 max-h-0"}`}
    >
      {/* Header skeleton */}
      <div className="px-6 pt-4 pb-2">
        <div className="h-3 bg-gray-300 rounded animate-pulse w-24"></div>
      </div>

      {/* Document list skeleton */}
      <div className="space-y-1 px-2 pb-2 pr-1 overflow-y-auto flex-1">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-3 py-2 rounded-md"
          >
            {/* Document title skeleton */}
            <div
              className="h-4 bg-gray-300 rounded animate-pulse flex-1"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            ></div>

            {/* More button skeleton */}
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse ml-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
