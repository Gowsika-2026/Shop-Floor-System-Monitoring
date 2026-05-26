import apiClient from './api';
import { WorkOrder } from '@store/slices/workOrderSlice';
import { DashboardStatsParams } from '../types';

export const workOrderService = {
  getAll: async (filters?: DashboardStatsParams) => {
    const response = await apiClient.get<{ data: WorkOrder[] }>('/work-orders', {
      params: filters,
    });
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: WorkOrder }>(`/work-orders/${id}`);
    return response.data.data;
  },

  create: async (workOrder: Partial<WorkOrder>) => {
    const response = await apiClient.post<{ data: WorkOrder }>('/work-orders', workOrder);
    return response.data.data;
  },

  update: async (id: number, workOrder: Partial<WorkOrder>) => {
    const response = await apiClient.put<{ data: WorkOrder }>(`/work-orders/${id}`, workOrder);
    return response.data.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/work-orders/${id}`);
  },

  updateStatus: async (id: number, status: string) => {
    const response = await apiClient.patch<{ data: WorkOrder }>(`/work-orders/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  updatePriority: async (id: number, priority: string) => {
    const response = await apiClient.patch<{ data: WorkOrder }>(`/work-orders/${id}/priority`, {
      priority,
    });
    return response.data.data;
  },
};
