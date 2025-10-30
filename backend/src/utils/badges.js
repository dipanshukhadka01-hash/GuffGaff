const badgeDefinitions = {
  helper: {
    slug: 'helper',
    label: 'Helper',
    description: 'Awarded for consistently answering questions and being supportive.'
  },
  witty: {
    slug: 'witty',
    label: 'Witty Mind',
    description: 'Given to community members who brighten up the banter feed.'
  },
  expert: {
    slug: 'expert',
    label: 'Expert',
    description: 'Recognises a deep knowledge sharer that others rely on.'
  },
  leader: {
    slug: 'leader',
    label: 'Community Leader',
    description: 'Honours members who guide conversations and keep things kind.'
  }
};

export const getAllBadges = () => Object.values(badgeDefinitions);

export const getBadge = (slug) => badgeDefinitions[slug];

export const evaluateBadges = ({ points = 0, solvedCount = 0, funCount = 0 }) => {
  const earned = [];
  if (points >= 200) earned.push(badgeDefinitions.helper.slug);
  if (points >= 800) earned.push(badgeDefinitions.expert.slug);
  if (solvedCount >= 10) earned.push(badgeDefinitions.leader.slug);
  if (funCount >= 15) earned.push(badgeDefinitions.witty.slug);
  return earned;
};
