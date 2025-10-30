import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="flex-1 overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
