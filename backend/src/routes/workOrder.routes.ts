import { Router } from 'express';
import { workOrderController } from '../controllers/workOrder.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', workOrderController.getAll);
router.get('/:id', workOrderController.getById);
router.post('/', authorize('admin', 'supervisor'), workOrderController.create);
router.put('/:id', authorize('admin', 'supervisor'), workOrderController.update);
router.delete('/:id', authorize('admin'), workOrderController.delete);
router.patch('/:id/status', authorize('admin', 'supervisor'), workOrderController.updateStatus);
router.patch('/:id/priority', authorize('admin', 'supervisor'), workOrderController.updatePriority);

export default router;
