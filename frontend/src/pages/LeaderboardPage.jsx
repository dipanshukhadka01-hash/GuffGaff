import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../services/api.js';
import { LeaderboardCard } from '../components/LeaderboardCard.jsx';

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState({
    mostHelpful: [],
    funniest: [],
    mostActive: [],
  });

  useEffect(() => {
    const load = async () => {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-guff-dusk">Payback Points Hall of Fame</h1>
        <p className="text-sm text-slate-500">
          Celebrate the helpers, the jokesters, and the everyday legends keeping GuffGaff bright.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <LeaderboardCard title="Most Helpful" entries={leaderboard.mostHelpful} />
        <LeaderboardCard title="Most Active" entries={leaderboard.mostActive} />
        <LeaderboardCard title="Funniest" entries={leaderboard.funniest} />
      </div>
    </div>
  );
};
