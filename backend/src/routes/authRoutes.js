import { Router } from 'express';
import { body } from 'express-validator';
import {
  registerProfile,
  syncSession,
  generatePasswordReset,
  deleteAccount,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  [body('username').isLength({ min: 3 }).trim(), body('idToken').notEmpty()],
  registerProfile
);

authRouter.post('/session', [body('idToken').notEmpty()], syncSession);

authRouter.post('/password-reset', [body('email').isEmail()], generatePasswordReset);

authRouter.delete('/me', requireAuth(), deleteAccount);
