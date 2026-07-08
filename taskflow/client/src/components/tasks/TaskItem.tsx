import type { Task, TaskStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { getDueDateDisplay } from '../../utils/dateHelper';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: number, currentStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, id: number) => void;
  onDragOver?: (e: React.DragEvent, id: number) => void;
  onDragEnd?: () => void;
  isDragOver?: boolean;
}

export default function TaskItem({ task, onToggleStatus, onEdit, onDelete, draggable = false, onDragStart, onDragOver, onDragEnd, isDragOver = false }: TaskItemProps) {
  const isDone = task.status === 'DONE';
  const dueDateInfo = getDueDateDisplay(task.due_date, task.status);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow group ${isDone ? 'opacity-60' : ''} ${
        isDragOver ? 'border-t-2 border-t-primary' : ''
      }`}
      onDragOver={onDragOver ? (e) => onDragOver(e, task.id) : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: drag handle + priority dot + title + description */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {draggable && (
            <div
              className="mt-0.5 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors shrink-0"
              draggable
              onDragStart={(e) => onDragStart?.(e, task.id)}
              onDragEnd={onDragEnd}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="9" cy="5" r="1.5" />
                <circle cx="15" cy="5" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="9" cy="19" r="1.5" />
                <circle cx="15" cy="19" r="1.5" />
              </svg>
            </div>
          )}
          <div className="mt-1.5">
            <PriorityBadge priority={task.priority} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-sm font-medium text-gray-900 truncate ${isDone ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {task.category_name}
              </span>
              {dueDateInfo && (
                <span className={`inline-flex items-center gap-1 text-xs ${dueDateInfo.className}`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {dueDateInfo.text}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: status badge + action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge
            status={task.status}
            onClick={() => onToggleStatus(task.id, task.status)}
          />
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-md transition-colors"
              title="编辑"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-md transition-colors"
              title="删除"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
