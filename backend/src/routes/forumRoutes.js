import { Router } from 'express';
import { body } from 'express-validator';
import {
  listCategories,
  listPosts,
  createPost,
  addComment,
  addReply,
  markSolved,
} from '../controllers/forumController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const forumRouter = Router();

forumRouter.get('/categories', listCategories);
forumRouter.get('/:category/posts', listPosts);

forumRouter.post(
  '/',
  requireAuth(),
  [body('category').notEmpty(), body('type').notEmpty(), body('content').optional()],
  createPost
);

forumRouter.post('/:postId/comments', requireAuth(), addComment);
forumRouter.post('/:postId/comments/:commentId/replies', requireAuth(), addReply);
forumRouter.post('/:postId/solve/:commentId', requireAuth(), markSolved);
