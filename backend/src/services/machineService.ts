import { Machine } from '../models';
import { NotFoundError, ConflictError } from '../utils/AppError';
import { emitResourceUpdate, emitStatusChange } from '../socket';

export const machineService = {
  async getAll() {
    return await Machine.findAll({
      order: [['name', 'ASC']],
    });
  },

  async getAvailable() {
    return await Machine.findAll({
      where: {
        status: 'idle',
      },
      order: [['name', 'ASC']],
    });
  },

  async getById(id: number) {
    const machine = await Machine.findByPk(id);
    if (!machine) {
      throw new NotFoundError('Machine not found');
    }
    return machine;
  },

  async create(data: CreateMachineDTO) {
    const machine = await Machine.create(data);
    emitResourceUpdate('machine', machine);
    return machine;
  },

  async update(id: number, data: UpdateMachineDTO) {
    const machine = await this.getById(id);
    await machine.update(data);
    emitResourceUpdate('machine', machine);
    return machine;
  },

  async delete(id: number) {
    const machine = await this.getById(id);
    
    if (machine.currentWorkOrder) {
      throw new ConflictError('Cannot delete machine with active work order');
    }

    await machine.destroy();
  },

  async updateStatus(id: number, status: string) {
    const machine = await this.getById(id);
    
    if (status === 'idle' && machine.currentWorkOrder) {
      throw new ConflictError('Cannot set status to idle while assigned to work order');
    }

    await machine.update({ status });
    emitStatusChange('machine', id, status);
    return machine;
  },

  async assignToWorkOrder(machineId: number, workOrderId: number) {
    const machine = await this.getById(machineId);
    
    if (machine.status === 'busy') {
      throw new ConflictError('Machine is already busy');
    }

    if (machine.status === 'maintenance' || machine.status === 'breakdown') {
      throw new ConflictError(`Machine is in ${machine.status} status`);
    }

    await machine.update({
      status: 'busy',
      currentWorkOrder: workOrderId,
    });

    emitResourceUpdate('machine', machine);
    return machine;
  },

  async unassignFromWorkOrder(machineId: number) {
    const machine = await this.getById(machineId);
    
    await machine.update({
      status: 'idle',
      currentWorkOrder: null,
    });

    emitResourceUpdate('machine', machine);
    return machine;
  },
};
