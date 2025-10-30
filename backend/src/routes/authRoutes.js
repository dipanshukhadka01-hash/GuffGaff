import { Router } from 'express';
import {
  signup,
  login,
  googleAuth,
  getProfile,
  updateProfile,
  requestPasswordReset,
  verifyTokenController
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { signupValidator, loginValidator } from '../middleware/validators.js';

const router = Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/google', googleAuth);
router.post('/password/request-reset', requestPasswordReset);
router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);
router.get('/verify', authenticate, verifyTokenController);

export default router;
