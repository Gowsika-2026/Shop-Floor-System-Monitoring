import { Router } from 'express';
import { machineController } from '../controllers/machine.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', machineController.getAll);
router.get('/available', machineController.getAvailable);
router.get('/:id', machineController.getById);
router.post('/', authorize('admin', 'supervisor'), machineController.create);
router.put('/:id', authorize('admin', 'supervisor'), machineController.update);
router.delete('/:id', authorize('admin'), machineController.delete);
router.patch('/:id/status', authorize('admin', 'supervisor'), machineController.updateStatus);

export default router;
