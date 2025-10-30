import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Notification } from '../models/Notification.js';
import { getRankForPoints } from '../utils/gamification.js';

export const getDashboardStats = async (_req, res, next) => {
  try {
    const [users, posts, solvedPosts] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Post.countDocuments({ isSolved: true }),
    ]);

    res.json({
      users,
      posts,
      solvedPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (_req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const toggleBanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.roles.includes('banned')) {
      user.roles = user.roles.filter((role) => role !== 'banned');
    } else {
      user.roles.push('banned');
    }

    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const awardBadge = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.badges.push({ type: req.body.badgeType, reason: req.body.reason });
    await user.save();

    await Notification.create({
      recipient: user._id,
      type: 'badge',
      message: `You earned the ${req.body.badgeType} badge!`,
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const adjustPoints = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.paybackPoints += req.body.delta;
    user.rank = getRankForPoints(user.paybackPoints);
    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
};
