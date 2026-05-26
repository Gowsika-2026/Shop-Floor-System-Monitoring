import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/utilization', analyticsController.getUtilization);
router.get('/idle-time', analyticsController.getIdleTime);
router.get('/work-orders', analyticsController.getWorkOrderStats);

export default router;
