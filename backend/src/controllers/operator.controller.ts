import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { operatorService } from '../services/operatorService';

class OperatorController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const operators = await operatorService.getAll();
      res.status(200).json({
        status: 'success',
        data: operators,
        message: 'Operators retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAvailable(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const operators = await operatorService.getAvailable();
      res.status(200).json({
        status: 'success',
        data: operators,
        message: 'Available operators retrieved',
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const operator = await operatorService.getById(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        data: operator,
        message: 'Operator retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const operator = await operatorService.create(req.body);
      res.status(201).json({
        status: 'success',
        data: operator,
        message: 'Operator created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const operator = await operatorService.update(Number(req.params.id), req.body);
      res.status(200).json({
        status: 'success',
        data: operator,
        message: 'Operator updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await operatorService.delete(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        message: 'Operator deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const operator = await operatorService.updateStatus(Number(req.params.id), status);
      res.status(200).json({
        status: 'success',
        data: operator,
        message: 'Operator status updated',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const operatorController = new OperatorController();
