import { Operator, WorkOrder } from '../models';
import { NotFoundError, ConflictError } from '../utils/AppError';
import { emitResourceUpdate, emitStatusChange } from '../socket';
import { CreateOperatorDTO, UpdateOperatorDTO } from '../types';

export const operatorService = {
  async getAll() {
    return await Operator.findAll({
      order: [['name', 'ASC']],
    });
  },

  async getAvailable() {
    return await Operator.findAll({
      where: {
        status: 'available',
      },
      order: [['name', 'ASC']],
    });
  },

  async getById(id: number) {
    const operator = await Operator.findByPk(id);
    if (!operator) {
      throw new NotFoundError('Operator not found');
    }
    return operator;
  },

  async create(data: CreateOperatorDTO) {
    const operator = await Operator.create(data);
    emitResourceUpdate('operator', operator);
    return operator;
  },

  async update(id: number, data: UpdateOperatorDTO) {
    const operator = await this.getById(id);
    await operator.update(data);
    emitResourceUpdate('operator', operator);
    return operator;
  },

  async delete(id: number) {
    const operator = await this.getById(id);
    
    if (operator.currentAssignment) {
      throw new ConflictError('Cannot delete operator with active assignment');
    }

    await operator.destroy();
  },

  async updateStatus(id: number, status: string) {
    const operator = await this.getById(id);
    
    if (status === 'available' && operator.currentAssignment) {
      throw new ConflictError('Cannot set status to available while assigned to work order');
    }

    await operator.update({ status });
    emitStatusChange('operator', id, status);
    return operator;
  },

  async assignToWorkOrder(operatorId: number, workOrderId: number) {
    const operator = await this.getById(operatorId);
    
    if (operator.status === 'assigned') {
      throw new ConflictError('Operator is already assigned');
    }

    const workOrder = await WorkOrder.findByPk(workOrderId);
    if (!workOrder) {
      throw new NotFoundError('Work order not found');
    }

    await operator.update({
      status: 'assigned',
      currentAssignment: workOrderId,
    });

    emitResourceUpdate('operator', operator);
    return operator;
  },

  async unassignFromWorkOrder(operatorId: number) {
    const operator = await this.getById(operatorId);
    
    await operator.update({
      status: 'available',
      currentAssignment: null,
    });

    emitResourceUpdate('operator', operator);
    return operator;
  },
};
