import {
  PanelLeft,
  Plus,
  Search as SearchIcon,
  MoreVertical,
} from "lucide-react";

import { useState } from "react";

export default function Layout() {
  const [expandSidebar, setExpandSideBar] = useState(false);

  return (
    <div className="h-screen w-screen flex bg-white text-gray-800 overflow-hidden">
      <aside
        className={`flex flex-col border-r transition-[width] duration-300 ease-in-out shadow-sm bg-gray-50 
    ${expandSidebar ? "w-64" : "w-16"}`}
      >
        <div className="flex flex-col flex-grow">
          <SidebarToggle
            expanded={expandSidebar}
            onToggle={() => setExpandSideBar(!expandSidebar)}
          />
          <SidebarItem
            icon={Plus}
            label="⌘ + P"
            expanded={expandSidebar}
            tooltip="New Note"
          />
          <SidebarSearch expanded={expandSidebar} />
          <SidebarList expanded={expandSidebar} />
        </div>

        <SidebarUser
          expanded={expandSidebar}
          name="John Doe"
          email="john.doe@example.com"
          avatarUrl="https://i.pravatar.cc/40"
        />
      </aside>

      <main className="flex-1 p-4 overflow-y-auto">Main Content</main>
    </div>
  );
}

function SidebarToggle({ expanded, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center p-3 m-2 h-10 hover:bg-gray-100 transition rounded-lg group"
      title="Toggle sidebar"
      aria-label="Toggle sidebar"
    >
      <PanelLeft className="text-gray-500 group-hover:text-black" size={20} />
      <span
        className={`ml-2 text-sm font-medium text-gray-600 transition-all duration-200 whitespace-nowrap
          ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
      >
        ⌘ + Q
      </span>
    </button>
  );
}

function SidebarItem({ icon: Icon, label, expanded, tooltip }) {
  return (
    <div
      className={`flex items-center p-3 m-2 h-10 hover:bg-gray-100 transition rounded-lg group cursor-pointer 
      ${expanded ? "justify-start" : "justify-center"}`}
      title={!expanded ? tooltip : undefined}
      aria-label={tooltip}
    >
      <Icon className="text-gray-500 group-hover:text-black" size={20} />
      <span
        className={`ml-2 text-sm font-medium text-gray-600 transition-all duration-200 whitespace-nowrap 
        ${expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
      >
        {label}
      </span>
    </div>
  );
}

function SidebarSearch({ expanded }) {
  return (
    <div
      className={`flex items-center p-3 m-2 h-10 rounded-lg group hover:bg-gray-100 transition 
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

function SidebarList({ expanded }) {
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
  ];

  return (
    <div
      className={`flex flex-col flex-1 transition-all duration-300 
      ${expanded ? "opacity-100" : "opacity-0 max-h-0 overflow-hidden"}`}
    >
      <div className="px-6 pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase">
        Notes
      </div>

      <div className="space-y-1 px-2 pb-2 overflow-y-auto pr-1 max-h-[340px] scrollbar-hide">
        {items.map((text, index) => (
          <div
            key={index}
            className="group flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
          >
            <span className="truncate flex-1">{text}</span>
            <MoreVertical className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarUser({ expanded, name, email, avatarUrl }) {
  return (
    <div
      className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition 
      ${expanded ? "justify-start" : "justify-center"}`}
      title={!expanded ? name : undefined}
      aria-label="User profile"
    >
      <img src={avatarUrl} alt={name} className="rounded-full w-10 h-10" />
      <div
        className={`ml-3 flex flex-col overflow-hidden transition-all duration-200
        ${expanded ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"}`}
      >
        <span className="text-sm font-semibold truncate text-gray-800">
          {name}
        </span>
        <span className="text-xs text-gray-500 truncate">{email}</span>
      </div>
    </div>
  );
}
