import { Router } from 'express';
import { getBanterFeed, reactToPost, addMoodTag } from '../controllers/feedController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const feedRouter = Router();

feedRouter.get('/', getBanterFeed);
feedRouter.post('/:postId/react', requireAuth(), reactToPost);
feedRouter.patch('/:postId/mood', requireAuth(), addMoodTag);
