import { Router } from 'express';
import { materialController } from '../controllers/material.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', materialController.getAll);
router.get('/:id', materialController.getById);
router.post('/', authorize('admin', 'supervisor'), materialController.create);
router.put('/:id', authorize('admin', 'supervisor'), materialController.update);
router.delete('/:id', authorize('admin'), materialController.delete);
router.patch('/:id/quantity', authorize('admin', 'supervisor'), materialController.updateQuantity);

export default router;
