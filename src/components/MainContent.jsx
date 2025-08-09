import { Outlet } from "react-router-dom";
export default function MainContent() {
  return (
    <main className="flex-1 p-4 overflow-y-auto">
      <Outlet />
    </main>
  );
}
