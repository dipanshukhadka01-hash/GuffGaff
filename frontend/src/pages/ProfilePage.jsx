import { BadgeGrid } from '../components/BadgeGrid.jsx';
import { StatsSummary } from '../components/StatsSummary.jsx';
import { useAuth } from '../hooks/useAuth.js';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={user?.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`}
          alt="avatar"
          className="h-20 w-20 rounded-full border-4 border-guff-sand"
        />
        <div>
          <h1 className="text-2xl font-semibold text-guff-dusk">{user?.username}</h1>
          <p className="text-sm text-slate-500">{user?.bio || 'No bio yet — let the community know who you are!'}</p>
          <p className="text-xs text-slate-400">{user?.location || 'Somewhere friendly on Earth'}</p>
        </div>
      </div>
      <StatsSummary
        stats={{
          paybackPoints: user?.paybackPoints,
          rank: user?.rank,
          posts: user?.stats?.posts,
          comments: user?.stats?.comments,
        }}
      />
      <section className="rounded-3xl border border-guff-sand bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-guff-dusk">Community Badges</h2>
        <p className="text-xs text-slate-500">Celebrate the ways you uplift others.</p>
        <div className="mt-4">
          <BadgeGrid badges={user?.badges} />
        </div>
      </section>
    </div>
  );
};
