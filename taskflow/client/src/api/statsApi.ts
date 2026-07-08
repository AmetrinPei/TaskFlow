import apiClient from './client';
import type { StatsOverview, ApiResponse } from '../types';

export const statsApi = {
  getOverview: () =>
    apiClient.get<any, ApiResponse<StatsOverview>>('/stats'),
};
