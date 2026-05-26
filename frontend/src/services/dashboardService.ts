import apiClient from './api';
import { DashboardStatsParams } from '../types';

export const dashboardService = {
  getOverview: async () => {
    const response = await apiClient.get('/dashboard/overview');
    return response.data.data;
  },
};

export const analyticsService = {
  getUtilization: async () => {
    const response = await apiClient.get('/analytics/utilization');
    return response.data.data;
  },

  getIdleTime: async () => {
    const response = await apiClient.get('/analytics/idle-time');
    return response.data.data;
  },

  getWorkOrderStats: async (params?: DashboardStatsParams) => {
    const response = await apiClient.get('/analytics/work-orders', { params });
    return response.data.data;
  },
};
