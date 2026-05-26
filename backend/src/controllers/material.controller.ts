import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { materialService } from '../services/materialService';

class MaterialController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const materials = await materialService.getAll();
      res.status(200).json({
        status: 'success',
        data: materials,
        message: 'Materials retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const material = await materialService.getById(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        data: material,
        message: 'Material retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const material = await materialService.create(req.body);
      res.status(201).json({
        status: 'success',
        data: material,
        message: 'Material created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const material = await materialService.update(Number(req.params.id), req.body);
      res.status(200).json({
        status: 'success',
        data: material,
        message: 'Material updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await materialService.delete(Number(req.params.id));
      res.status(200).json({
        status: 'success',
        message: 'Material deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateQuantity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { quantity } = req.body;
      const material = await materialService.updateQuantity(Number(req.params.id), quantity);
      res.status(200).json({
        status: 'success',
        data: material,
        message: 'Material quantity updated',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const materialController = new MaterialController();
