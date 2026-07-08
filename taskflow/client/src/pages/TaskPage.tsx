import { useState, useEffect } from 'react';
import type { Task, TaskStatus, TaskPriority, Category, TaskQueryParams } from '../types';
import { STATUS_MAP } from '../utils/constants';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../components/common/Toast';
import TaskList from '../components/tasks/TaskList';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskForm from '../components/tasks/TaskForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loading from '../components/common/Loading';

interface TaskPageProps {
  categories: Category[];
  activeStatus: TaskStatus | 'ALL';
  onStatusChange: (status: TaskStatus | 'ALL') => void;
  activeCategoryId: number | null;
  keyword: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export default function TaskPage({
  categories,
  activeStatus,
  onStatusChange,
  activeCategoryId,
  keyword,
  sortBy,
  sortOrder,
  onSortChange,
}: TaskPageProps) {
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, toggleStatus, reorderTasks } = useTasks();
  const { showToast } = useToast();

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  // Delete confirm state
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form loading state
  const [formLoading, setFormLoading] = useState(false);

  // 筛选条件变化时自动刷新任务列表
  useEffect(() => {
    const params: TaskQueryParams = {
      sort_by: sortBy as TaskQueryParams['sort_by'],
      sort_order: sortOrder,
    };
    if (activeStatus !== 'ALL') {
      params.status = activeStatus;
    }
    if (activeCategoryId !== null) {
      params.category_id = activeCategoryId;
    }
    if (keyword) {
      params.keyword = keyword;
    }
    fetchTasks(params);
  }, [activeStatus, activeCategoryId, keyword, sortBy, sortOrder, fetchTasks]);

  function handleCreateTask() {
    setFormMode('create');
    setEditingTask(undefined);
    setFormOpen(true);
  }

  function handleEditTask(task: Task) {
    setFormMode('edit');
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleFormSubmit(data: {
    title: string;
    description: string;
    priority: TaskPriority;
    category_id: number;
    due_date: string | null;
  }) {
    try {
      setFormLoading(true);
      if (formMode === 'create') {
        await createTask(data);
        showToast('success', '任务创建成功');
      } else if (editingTask) {
        await updateTask(editingTask.id, data);
        showToast('success', '任务更新成功');
      }
      setFormOpen(false);
    } catch (err: any) {
      showToast('error', err.message || '操作失败');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleToggleStatus(id: number, currentStatus: TaskStatus) {
    try {
      const { nextStatus } = await toggleStatus(id, currentStatus);
      showToast('success', `状态已切换为「${STATUS_MAP[nextStatus].label}」`);
    } catch (err: any) {
      showToast('error', err.message || '状态切换失败');
    }
  }

  async function handleDeleteConfirm() {
    if (deleteId !== null) {
      try {
        await deleteTask(deleteId);
        showToast('success', '任务已删除');
      } catch (err: any) {
        showToast('error', err.message || '删除失败');
      } finally {
        setDeleteId(null);
      }
    }
  }

  if (loading && tasks.length === 0) {
    return <Loading size="lg" text="加载任务中..." />;
  }

  const isManualSort = sortBy === 'sort_order';

  return (
    <div>
      <TaskFilters
        activeStatus={activeStatus}
        onStatusChange={onStatusChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
        onCreateTask={handleCreateTask}
      />

      <TaskList
        tasks={tasks}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEditTask}
        onDelete={(id) => setDeleteId(id)}
        onCreateTask={handleCreateTask}
        hasFilters={activeStatus !== 'ALL' || activeCategoryId !== null || !!keyword}
        draggable={isManualSort}
        onReorder={reorderTasks}
      />

      <TaskForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        mode={formMode}
        initialValues={editingTask}
        categories={categories}
        loading={formLoading}
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="确认删除"
        message="确定要删除这个任务吗？此操作不可撤销。"
        confirmText="删除"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
