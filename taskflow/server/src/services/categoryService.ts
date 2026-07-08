import db from '../config/database';
import { Category } from '../types';
import { AppError, ConflictError, NotFoundError } from '../utils/errors';

export const categoryService = {
  getAll(): Category[] {
    return db.prepare('SELECT * FROM categories ORDER BY id').all() as Category[];
  },

  getById(id: number): Category {
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as
      | Category
      | undefined;
    if (!category) throw new NotFoundError('分类');
    return category;
  },

  create(name: string): Category {
    const existing = db.prepare('SELECT id FROM categories WHERE name = ?').get(name);
    if (existing) throw new ConflictError('分类名称已存在');

    const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
    return db
      .prepare('SELECT * FROM categories WHERE id = ?')
      .get(result.lastInsertRowid) as Category;
  },

  update(id: number, name: string): Category {
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as
      | Category
      | undefined;
    if (!category) throw new NotFoundError('分类');

    const duplicate = db
      .prepare('SELECT id FROM categories WHERE name = ? AND id != ?')
      .get(name, id);
    if (duplicate) throw new ConflictError('分类名称已存在');

    db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name, id);
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category;
  },

  delete(id: number): void {
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as
      | Category
      | undefined;
    if (!category) throw new NotFoundError('分类');
    if (category.is_builtin) {
      throw new AppError(400, 'BUILTIN_ERROR', '预置分类不可删除');
    }

    // 将该分类下的任务移至"默认"分类（id=1）
    db.prepare('UPDATE tasks SET category_id = 1 WHERE category_id = ?').run(id);
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  },
};
