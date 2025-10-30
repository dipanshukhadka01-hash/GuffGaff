export const LeaderboardCard = ({ title, entries = [] }) => {
  return (
    <section className="flex-1 rounded-3xl border border-guff-sand bg-white/90 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-guff-dusk">{title}</h3>
      <ol className="mt-4 space-y-3">
        {entries.map((entry, index) => (
          <li
            key={entry.userId}
            className="flex items-center justify-between rounded-2xl bg-guff-sand/60 px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-guff-dusk">
                {index + 1}. {entry.username}
              </p>
              <p className="text-xs text-slate-500">{entry.rank}</p>
            </div>
            <span className="text-sm font-bold text-guff-dusk">{entry.score}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};
