import db from '../config/database';
import { Task, TaskQueryParams, TaskCreateData, TaskUpdateData, TaskStatus } from '../types';
import { NotFoundError } from '../utils/errors';

export const taskService = {
  getAll(params: TaskQueryParams): Task[] {
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (params.status) {
      conditions.push('t.status = ?');
      values.push(params.status);
    }
    if (params.category_id) {
      conditions.push('t.category_id = ?');
      values.push(params.category_id);
    }
    if (params.priority) {
      conditions.push('t.priority = ?');
      values.push(params.priority);
    }
    if (params.keyword) {
      conditions.push('(t.title LIKE ? OR t.description LIKE ?)');
      values.push(`%${params.keyword}%`, `%${params.keyword}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sortBy = params.sort_by || 'created_at';
    const sortOrder = params.sort_order || 'desc';

    const orderClause =
      sortBy === 'priority'
        ? `ORDER BY CASE t.priority WHEN 'HIGH' THEN 3 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 1 END ${sortOrder}`
        : `ORDER BY t.${sortBy} ${sortOrder}`;

    const sql = `
      SELECT t.*, c.name as category_name
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      ${where}
      ${orderClause}
    `;

    return db.prepare(sql).all(...values) as Task[];
  },

  getById(id: number): Task {
    const task = db
      .prepare(
        `
      SELECT t.*, c.name as category_name
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `
      )
      .get(id) as Task | undefined;

    if (!task) throw new NotFoundError('任务');
    return task;
  },

  create(data: TaskCreateData): Task {
    const { title, description, priority, category_id, due_date } = data;

    const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) as max_order FROM tasks').get() as { max_order: number };
    const nextOrder = maxOrder.max_order + 1;

    const result = db
      .prepare(
        `
      INSERT INTO tasks (title, description, priority, category_id, due_date, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `
      )
      .run(
        title,
        description || '',
        priority || 'MEDIUM',
        category_id || 1,
        due_date || null,
        nextOrder
      );

    return this.getById(Number(result.lastInsertRowid));
  },

  update(id: number, data: TaskUpdateData): Task {
    this.getById(id);

    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }
    if (data.status !== undefined) {
      fields.push('status = ?');
      values.push(data.status);
    }
    if (data.priority !== undefined) {
      fields.push('priority = ?');
      values.push(data.priority);
    }
    if (data.category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(data.category_id);
    }
    if (data.due_date !== undefined) {
      fields.push('due_date = ?');
      values.push(data.due_date);
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    }

    return this.getById(id);
  },

  updateStatus(id: number, status: TaskStatus): Task {
    return this.update(id, { status });
  },

  delete(id: number): void {
    this.getById(id);
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  },

  reorder(ids: number[]): void {
    const updateStmt = db.prepare('UPDATE tasks SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const transaction = db.transaction((idList: number[]) => {
      idList.forEach((id, index) => {
        updateStmt.run(index + 1, id);
      });
    });
    transaction(ids);
  },
};
