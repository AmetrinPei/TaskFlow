import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符'),
  description: z.string().max(1000, '描述不能超过1000个字符').optional().default(''),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
  category_id: z.number().int().positive().optional().default(1),
  due_date: z.string().nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符').optional(),
  description: z.string().max(1000, '描述不能超过1000个字符').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  category_id: z.number().int().positive().optional(),
  due_date: z.string().nullable().optional(),
});

export const taskQuerySchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  category_id: z.coerce.number().int().positive().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  keyword: z.string().optional(),
  sort_by: z.enum(['created_at', 'priority', 'due_date', 'sort_order']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const reorderTaskSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, '至少需要一个任务ID'),
});
