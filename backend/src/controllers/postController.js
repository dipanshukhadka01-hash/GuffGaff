import createError from 'http-errors';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { evaluateBadges } from '../utils/badges.js';

const populatePost = [
  { path: 'author', select: 'username profilePicture rank paybackPoints badges' },
  { path: 'solvedComment', populate: { path: 'author', select: 'username profilePicture' } }
];

export const createPost = async (req, res, next) => {
  try {
    const { category, postType, content, moodTag, audioUrl } = req.body;
    const post = await Post.create({
      author: req.user.id,
      category,
      postType,
      content,
      moodTag,
      audioUrl
    });

    const populated = await Post.findById(post.id).populate(populatePost);
    const socketServer = req.app.get('socketServer');
    socketServer?.broadcastFeedUpdate(populated);
    res.status(201).json({ post: populated });
  } catch (error) {
    next(error);
  }
};

export const listPosts = async (req, res, next) => {
  try {
    const { category, moodTag, postType } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (moodTag) filter.moodTag = moodTag;
    if (postType) filter.postType = postType;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate(populatePost);

    res.json({ posts });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, 'Post not found.'));

    const userId = req.user.id;
    const alreadyLiked = post.likeIds.some((id) => id.equals(userId));
    if (alreadyLiked) {
      post.likeIds = post.likeIds.filter((id) => !id.equals(userId));
    } else {
      post.likeIds.push(userId);
    }

    await post.save();
    const populated = await Post.findById(post.id).populate(populatePost);
    const socketServer = req.app.get('socketServer');

    if (!alreadyLiked && post.author && !post.author.equals(req.user.id)) {
      socketServer?.pushNotification({
        userId: post.author,
        type: 'like',
        message: `${req.user.username} appreciated your post.`,
        link: `/posts/${post.id}`
      });
    }

    res.json({ post: populated });
  } catch (error) {
    next(error);
  }
};

export const markSolved = async (req, res, next) => {
  try {
    const { commentId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, 'Post not found.'));
    if (!post.author.equals(req.user.id)) {
      return next(createError(403, 'Only the original poster can mark as solved.'));
    }

    const comment = await Comment.findById(commentId);
    if (!comment || !comment.post.equals(post.id)) {
      return next(createError(400, 'Invalid comment.'));
    }

    post.solved = true;
    post.solvedComment = comment.id;
    post.verifiedBy = req.user.id;
    await post.save();

    comment.isVerified = true;
    await comment.save();

    const helper = await User.findById(comment.author);
    if (helper) {
      helper.paybackPoints += 50;
      helper.solvedCount += 1;
      helper.badges = Array.from(
        new Set([...helper.badges, ...evaluateBadges(helper.toObject())])
      );
      await helper.save();
      const socketServer = req.app.get('socketServer');
      socketServer?.pushNotification({
        userId: helper.id,
        type: 'verify',
        message: `${req.user.username} marked your answer as the solution!`,
        link: `/posts/${post.id}`
      });
    }

    const populated = await Post.findById(post.id).populate(populatePost);
    res.json({ post: populated });
  } catch (error) {
    next(error);
  }
};

export const incrementShare = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { shareCount: 1 } },
      { new: true }
    ).populate(populatePost);

    if (!post) return next(createError(404, 'Post not found.'));
    res.json({ post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, 'Post not found.'));
    const isAdmin = req.user.roles?.includes('admin');
    if (!post.author.equals(req.user.id) && !isAdmin) {
      return next(createError(403, 'You are not allowed to delete this post.'));
    }

    await Comment.deleteMany({ post: post.id });
    await post.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
