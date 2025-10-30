import createError from 'http-errors';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

const populateComment = [
  { path: 'author', select: 'username profilePicture rank' },
  { path: 'parentComment' }
];

export const createComment = async (req, res, next) => {
  try {
    const { content, audioUrl, parentComment } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return next(createError(404, 'Post not found.'));

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user.id,
      content,
      audioUrl,
      parentComment
    });

    const populated = await Comment.findById(comment.id).populate(populateComment);
    const socketServer = req.app.get('socketServer');
    if (post.author && !post.author.equals(req.user.id)) {
      socketServer?.pushNotification({
        userId: post.author,
        type: 'comment',
        message: `${req.user.username} replied to your post.`,
        link: `/posts/${post.id}`
      });
    }
    res.status(201).json({ comment: populated });
  } catch (error) {
    next(error);
  }
};

export const listComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: 1 })
      .populate(populateComment);
    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

export const toggleCommentLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(createError(404, 'Comment not found.'));

    const userId = req.user.id;
    const alreadyLiked = comment.likeIds.some((id) => id.equals(userId));
    if (alreadyLiked) {
      comment.likeIds = comment.likeIds.filter((id) => !id.equals(userId));
    } else {
      comment.likeIds.push(userId);
    }

    await comment.save();
    const populated = await Comment.findById(comment.id).populate(populateComment);
    res.json({ comment: populated });
  } catch (error) {
    next(error);
  }
};
