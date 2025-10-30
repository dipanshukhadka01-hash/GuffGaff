import { validationResult } from 'express-validator';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { createNotification } from '../services/notificationService.js';
import { PAYBACK_ACTIONS } from '../utils/gamification.js';

export const listCategories = async (_req, res, next) => {
  try {
    const categories = await Post.distinct('category');
    res.json(categories.sort());
  } catch (error) {
    next(error);
  }
};

export const listPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const posts = await Post.find({ category })
      .populate('author', 'username profileImageUrl rank badges')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const post = await Post.create({
      author: req.user._id,
      ...req.body,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.posts': 1 },
    });

    if (post.type === 'fun') {
      req.user.addPaybackPoints(PAYBACK_ACTIONS.FUN_POST);
      await req.user.save();
    }

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { content, audioUrl } = req.body;
    const post = await Post.findById(req.params.postId).populate('author');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ author: req.user._id, content, audioUrl });
    await post.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.comments': 1 },
    });

    if (post.author.id !== req.user.id) {
      await createNotification({
        recipient: post.author.id,
        actor: req.user._id,
        type: 'comment',
        post: post._id,
        message: `${req.user.username} replied to your post`,
      });
    }

    res.status(201).json(post.comments.at(-1));
  } catch (error) {
    next(error);
  }
};

export const addReply = async (req, res, next) => {
  try {
    const { content, audioUrl } = req.body;
    const post = await Post.findById(req.params.postId).populate('author');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.replies.push({ author: req.user._id, content, audioUrl });
    await post.save();

    if (comment.author.toString() !== req.user.id) {
      await createNotification({
        recipient: comment.author,
        actor: req.user._id,
        type: 'reply',
        post: post._id,
        commentId: comment._id,
        message: `${req.user.username} replied to your comment`,
      });
    }

    res.status(201).json(comment.replies.at(-1));
  } catch (error) {
    next(error);
  }
};

export const markSolved = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).populate('author');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.id !== req.user.id) {
      return res.status(403).json({ message: 'Only the author can mark a post as solved' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    post.isSolved = true;
    post.solvedCommentId = comment._id;
    comment.isVerified = true;

    await post.save();

    const helper = await User.findById(comment.author);
    helper.addPaybackPoints(PAYBACK_ACTIONS.VERIFIED_SOLUTION);
    helper.awardBadge('Helper', 'Provided a verified solution');
    await helper.save();

    await createNotification({
      recipient: helper._id,
      actor: req.user._id,
      type: 'verification',
      post: post._id,
      commentId: comment._id,
      message: `${req.user.username} verified your solution!`,
    });

    res.json(post);
  } catch (error) {
    next(error);
  }
};
