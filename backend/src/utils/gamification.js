export const RANKS = [
  { name: 'Newbie', minPoints: 0 },
  { name: 'Helper', minPoints: 100 },
  { name: 'Expert', minPoints: 500 },
  { name: 'Legend', minPoints: 1500 },
];

export const BADGE_TYPES = {
  HELPER: 'Helper',
  WITTY_MIND: 'Witty Mind',
  EXPERT: 'Expert',
  COMMUNITY_LEADER: 'Community Leader',
};

export const getRankForPoints = (points) => {
  const sorted = [...RANKS].sort((a, b) => b.minPoints - a.minPoints);
  const current = sorted.find((rank) => points >= rank.minPoints);
  return current ? current.name : RANKS[0].name;
};

export const buildLeaderboard = (users) => {
  const mostHelpful = [...users]
    .sort((a, b) => b.paybackPoints - a.paybackPoints)
    .slice(0, 10)
    .map((user) => ({
      userId: user._id,
      username: user.username,
      score: user.paybackPoints,
      rank: getRankForPoints(user.paybackPoints),
      badges: user.badges,
    }));

  const mostActive = [...users]
    .sort((a, b) => b.stats.posts - a.stats.posts)
    .slice(0, 10)
    .map((user) => ({
      userId: user._id,
      username: user.username,
      score: user.stats.posts + user.stats.comments,
      rank: getRankForPoints(user.paybackPoints),
    }));

  const funniest = [...users]
    .sort((a, b) => b.stats.reactions.fun - a.stats.reactions.fun)
    .slice(0, 10)
    .map((user) => ({
      userId: user._id,
      username: user.username,
      score: user.stats.reactions.fun,
      rank: getRankForPoints(user.paybackPoints),
    }));

  return { mostHelpful, mostActive, funniest };
};

export const PAYBACK_ACTIONS = {
  VERIFIED_SOLUTION: 50,
  HELPFUL_COMMENT: 25,
  FUN_POST: 10,
  DAILY_LOGIN: 5,
};
