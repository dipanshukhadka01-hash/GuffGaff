import { useEffect, useState } from 'react';
import { fetchAdminOverview, fetchAdminUsers, updateUserBan } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [overview, list] = await Promise.all([
          fetchAdminOverview(token),
          fetchAdminUsers(token)
        ]);
        setStats(overview);
        setUsers(list);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [token]);

  const handleBan = async (id) => {
    const duration = prompt('Ban until (YYYY-MM-DD) or leave empty to unban:');
    const updated = await updateUserBan(token, id, duration || null);
    setUsers((prev) => prev.map((user) => (user._id === id ? updated : user)));
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage the tone of GuffGaff. Keep the town square supportive, constructive, and joyful.
        </p>
        {stats && (
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary/10 p-4 text-primary">
              <dt className="text-sm uppercase">Members</dt>
              <dd className="text-3xl font-bold">{stats.userCount}</dd>
            </div>
            <div className="rounded-2xl bg-secondary/10 p-4 text-secondary">
              <dt className="text-sm uppercase">Posts</dt>
              <dd className="text-3xl font-bold">{stats.postCount}</dd>
            </div>
            <div className="rounded-2xl bg-emerald-100/80 p-4 text-emerald-700">
              <dt className="text-sm uppercase">Comments</dt>
              <dd className="text-3xl font-bold">{stats.commentCount}</dd>
            </div>
          </dl>
        )}
      </header>

      <section className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-slate-700">Members</h2>
        <table className="mt-4 w-full overflow-hidden rounded-2xl text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">Banned until</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-700">{user.username}</p>
                </td>
                <td className="px-4 py-3 text-slate-500">{user.email}</td>
                <td className="px-4 py-3 text-slate-500">{user.paybackPoints}</td>
                <td className="px-4 py-3 text-slate-500">{user.roles?.join(', ')}</td>
                <td className="px-4 py-3 text-slate-500">{user.bannedUntil || 'Active'}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleBan(user._id)}
                    className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
                  >
                    Update ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users.length && <p className="mt-4 text-sm text-slate-500">No members found.</p>}
      </section>
    </div>
  );
}
