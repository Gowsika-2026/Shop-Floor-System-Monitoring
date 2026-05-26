import apiClient from './api';
import { Allocation } from '@store/slices/allocationSlice';
import { BulkAllocationItem, BulkAllocationResponse } from '../types';

export const allocationService = {
  allocate: async (data: {
    workOrderId: number;
    resourceType: 'operator' | 'machine' | 'material';
    resourceId: number;
    quantity?: number;
  }) => {
    const response = await apiClient.post<{ data: Allocation }>('/allocations', data);
    return response.data.data;
  },

  bulkAllocate: async (allocations: BulkAllocationItem[]) => {
    const response = await apiClient.post<{ data: BulkAllocationResponse[] }>('/allocations/bulk', { allocations });
    return response.data.data;
  },

  reallocate: async (data: { allocationId: number; newWorkOrderId: number }) => {
    const response = await apiClient.post<{ data: Allocation }>('/allocations/reallocate', data);
    return response.data.data;
  },

  getAllocationsByWorkOrder: async (workOrderId: number) => {
    const response = await apiClient.get<{ data: Allocation[] }>(
      `/allocations/work-order/${workOrderId}`
    );
    return response.data.data;
  },

  updateAllocation: async (id: number, data: UpdateAllocationDTO) => {
    const response = await apiClient.put<{ data: Allocation }>(`/allocations/${id}`, data);
    return response.data.data;
  },

  removeAllocation: async (id: number) => {
    await apiClient.delete(`/allocations/${id}`);
  },
};
