const rankThresholds = [
  { name: 'Newbie', min: 0 },
  { name: 'Helper', min: 200 },
  { name: 'Expert', min: 800 },
  { name: 'Legend', min: 1600 }
];

export const calculateRank = (points = 0) => {
  const sorted = [...rankThresholds].sort((a, b) => b.min - a.min);
  const rank = sorted.find((entry) => points >= entry.min);
  return rank ? rank.name : 'Newbie';
};

export const getRankProgress = (points = 0) => {
  const current = rankThresholds.reduce((acc, curr) => (points >= curr.min ? curr : acc));
  const next = rankThresholds.find((entry) => entry.min > (current?.min ?? 0));
  const progress = next
    ? Math.min(1, (points - current.min) / (next.min - current.min))
    : 1;
  return {
    current: current?.name ?? 'Newbie',
    next: next?.name ?? null,
    progress
  };
};
