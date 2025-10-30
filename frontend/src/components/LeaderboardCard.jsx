export default function LeaderboardCard({ title, users, metric }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      <ul className="mt-4 space-y-3">
        {users.map((user, index) => (
          <li key={user._id || user.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-primary">#{index + 1}</span>
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={user.profilePicture || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}`}
                alt={user.username}
              />
              <div>
                <p className="font-semibold text-slate-700">{user.username}</p>
                <p className="text-xs text-slate-500">{user.badges?.join(', ') || 'Fresh face'}</p>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {user[metric]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
