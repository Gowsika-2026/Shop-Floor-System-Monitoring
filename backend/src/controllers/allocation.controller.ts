import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { allocationService } from '../services/allocationService';

class AllocationController {
  async allocate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const allocation = await allocationService.allocate({
        ...req.body,
        allocatedBy: req.user!.id,
      });
      res.status(201).json({
        status: 'success',
        data: allocation,
        message: 'Resource allocated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkAllocate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { allocations } = req.body;
      const allocationsWithUser = allocations.map((a) => ({
        ...a,
        allocatedBy: req.user!.id,
      }));
      const results = await allocationService.bulkAllocate(allocationsWithUser);
      res.status(201).json({
        status: 'success',
        data: results,
        message: 'Resources allocated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async reallocate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const allocation = await allocationService.reallocate({
        ...req.body,
        allocatedBy: req.user!.id,
      });
      res.status(200).json({
        status: 'success',
        data: allocation,
        message: 'Resource reallocated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllocationsByWorkOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const allocations = await allocationService.getAllocationsByWorkOrder(
        Number(req.params.id)
      );
      res.status(200).json({
        status: 'success',
        data: allocations,
        message: 'Allocations retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAllocation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const allocation = await allocationService.updateAllocation(
        Number(req.params.id),
        req.body
      );
      res.status(200).json({
        status: 'success',
        data: allocation,
        message: 'Allocation updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async removeAllocation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await allocationService.removeAllocation(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        message: 'Allocation removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const allocationController = new AllocationController();
