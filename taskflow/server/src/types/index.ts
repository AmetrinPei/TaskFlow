export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category_id: number;
  due_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category_name?: string;
}

export interface Category {
  id: number;
  name: string;
  is_builtin: number;
  created_at: string;
}

export interface TaskQueryParams {
  status?: TaskStatus;
  category_id?: number;
  priority?: TaskPriority;
  keyword?: string;
  sort_by?: 'created_at' | 'priority' | 'due_date';
  sort_order?: 'asc' | 'desc';
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

export interface TaskReorderData {
  ids: number[];
}
