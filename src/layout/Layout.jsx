import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="h-screen w-screen flex bg-white text-gray-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 overflow-y-auto">Main Content</main>
    </div>
  );
}
