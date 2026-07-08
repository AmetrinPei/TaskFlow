import apiClient from './client';
import type { Category, ApiResponse } from '../types';

export const categoryApi = {
  getAll: () =>
    apiClient.get<any, ApiResponse<Category[]>>('/categories'),

  create: (name: string) =>
    apiClient.post<any, ApiResponse<Category>>('/categories', { name }),

  update: (id: number, name: string) =>
    apiClient.put<any, ApiResponse<Category>>(`/categories/${id}`, { name }),

  delete: (id: number) =>
    apiClient.delete<any, ApiResponse<null>>(`/categories/${id}`),
};
