import { Router } from 'express';
import {
  getDashboardStats,
  listUsers,
  toggleBanUser,
  deletePost,
  awardBadge,
  adjustPoints,
} from '../controllers/adminController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const adminRouter = Router();

adminRouter.use(requireAuth(['admin']));
adminRouter.get('/stats', getDashboardStats);
adminRouter.get('/users', listUsers);
adminRouter.post('/users/:userId/toggle-ban', toggleBanUser);
adminRouter.delete('/posts/:postId', deletePost);
adminRouter.post('/users/:userId/badges', awardBadge);
adminRouter.post('/users/:userId/points', adjustPoints);
