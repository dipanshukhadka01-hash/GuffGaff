import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-guff-sand bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-semibold text-guff-dusk">
          GuffGaff
        </Link>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="hidden sm:block">
            {user?.username ? `Hi, ${user.username}!` : 'Welcome to GuffGaff'}
          </span>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-guff-sky px-4 py-2 font-medium text-white shadow hover:bg-guff-dusk"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};
