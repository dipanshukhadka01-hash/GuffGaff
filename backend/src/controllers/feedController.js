import { Post } from '../models/Post.js';
import { createNotification } from '../services/notificationService.js';

export const getBanterFeed = async (_req, res, next) => {
  try {
    const posts = await Post.find({ type: { $in: ['fun', 'rant'] } })
      .populate('author', 'username profileImageUrl rank badges')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const reactToPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).populate('author');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.toggleReaction({ userId: req.user._id, type: req.body.type });
    await post.save();

    if (post.author.id !== req.user.id) {
      await createNotification({
        recipient: post.author.id,
        actor: req.user._id,
        type: 'like',
        post: post._id,
        message: `${req.user.username} reacted to your post`,
      });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const addMoodTag = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the author can update the mood tag' });
    }

    post.moodTag = req.body.moodTag;
    await post.save();

    res.json(post);
  } catch (error) {
    next(error);
  }
};
