import apiClient from './api';
import { Operator } from '@store/slices/operatorSlice';

export const operatorService = {
  getAll: async () => {
    const response = await apiClient.get<{ data: Operator[] }>('/operators');
    return response.data.data;
  },

  getAvailable: async () => {
    const response = await apiClient.get<{ data: Operator[] }>('/operators/available');
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: Operator }>(`/operators/${id}`);
    return response.data.data;
  },

  create: async (operator: Partial<Operator>) => {
    const response = await apiClient.post<{ data: Operator }>('/operators', operator);
    return response.data.data;
  },

  update: async (id: number, operator: Partial<Operator>) => {
    const response = await apiClient.put<{ data: Operator }>(`/operators/${id}`, operator);
    return response.data.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/operators/${id}`);
  },

  updateStatus: async (id: number, status: string) => {
    const response = await apiClient.patch<{ data: Operator }>(`/operators/${id}/status`, {
      status,
    });
    return response.data.data;
  },
};
