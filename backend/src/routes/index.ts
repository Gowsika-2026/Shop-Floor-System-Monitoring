import { Router } from 'express';
import authRoutes from './auth.routes';
import operatorRoutes from './operator.routes';
import machineRoutes from './machine.routes';
import materialRoutes from './material.routes';
import workOrderRoutes from './workOrder.routes';
import allocationRoutes from './allocation.routes';
import dashboardRoutes from './dashboard.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/operators', operatorRoutes);
router.use('/machines', machineRoutes);
router.use('/materials', materialRoutes);
router.use('/work-orders', workOrderRoutes);
router.use('/allocations', allocationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
