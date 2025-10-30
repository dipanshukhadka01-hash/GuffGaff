import { Router } from 'express';
import { listNotifications, markAsRead } from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const notificationRouter = Router();

notificationRouter.use(requireAuth());
notificationRouter.get('/', listNotifications);
notificationRouter.post('/:notificationId/read', markAsRead);
