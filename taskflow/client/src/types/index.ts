export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category_id: number;
  category_name: string;
  due_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  is_builtin: number;
  created_at: string;
}

export interface TaskCreateData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  category_id?: number;
  due_date?: string | null;
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category_id?: number;
  due_date?: string | null;
}

export interface TaskQueryParams {
  status?: TaskStatus;
  category_id?: number;
  priority?: TaskPriority;
  keyword?: string;
  sort_by?: 'created_at' | 'priority' | 'due_date' | 'sort_order';
  sort_order?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}

// 统计相关类型
export interface StatusCount {
  status: string;
  count: number;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface StatsOverview {
  total: number;
  by_status: StatusCount[];
  completion_rate: number;
  today_completed: number;
  overdue_count: number;
  by_category: CategoryCount[];
}
