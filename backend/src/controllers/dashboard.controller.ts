import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dashboardService } from '../services/dashboardService';

class DashboardController {
  async getOverview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const overview = await dashboardService.getOverview();
      res.status(200).json({
        status: 'success',
        data: overview,
        message: 'Dashboard overview retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
