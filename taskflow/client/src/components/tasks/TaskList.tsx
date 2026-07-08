import { useState, useCallback, useRef } from 'react';
import type { Task, TaskStatus } from '../../types';
import TaskItem from './TaskItem';
import TaskEmpty from './TaskEmpty';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: number, currentStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onCreateTask: () => void;
  hasFilters?: boolean;
  draggable?: boolean;
  onReorder?: (ids: number[]) => void;
}

export default function TaskList({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
  onCreateTask,
  hasFilters,
  draggable = false,
  onReorder,
}: TaskListProps) {
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const dragItemId = useRef<number | null>(null);

  const handleDragStart = useCallback((_e: React.DragEvent, id: number) => {
    dragItemId.current = id;
    _e.dataTransfer.effectAllowed = 'move';
    _e.dataTransfer.setData('text/plain', String(id));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== dragItemId.current) {
      setDragOverId(id);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragOverId(null);
    dragItemId.current = null;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const fromId = dragItemId.current;
      const toId = dragOverId;
      setDragOverId(null);
      dragItemId.current = null;

      if (fromId === null || toId === null || fromId === toId) return;

      const ids = tasks.map((t) => t.id);
      const fromIndex = ids.indexOf(fromId);
      const toIndex = ids.indexOf(toId);
      if (fromIndex === -1 || toIndex === -1) return;

      ids.splice(fromIndex, 1);
      ids.splice(toIndex, 0, fromId);
      onReorder?.(ids);
    },
    [tasks, dragOverId, onReorder]
  );

  if (tasks.length === 0) {
    return <TaskEmpty onCreateTask={onCreateTask} hasFilters={hasFilters} />;
  }

  return (
    <div
      className="space-y-3"
      onDragOver={draggable ? (e) => e.preventDefault() : undefined}
      onDrop={draggable ? handleDrop : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">共 {tasks.length} 个任务</span>
        {draggable && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            拖拽排序
          </span>
        )}
      </div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
          draggable={draggable}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          isDragOver={dragOverId === task.id}
        />
      ))}
    </div>
  );
}
