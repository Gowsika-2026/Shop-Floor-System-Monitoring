import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
