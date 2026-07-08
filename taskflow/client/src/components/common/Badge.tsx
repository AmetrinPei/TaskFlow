import type { TaskStatus, TaskPriority } from '../../types';
import { STATUS_MAP, PRIORITY_MAP } from '../../utils/constants';

interface StatusBadgeProps {
  status: TaskStatus;
  onClick?: () => void;
}

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const info = STATUS_MAP[status];
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.color} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
    >
      {info.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const info = PRIORITY_MAP[priority];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className={`w-2 h-2 rounded-full ${info.dot}`} />
      <span className={info.color}>{info.label}</span>
    </span>
  );
}
