import apiClient from './api';
import { Material } from '@store/slices/materialSlice';

export const materialService = {
  getAll: async () => {
    const response = await apiClient.get<{ data: Material[] }>('/materials');
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<{ data: Material }>(`/materials/${id}`);
    return response.data.data;
  },

  create: async (material: Partial<Material>) => {
    const response = await apiClient.post<{ data: Material }>('/materials', material);
    return response.data.data;
  },

  update: async (id: number, material: Partial<Material>) => {
    const response = await apiClient.put<{ data: Material }>(`/materials/${id}`, material);
    return response.data.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/materials/${id}`);
  },

  updateQuantity: async (id: number, quantity: number) => {
    const response = await apiClient.patch<{ data: Material }>(`/materials/${id}/quantity`, {
      quantity,
    });
    return response.data.data;
  },
};
