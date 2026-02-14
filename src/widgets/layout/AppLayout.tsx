import { Outlet } from 'react-router-dom';
import { Sidebar } from '../sidebar/Sidebar';

export function AppLayout(): JSX.Element {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950/60 text-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
