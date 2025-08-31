import { MoreVertical } from "lucide-react";
export default function SidebarList({ expanded }) {
  const items = [
    "Frontend Interview Prep",
    "Claude vs GPT",
    "Next.js Routing",
    "TypeScript Deep Dive",
    "UI Design Tips",
    "React Performance Tricks",
    "Debugging Techniques",
    "Chatbot UX Ideas",
    "State Management Patterns",
    "Microservices Basics",
    "Git Best Practices",
    "JavaScript Oddities",
    "CSS Grid vs Flexbox",
    "System Design Notes",
    "Web Accessibility Tips",
    "Next Auth Strategies",
    "Refactoring Guide",
    "Building Design Systems",
    "Web Accessibility Tips",
    "Next Auth Strategies",
    "Refactoring Guide",
    "Building Design Systems",
  ];

  return (
    <div
      className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 
      ${expanded ? "opacity-100" : "opacity-0 max-h-0"}`}
    >
      <div className="px-6 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">
        My Documents
      </div>

      <div className="space-y-1 px-2 pb-2 pr-1 overflow-y-auto flex-1 scrollbar-hide">
        {items.map((text, index) => (
          <div
            key={index}
            className="group flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer text-sm text-gray-800"
          >
            <span className="truncate flex-1">{text}</span>
            <MoreVertical className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
