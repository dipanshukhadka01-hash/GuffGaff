import { Router } from 'express';
import {
  createPost,
  listPosts,
  toggleLike,
  markSolved,
  incrementShare,
  deletePost
} from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';
import { postValidator } from '../middleware/validators.js';
import { createComment, listComments, toggleCommentLike } from '../controllers/commentController.js';

const router = Router();

router
  .route('/')
  .get(authenticate, listPosts)
  .post(authenticate, postValidator, createPost);

router.post('/:id/like', authenticate, toggleLike);
router.post('/:id/share', authenticate, incrementShare);
router.post('/:id/solve', authenticate, markSolved);
router.delete('/:id', authenticate, deletePost);

router
  .route('/:postId/comments')
  .get(authenticate, listComments)
  .post(authenticate, createComment);

router.post('/:postId/comments/:commentId/like', authenticate, toggleCommentLike);

export default router;
