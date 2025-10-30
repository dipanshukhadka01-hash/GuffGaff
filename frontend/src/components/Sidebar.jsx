import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const badges = {
  helper: { label: 'Helper', color: 'bg-blue-100 text-blue-700' },
  witty: { label: 'Witty Mind', color: 'bg-orange-100 text-orange-700' },
  expert: { label: 'Expert', color: 'bg-purple-100 text-purple-700' },
  leader: { label: 'Community Leader', color: 'bg-emerald-100 text-emerald-700' }
};

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <aside className="hidden w-72 flex-shrink-0 flex-col gap-4 md:flex">
      <section className="rounded-3xl bg-gradient-to-br from-primary/10 via-white to-secondary/20 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <img
            className="h-16 w-16 rounded-full border-4 border-white object-cover"
            src={user.profilePicture || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}`}
            alt={user.username}
          />
          <div>
            <p className="text-lg font-semibold text-slate-800">{user.username}</p>
            <p className="text-sm text-slate-500">{user.location || 'Somewhere cozy'}</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-white/60 p-4 text-sm">
          <p className="font-semibold text-primary">Payback Points</p>
          <p className="mt-1 text-3xl font-black text-slate-800">{user.paybackPoints}</p>
          <p className="mt-2 text-xs uppercase tracking-widest text-slate-500">{user.rank}</p>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl bg-white p-5 shadow">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Badges</h3>
        <div className="flex flex-wrap gap-2">
          {user.badges?.length ? (
            user.badges.map((badge) => (
              <span
                key={badge}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  badges[badge]?.color || 'bg-slate-100 text-slate-600'
                }`}
              >
                {badges[badge]?.label || badge}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">Earn badges by helping the community.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick Links</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link
              to="/forums"
              className={`block rounded-xl px-3 py-2 font-medium transition ${
                location.pathname.startsWith('/forums')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Need a hand?
            </Link>
          </li>
          <li>
            <Link
              to="/leaderboard"
              className={`block rounded-xl px-3 py-2 font-medium transition ${
                location.pathname.startsWith('/leaderboard')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Meet the legends
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`block rounded-xl px-3 py-2 font-medium transition ${
                location.pathname.startsWith('/profile')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Update profile
            </Link>
          </li>
        </ul>
      </section>
    </aside>
  );
}
