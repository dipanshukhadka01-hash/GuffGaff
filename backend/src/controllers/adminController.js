import createError from 'http-errors';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const assertAdmin = (user) => {
  if (!user.roles?.includes('admin')) {
    throw createError(403, 'Administrator privileges required.');
  }
};

export const getAdminOverview = async (req, res, next) => {
  try {
    assertAdmin(req.user);
    const [userCount, postCount, commentCount] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments()
    ]);

    res.json({
      stats: {
        userCount,
        postCount,
        commentCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    assertAdmin(req.user);
    const users = await User.find().select(
      'username email paybackPoints badges roles createdAt bannedUntil'
    );
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const setUserBan = async (req, res, next) => {
  try {
    assertAdmin(req.user);
    const { id } = req.params;
    const { bannedUntil } = req.body;
    const user = await User.findByIdAndUpdate(id, { bannedUntil }, { new: true });
    if (!user) return next(createError(404, 'User not found.'));
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const removePost = async (req, res, next) => {
  try {
    assertAdmin(req.user);
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ post: req.params.id });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
