import { WorkOrder, ResourceAllocation } from '../models';
import { NotFoundError } from '../utils/AppError';
import { emitWorkOrderUpdate } from '../socket';
import { Op } from 'sequelize';
import { CreateWorkOrderDTO, UpdateWorkOrderDTO, WorkOrderStatsParams } from '../types';

export const workOrderService = {
  async getAll(filters: Partial<WorkOrderStatsParams> = {}) {
    const where: Record<string, unknown> = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt[Op.gte] = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt[Op.lte] = new Date(filters.endDate);
      }
    }

    return await WorkOrder.findAll({
      where,
      include: [
        {
          association: 'allocations',
          required: false,
        },
      ],
      order: [
        ['priority', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });
  },

  async getById(id: number) {
    const workOrder = await WorkOrder.findByPk(id, {
      include: [
        {
          association: 'allocations',
          required: false,
        },
      ],
    });

    if (!workOrder) {
      throw new NotFoundError('Work order not found');
    }

    return workOrder;
  },

  async create(data: CreateWorkOrderDTO) {
    const workOrder = await WorkOrder.create(data);
    emitWorkOrderUpdate(workOrder);
    return workOrder;
  },

  async update(id: number, data: UpdateWorkOrderDTO) {
    const workOrder = await this.getById(id);
    await workOrder.update(data);
    emitWorkOrderUpdate(workOrder);
    return workOrder;
  },

  async delete(id: number) {
    const workOrder = await this.getById(id);
    
    // Delete all allocations first
    await ResourceAllocation.destroy({
      where: { workOrderId: id },
    });

    await workOrder.destroy();
  },

  async updateStatus(id: number, status: string) {
    const workOrder = await this.getById(id);
    
    const updateData: Partial<{ status: string; startTime: Date; endTime: Date }> = { status };

    if (status === 'in-progress' && !workOrder.startTime) {
      updateData.startTime = new Date();
    }

    if (status === 'completed' && !workOrder.endTime) {
      updateData.endTime = new Date();
    }

    await workOrder.update(updateData);
    emitWorkOrderUpdate(workOrder);
    return workOrder;
  },

  async updatePriority(id: number, priority: string) {
    const workOrder = await this.getById(id);
    await workOrder.update({ priority });
    emitWorkOrderUpdate(workOrder);
    return workOrder;
  },

  async getStatistics() {
    const total = await WorkOrder.count();
    const pending = await WorkOrder.count({ where: { status: 'pending' } });
    const inProgress = await WorkOrder.count({ where: { status: 'in-progress' } });
    const completed = await WorkOrder.count({ where: { status: 'completed' } });
    const onHold = await WorkOrder.count({ where: { status: 'on-hold' } });

    return {
      total,
      pending,
      inProgress,
      completed,
      onHold,
    };
  },
};
