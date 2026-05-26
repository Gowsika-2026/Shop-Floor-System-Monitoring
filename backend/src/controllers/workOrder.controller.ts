import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { workOrderService } from '../services/workOrderService';

class WorkOrderController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const workOrders = await workOrderService.getAll(filters);
      res.status(200).json({
        status: 'success',
        data: workOrders,
        message: 'Work orders retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workOrder = await workOrderService.getById(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        data: workOrder,
        message: 'Work order retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workOrder = await workOrderService.create(req.body);
      res.status(201).json({
        status: 'success',
        data: workOrder,
        message: 'Work order created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workOrder = await workOrderService.update(Number(req.params.id), req.body);
      res.status(200).json({
        status: 'success',
        data: workOrder,
        message: 'Work order updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await workOrderService.delete(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        message: 'Work order deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const workOrder = await workOrderService.updateStatus(Number(req.params.id), status);
      res.status(200).json({
        status: 'success',
        data: workOrder,
        message: 'Work order status updated',
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePriority(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { priority } = req.body;
      const workOrder = await workOrderService.updatePriority(Number(req.params.id), priority);
      res.status(200).json({
        status: 'success',
        data: workOrder,
        message: 'Work order priority updated',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const workOrderController = new WorkOrderController();
