import { useState, lazy, useEffect } from "react";
import SidebarUser from "./nested-components/sidebar-nested-components/SidebarUser";
import SidebarToggle from "./nested-components/sidebar-nested-components/SidebarToggle";
import SidebarItem from "./nested-components/sidebar-nested-components/SidebarItem";
import SidebarSearch from "./nested-components/sidebar-nested-components/SidebarSearch";
import useMobile from "../hooks/useMobile";

const SidebarList = lazy(() =>
  import("./nested-components/sidebar-nested-components/SidebarList")
);

export default function Sidebar() {
  const isMobile = useMobile(756);
  const [expandSidebar, setExpandSideBar] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setExpandSideBar(false);
    }
  }, [isMobile]);

  return (
    <aside
      className={`flex flex-col h-full border-r shadow-sm bg-gray-100 transition-[width] duration-300 ease-in-out
        ${expandSidebar ? "w-64" : "w-16"}`}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <SidebarToggle
          expanded={expandSidebar}
          onToggle={() => setExpandSideBar(!expandSidebar)}
        />
        <SidebarItem
          label="Create New"
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
  );
}
