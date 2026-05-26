import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { machineService } from '../services/machineService';

class MachineController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const machines = await machineService.getAll();
      res.status(200).json({
        status: 'success',
        data: machines,
        message: 'Machines retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAvailable(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const machines = await machineService.getAvailable();
      res.status(200).json({
        status: 'success',
        data: machines,
        message: 'Available machines retrieved',
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const machine = await machineService.getById(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        data: machine,
        message: 'Machine retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const machine = await machineService.create(req.body);
      res.status(201).json({
        status: 'success',
        data: machine,
        message: 'Machine created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const machine = await machineService.update(Number(req.params.id), req.body);
      res.status(200).json({
        status: 'success',
        data: machine,
        message: 'Machine updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await machineService.delete(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        message: 'Machine deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const machine = await machineService.updateStatus(Number(req.params.id), status);
      res.status(200).json({
        status: 'success',
        data: machine,
        message: 'Machine status updated',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const machineController = new MachineController();
