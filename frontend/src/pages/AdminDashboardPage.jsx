import { useEffect, useState } from 'react';
import {
  fetchAdminStats,
  fetchAdminUsers,
  toggleBanUser,
  awardBadge,
  adjustPoints,
} from '../services/api.js';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [badgeForm, setBadgeForm] = useState({ userId: '', badgeType: 'Helper', reason: '' });
  const [pointsForm, setPointsForm] = useState({ userId: '', delta: 50 });

  useEffect(() => {
    const load = async () => {
      const [statsData, usersData] = await Promise.all([fetchAdminStats(), fetchAdminUsers()]);
      setStats(statsData);
      setUsers(usersData);
    };
    load();
  }, []);

  const handleBanToggle = async (userId) => {
    const updated = await toggleBanUser(userId);
    setUsers((prev) => prev.map((user) => (user._id === updated._id ? updated : user)));
  };

  const handleBadge = async (event) => {
    event.preventDefault();
    await awardBadge(badgeForm.userId, {
      badgeType: badgeForm.badgeType,
      reason: badgeForm.reason,
    });
  };

  const handlePoints = async (event) => {
    event.preventDefault();
    await adjustPoints(pointsForm.userId, { delta: Number(pointsForm.delta) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-guff-dusk">Admin Dashboard</h1>
        <p className="text-sm text-slate-500">Guide the community, nurture the vibes.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Members</p>
          <p className="text-2xl font-semibold text-guff-dusk">{stats.users ?? 0}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Posts</p>
          <p className="text-2xl font-semibold text-guff-dusk">{stats.posts ?? 0}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Solved Threads</p>
          <p className="text-2xl font-semibold text-guff-dusk">{stats.solvedPosts ?? 0}</p>
        </div>
      </div>
      <section className="rounded-3xl border border-guff-sand bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-guff-dusk">Quick Actions</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <form onSubmit={handleBadge} className="space-y-3">
            <h3 className="text-sm font-semibold text-guff-dusk">Award Badge</h3>
            <select
              value={badgeForm.userId}
              onChange={(event) => setBadgeForm((prev) => ({ ...prev, userId: event.target.value }))}
              className="w-full rounded-full border border-guff-sand px-4 py-2 text-sm"
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
            <select
              value={badgeForm.badgeType}
              onChange={(event) => setBadgeForm((prev) => ({ ...prev, badgeType: event.target.value }))}
              className="w-full rounded-full border border-guff-sand px-4 py-2 text-sm"
            >
              <option value="Helper">Helper</option>
              <option value="Witty Mind">Witty Mind</option>
              <option value="Expert">Expert</option>
              <option value="Community Leader">Community Leader</option>
            </select>
            <textarea
              value={badgeForm.reason}
              onChange={(event) => setBadgeForm((prev) => ({ ...prev, reason: event.target.value }))}
              placeholder="Reason"
              className="h-20 w-full rounded-2xl border border-guff-sand px-4 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-full bg-guff-sky px-4 py-2 text-sm font-semibold text-white hover:bg-guff-dusk"
            >
              Award
            </button>
          </form>
          <form onSubmit={handlePoints} className="space-y-3">
            <h3 className="text-sm font-semibold text-guff-dusk">Adjust Payback Points</h3>
            <select
              value={pointsForm.userId}
              onChange={(event) => setPointsForm((prev) => ({ ...prev, userId: event.target.value }))}
              className="w-full rounded-full border border-guff-sand px-4 py-2 text-sm"
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={pointsForm.delta}
              onChange={(event) => setPointsForm((prev) => ({ ...prev, delta: event.target.value }))}
              className="w-full rounded-full border border-guff-sand px-4 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-full bg-guff-sky px-4 py-2 text-sm font-semibold text-white hover:bg-guff-dusk"
            >
              Update Points
            </button>
          </form>
        </div>
      </section>
      <section className="rounded-3xl border border-guff-sand bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-guff-dusk">Community Members</h2>
        <div className="mt-4 space-y-3 text-sm">
          {users.map((user) => (
            <div key={user._id} className="flex items-center justify-between rounded-2xl bg-guff-sand/60 px-4 py-3">
              <div>
                <p className="font-semibold text-guff-dusk">{user.username}</p>
                <p className="text-xs text-slate-500">{user.paybackPoints} points · {user.rank}</p>
              </div>
              <button
                type="button"
                onClick={() => handleBanToggle(user._id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  user.roles.includes('banned')
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                {user.roles.includes('banned') ? 'Unban' : 'Ban'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
