import apiClient from './api';
import { Machine } from '@store/slices/machineSlice';

export const machineService = {
  getAll: async () => {
    const response = await apiClient.get<{ data: Machine[] }>('/machines');
    return response.data.data;
  },

  getAvailable: async () => {
    const response = await apiClient.get<{ data: Machine[] }>('/machines/available');
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: Machine }>(`/machines/${id}`);
    return response.data.data;
  },

  create: async (machine: Partial<Machine>) => {
    const response = await apiClient.post<{ data: Machine }>('/machines', machine);
    return response.data.data;
  },

  update: async (id: number, machine: Partial<Machine>) => {
    const response = await apiClient.put<{ data: Machine }>(`/machines/${id}`, machine);
    return response.data.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/machines/${id}`);
  },

  updateStatus: async (id: number, status: string) => {
    const response = await apiClient.patch<{ data: Machine }>(`/machines/${id}/status`, {
      status,
    });
    return response.data.data;
  },
};
