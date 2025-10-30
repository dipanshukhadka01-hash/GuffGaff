const badgePalette = {
  Helper: 'bg-emerald-100 text-emerald-700',
  'Witty Mind': 'bg-amber-100 text-amber-700',
  Expert: 'bg-sky-100 text-sky-700',
  'Community Leader': 'bg-purple-100 text-purple-700',
};

export const BadgeGrid = ({ badges = [] }) => {
  if (!badges.length) {
    return <p className="text-sm text-slate-500">No badges yet — keep spreading good vibes!</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((badge) => (
        <span
          key={`${badge.type}-${badge.awardedAt}`}
          className={`rounded-full px-4 py-2 text-xs font-semibold ${badgePalette[badge.type] || 'bg-guff-sand text-guff-dusk'}`}
        >
          {badge.type}
        </span>
      ))}
    </div>
  );
};
