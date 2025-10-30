import { User } from '../models/User.js';
import { buildLeaderboard } from '../utils/gamification.js';

export const getLeaderboard = async (_req, res, next) => {
  try {
    const users = await User.find({});
    const leaderboard = buildLeaderboard(users);
    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
};
