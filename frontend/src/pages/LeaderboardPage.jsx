import { useEffect, useState } from 'react';
import LeaderboardCard from '../components/LeaderboardCard.jsx';
import { fetchLeaderboard } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LeaderboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState({ topHelpers: [], funniest: [], mostActive: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const leaderboard = await fetchLeaderboard(token);
        setData(leaderboard);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Community Recognition</h1>
        <p className="mt-2 text-sm text-slate-500">
          These legends keep the circle vibrant. Help out, share joy, and you might see your name here soon.
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-slate-500">Loading leaderboard...</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <LeaderboardCard title="Most Helpful" users={data.topHelpers} metric="paybackPoints" />
          <LeaderboardCard title="Wittiest Minds" users={data.funniest} metric="funCount" />
          <LeaderboardCard title="Most Active" users={data.mostActive} metric="solvedCount" />
        </div>
      )}
    </div>
  );
}
