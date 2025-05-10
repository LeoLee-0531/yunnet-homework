import { Router } from 'express';
import { getUserProfile } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// TODO: 這個路由需要身份驗證
router.get('/me', authenticateToken, getUserProfile);

export default router;