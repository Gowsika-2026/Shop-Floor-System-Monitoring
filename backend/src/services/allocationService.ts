import { ResourceAllocation, WorkOrder } from '../models';
import { operatorService } from './operatorService';
import { machineService } from './machineService';
import { materialService } from './materialService';
import { workOrderService } from './workOrderService';
import { NotFoundError, ConflictError, ValidationError } from '../utils/AppError';
import { emitAllocationUpdate } from '../socket';

export const allocationService = {
  async allocate(data: {
    workOrderId: number;
    resourceType: 'operator' | 'machine' | 'material';
    resourceId: number;
    quantity?: number;
    allocatedBy: number;
  }) {
    // Verify work order exists
    const workOrder = await workOrderService.getById(data.workOrderId);

    // Verify resource is available and allocate
    if (data.resourceType === 'operator') {
      await operatorService.assignToWorkOrder(data.resourceId, data.workOrderId);
    } else if (data.resourceType === 'machine') {
      await machineService.assignToWorkOrder(data.resourceId, data.workOrderId);
    } else if (data.resourceType === 'material') {
      if (!data.quantity || data.quantity <= 0) {
        throw new ValidationError('Quantity is required for material allocation');
      }
      await materialService.allocate(data.resourceId, data.quantity);
    }

    // Create allocation record
    const allocation = await ResourceAllocation.create({
      workOrderId: data.workOrderId,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      quantity: data.quantity || null,
      allocatedBy: data.allocatedBy,
      status: 'active',
    });

    emitAllocationUpdate(allocation);
    return allocation;
  },

  async bulkAllocate(allocations: Array<{
    workOrderId: number;
    resourceType: 'operator' | 'machine' | 'material';
    resourceId: number;
    quantity?: number;
    allocatedBy: number;
  }>) {
    const results = [];
    
    for (const allocationData of allocations) {
      try {
        const allocation = await this.allocate(allocationData);
        results.push({ success: true, allocation });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        results.push({ success: false, error: message });
      }
    }

    return results;
  },

  async reallocate(data: {
    allocationId: number;
    newWorkOrderId: number;
    allocatedBy: number;
  }) {
    const allocation = await ResourceAllocation.findByPk(data.allocationId);
    
    if (!allocation) {
      throw new NotFoundError('Allocation not found');
    }

    // Verify new work order exists
    await workOrderService.getById(data.newWorkOrderId);

    // Update the allocation
    await allocation.update({
      workOrderId: data.newWorkOrderId,
      allocatedBy: data.allocatedBy,
    });

    // Update resource assignments
    if (allocation.resourceType === 'operator') {
      await operatorService.assignToWorkOrder(allocation.resourceId, data.newWorkOrderId);
    } else if (allocation.resourceType === 'machine') {
      await machineService.assignToWorkOrder(allocation.resourceId, data.newWorkOrderId);
    }

    emitAllocationUpdate(allocation);
    return allocation;
  },

  async getAllocationsByWorkOrder(workOrderId: number) {
    return await ResourceAllocation.findAll({
      where: {
        workOrderId,
        status: 'active',
      },
      include: [
        {
          association: 'workOrder',
          required: false,
        },
        {
          association: 'allocator',
          required: false,
          attributes: ['id', 'name', 'username'],
        },
      ],
    });
  },

  async updateAllocation(id: number, data: UpdateAllocationDTO) {
    const allocation = await ResourceAllocation.findByPk(id);
    
    if (!allocation) {
      throw new NotFoundError('Allocation not found');
    }

    await allocation.update(data);
    emitAllocationUpdate(allocation);
    return allocation;
  },

  async removeAllocation(id: number) {
    const allocation = await ResourceAllocation.findByPk(id);
    
    if (!allocation) {
      throw new NotFoundError('Allocation not found');
    }

    // Free up the resource
    if (allocation.resourceType === 'operator') {
      await operatorService.unassignFromWorkOrder(allocation.resourceId);
    } else if (allocation.resourceType === 'machine') {
      await machineService.unassignFromWorkOrder(allocation.resourceId);
    } else if (allocation.resourceType === 'material' && allocation.quantity) {
      await materialService.deallocate(allocation.resourceId, parseFloat(allocation.quantity.toString()));
    }

    // Mark allocation as cancelled
    await allocation.update({ status: 'cancelled' });
    emitAllocationUpdate(allocation);
  },

  async completeAllocation(id: number) {
    const allocation = await ResourceAllocation.findByPk(id);
    
    if (!allocation) {
      throw new NotFoundError('Allocation not found');
    }

    await allocation.update({ status: 'completed' });
    emitAllocationUpdate(allocation);
    return allocation;
  },
};
