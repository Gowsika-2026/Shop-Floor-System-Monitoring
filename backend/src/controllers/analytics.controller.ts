import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Operator, Machine, WorkOrder } from '../models';
import { Op } from 'sequelize';

class AnalyticsController {
  async getUtilization(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const operators = await Operator.findAll();
      const machines = await Machine.findAll();

      const operatorUtilization = {
        total: operators.length,
        utilized: operators.filter((o) => o.status === 'assigned').length,
        percentage:
          operators.length > 0
            ? (operators.filter((o) => o.status === 'assigned').length / operators.length) * 100
            : 0,
      };

      const machineUtilization = {
        total: machines.length,
        utilized: machines.filter((m) => m.status === 'busy').length,
        percentage:
          machines.length > 0
            ? (machines.filter((m) => m.status === 'busy').length / machines.length) * 100
            : 0,
      };

      res.status(200).json({
        status: 'success',
        data: {
          operators: operatorUtilization,
          machines: machineUtilization,
        },
        message: 'Utilization data retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getIdleTime(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const operators = await Operator.findAll();
      const machines = await Machine.findAll();

      const idleOperators = operators.filter((o) => o.status === 'available');
      const idleMachines = machines.filter((m) => m.status === 'idle');

      res.status(200).json({
        status: 'success',
        data: {
          operators: {
            count: idleOperators.length,
            list: idleOperators,
          },
          machines: {
            count: idleMachines.length,
            list: idleMachines,
          },
        },
        message: 'Idle time data retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getWorkOrderStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;

      const where: Record<string, unknown> = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate as string);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate as string);
      }

      const workOrders = await WorkOrder.findAll({ where });

      const stats = {
        total: workOrders.length,
        byStatus: {
          pending: workOrders.filter((w) => w.status === 'pending').length,
          inProgress: workOrders.filter((w) => w.status === 'in-progress').length,
          completed: workOrders.filter((w) => w.status === 'completed').length,
          onHold: workOrders.filter((w) => w.status === 'on-hold').length,
        },
        byPriority: {
          urgent: workOrders.filter((w) => w.priority === 'urgent').length,
          high: workOrders.filter((w) => w.priority === 'high').length,
          normal: workOrders.filter((w) => w.priority === 'normal').length,
          low: workOrders.filter((w) => w.priority === 'low').length,
        },
        averageDuration:
          workOrders.filter((w) => w.endTime && w.startTime).reduce((acc, w) => {
            const duration = w.endTime!.getTime() - w.startTime!.getTime();
            return acc + duration / (1000 * 60); // minutes
          }, 0) / (workOrders.filter((w) => w.endTime && w.startTime).length || 1),
      };

      res.status(200).json({
        status: 'success',
        data: stats,
        message: 'Work order statistics retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
