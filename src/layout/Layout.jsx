import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";

export default function Layout() {
  return (
    <div className="h-screen w-screen flex bg-white text-gray-800 overflow-hidden">
      <Sidebar />
      <MainContent />
    </div>
  );
}
