import apiClient from './client';
import type { Task, TaskCreateData, TaskUpdateData, TaskQueryParams, TaskStatus, ApiResponse } from '../types';

export const taskApi = {
  getAll: (params?: TaskQueryParams) =>
    apiClient.get<any, ApiResponse<Task[]>>('/tasks', { params }),

  getById: (id: number) =>
    apiClient.get<any, ApiResponse<Task>>(`/tasks/${id}`),

  create: (data: TaskCreateData) =>
    apiClient.post<any, ApiResponse<Task>>('/tasks', data),

  update: (id: number, data: TaskUpdateData) =>
    apiClient.put<any, ApiResponse<Task>>(`/tasks/${id}`, data),

  updateStatus: (id: number, status: TaskStatus) =>
    apiClient.patch<any, ApiResponse<Task>>(`/tasks/${id}/status`, { status }),

  delete: (id: number) =>
    apiClient.delete<any, ApiResponse<null>>(`/tasks/${id}`),

  reorder: (ids: number[]) =>
    apiClient.put<any, ApiResponse<null>>('/tasks/reorder', { ids }),
};
