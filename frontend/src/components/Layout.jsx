import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.jsx';
import { SideMenu } from './SideMenu.jsx';

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-guff-sand">
      <NavBar />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-6">
        <SideMenu />
        <main className="flex-1 rounded-3xl bg-white p-6 shadow-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
