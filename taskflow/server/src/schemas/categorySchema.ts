import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, '分类名不能为空').max(20, '分类名不能超过20个字符'),
});

export const updateCategorySchema = createCategorySchema.partial();
