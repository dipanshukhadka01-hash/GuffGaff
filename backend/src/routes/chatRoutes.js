import { Router } from 'express';
import {
  listConversations,
  startConversation,
  listMessages,
  postMessage
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, listConversations);
router.post('/', authenticate, startConversation);
router.get('/:id/messages', authenticate, listMessages);
router.post('/:id/messages', authenticate, postMessage);

export default router;
