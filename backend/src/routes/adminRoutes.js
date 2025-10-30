import { Router } from 'express';
import {
  getAdminOverview,
  listUsers,
  setUserBan,
  removePost
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);
router.get('/overview', getAdminOverview);
router.get('/users', listUsers);
router.patch('/users/:id/ban', setUserBan);
router.delete('/posts/:id', removePost);

export default router;
