import { Router } from 'express';
import { allocationController } from '../controllers/allocation.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize('admin', 'supervisor'));

router.post('/', allocationController.allocate);
router.post('/bulk', allocationController.bulkAllocate);
router.post('/reallocate', allocationController.reallocate);
router.get('/work-order/:id', allocationController.getAllocationsByWorkOrder);
router.put('/:id', allocationController.updateAllocation);
router.delete('/:id', allocationController.removeAllocation);

export default router;
