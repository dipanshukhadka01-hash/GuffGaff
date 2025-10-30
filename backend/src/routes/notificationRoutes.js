import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { listNotifications, markNotificationRead } from '../controllers/notificationController.js';

const router = Router();

router.get('/', authenticate, listNotifications);
router.post('/:notificationId/read', authenticate, markNotificationRead);

export default router;
