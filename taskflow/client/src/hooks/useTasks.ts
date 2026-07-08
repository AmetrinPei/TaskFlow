import { useState, useCallback, useRef } from 'react';
import type { Task, TaskStatus, TaskCreateData, TaskUpdateData, TaskQueryParams } from '../types';
import { taskApi } from '../api/taskApi';
import { STATUS_MAP } from '../utils/constants';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  // 保存最近一次查询参数，以便写操作后刷新列表
  const lastParamsRef = useRef<TaskQueryParams | undefined>(undefined);

  const fetchTasks = useCallback(async (params?: TaskQueryParams) => {
    lastParamsRef.current = params;
    try {
      setLoading(true);
      const res = await taskApi.getAll(params);
      setTasks(res.data);
    } catch (error) {
      console.error('获取任务失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTasks = useCallback(() => {
    return fetchTasks(lastParamsRef.current);
  }, [fetchTasks]);

  const createTask = useCallback(async (data: TaskCreateData) => {
    const res = await taskApi.create(data);
    await refreshTasks();
    return res.data;
  }, [refreshTasks]);

  const updateTask = useCallback(async (id: number, data: TaskUpdateData) => {
    const res = await taskApi.update(id, data);
    await refreshTasks();
    return res.data;
  }, [refreshTasks]);

  const deleteTask = useCallback(async (id: number) => {
    await taskApi.delete(id);
    await refreshTasks();
  }, [refreshTasks]);

  const toggleStatus = useCallback(async (id: number, currentStatus: TaskStatus) => {
    const nextStatus = STATUS_MAP[currentStatus].next;
    const res = await taskApi.updateStatus(id, nextStatus);
    await refreshTasks();
    return { task: res.data, nextStatus };
  }, [refreshTasks]);

  const reorderTasks = useCallback(async (ids: number[]) => {
    // 乐观更新：先更新本地状态
    setTasks((prev) => {
      const taskMap = new Map(prev.map((t) => [t.id, t]));
      const reordered = ids.map((id) => taskMap.get(id)).filter((t): t is Task => !!t);
      const remaining = prev.filter((t) => !ids.includes(t.id));
      return [...reordered, ...remaining];
    });
    try {
      await taskApi.reorder(ids);
    } catch (error) {
      console.error('排序更新失败:', error);
      await refreshTasks();
    }
  }, [refreshTasks]);

  return {
    tasks,
    loading,
    fetchTasks,
    refreshTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleStatus,
    reorderTasks,
  };
}
