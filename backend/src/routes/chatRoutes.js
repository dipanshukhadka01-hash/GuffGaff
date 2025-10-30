import { Router } from 'express';
import {
  listConversations,
  createConversation,
  sendMessage,
  getMessages,
} from '../controllers/chatController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const chatRouter = Router();

chatRouter.use(requireAuth());
chatRouter.get('/', listConversations);
chatRouter.post('/', createConversation);
chatRouter.get('/:conversationId/messages', getMessages);
chatRouter.post('/:conversationId/messages', sendMessage);
