import dayjs from 'dayjs';
import type { TaskStatus } from '../types';

/**
 * 根据截止日期和任务状态，返回显示文本和样式类名。
 * 规则：
 *  - dueDate 为空 → 返回 null（不显示）
 *  - 已完成任务 → 灰色正常显示，不标记过期
 *  - 已过期（diff < 0）且未完成 → 红色 + "（已过期）"
 *  - 0 ≤ diff ≤ 7 天（即将到期）→ 橙色
 *  - diff > 7 天 → 灰色
 */
export function getDueDateDisplay(dueDate: string | null, status: TaskStatus) {
  if (!dueDate) return null;
  if (status === 'DONE') return { text: dueDate, className: 'text-gray-400' };

  const today = dayjs().startOf('day');
  const due = dayjs(dueDate);
  const diff = due.diff(today, 'day');

  if (diff < 0) return { text: `${dueDate}（已过期）`, className: 'text-red-500 font-semibold' };
  if (diff <= 7) return { text: dueDate, className: 'text-orange-500 font-medium' };
  return { text: dueDate, className: 'text-gray-500' };
}
