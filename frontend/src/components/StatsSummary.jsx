export const StatsSummary = ({ stats }) => {
  return (
    <dl className="grid grid-cols-2 gap-4 text-sm">
      <div className="rounded-2xl bg-guff-sand/80 p-4">
        <dt className="text-xs uppercase tracking-wide text-slate-500">Payback Points</dt>
        <dd className="text-2xl font-bold text-guff-dusk">{stats?.paybackPoints ?? 0}</dd>
      </div>
      <div className="rounded-2xl bg-guff-sand/80 p-4">
        <dt className="text-xs uppercase tracking-wide text-slate-500">Rank</dt>
        <dd className="text-2xl font-bold text-guff-dusk">{stats?.rank ?? 'Newbie'}</dd>
      </div>
      <div className="rounded-2xl bg-guff-sand/80 p-4">
        <dt className="text-xs uppercase tracking-wide text-slate-500">Posts</dt>
        <dd className="text-2xl font-bold text-guff-dusk">{stats?.posts ?? 0}</dd>
      </div>
      <div className="rounded-2xl bg-guff-sand/80 p-4">
        <dt className="text-xs uppercase tracking-wide text-slate-500">Comments</dt>
        <dd className="text-2xl font-bold text-guff-dusk">{stats?.comments ?? 0}</dd>
      </div>
    </dl>
  );
};
