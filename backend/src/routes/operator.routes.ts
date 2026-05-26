import { Router } from 'express';
import { operatorController } from '../controllers/operator.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', operatorController.getAll);
router.get('/available', operatorController.getAvailable);
router.get('/:id', operatorController.getById);
router.post('/', authorize('admin', 'supervisor'), operatorController.create);
router.put('/:id', authorize('admin', 'supervisor'), operatorController.update);
router.delete('/:id', authorize('admin'), operatorController.delete);
router.patch('/:id/status', authorize('admin', 'supervisor', 'operator'), operatorController.updateStatus);

export default router;
