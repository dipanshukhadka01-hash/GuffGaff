import User from '../models/User.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const topHelpers = await User.find()
      .sort({ paybackPoints: -1 })
      .limit(10)
      .select('username profilePicture paybackPoints rank badges');

    const funniest = await User.find()
      .sort({ funCount: -1 })
      .limit(10)
      .select('username profilePicture funCount badges');

    const mostActive = await User.find()
      .sort({ solvedCount: -1 })
      .limit(10)
      .select('username profilePicture solvedCount badges');

    res.json({ topHelpers, funniest, mostActive });
  } catch (error) {
    next(error);
  }
};
