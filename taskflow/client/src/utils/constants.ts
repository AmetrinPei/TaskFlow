import type { TaskStatus, TaskPriority } from '../types';

interface StatusInfo {
  label: string;
  color: string;
  next: TaskStatus;
}

interface PriorityInfo {
  label: string;
  color: string;
  dot: string;
}

export const STATUS_MAP: Record<TaskStatus, StatusInfo> = {
  TODO: { label: '待办', color: 'bg-blue-100 text-blue-800', next: 'IN_PROGRESS' },
  IN_PROGRESS: { label: '进行中', color: 'bg-yellow-100 text-yellow-800', next: 'DONE' },
  DONE: { label: '已完成', color: 'bg-green-100 text-green-800', next: 'TODO' },
};

export const PRIORITY_MAP: Record<TaskPriority, PriorityInfo> = {
  HIGH: { label: '高', color: 'text-red-500', dot: 'bg-red-500' },
  MEDIUM: { label: '中', color: 'text-orange-500', dot: 'bg-orange-500' },
  LOW: { label: '低', color: 'text-green-500', dot: 'bg-green-500' },
};

export const STATUS_OPTIONS: { value: TaskStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '全部' },
  { value: 'TODO', label: '待办' },
  { value: 'IN_PROGRESS', label: '进行中' },
  { value: 'DONE', label: '已完成' },
];

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'sort_order', label: '手动排序' },
  { value: 'created_at', label: '创建时间' },
  { value: 'priority', label: '优先级' },
  { value: 'due_date', label: '截止日期' },
];
