import db from '../config/database';

interface StatusCount {
  status: string;
  count: number;
}

interface CategoryCount {
  name: string;
  count: number;
}

interface StatsOverview {
  total: number;
  by_status: StatusCount[];
  completion_rate: number;
  today_completed: number;
  overdue_count: number;
  by_category: CategoryCount[];
}

export const statsService = {
  getOverview(): StatsOverview {
    const total = (db.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number }).count;

    const by_status = db.prepare(
      'SELECT status, COUNT(*) as count FROM tasks GROUP BY status'
    ).all() as StatusCount[];

    const todayCompleted = (db.prepare(
      "SELECT COUNT(*) as count FROM tasks WHERE status = 'DONE' AND DATE(updated_at) = DATE('now', 'localtime')"
    ).get() as { count: number }).count;

    const overdue = (db.prepare(
      "SELECT COUNT(*) as count FROM tasks WHERE due_date < DATE('now', 'localtime') AND status != 'DONE'"
    ).get() as { count: number }).count;

    const by_category = db.prepare(`
      SELECT c.name, COUNT(t.id) as count
      FROM categories c
      LEFT JOIN tasks t ON t.category_id = c.id
      GROUP BY c.id
      ORDER BY count DESC
    `).all() as CategoryCount[];

    const doneCount = by_status.find((s) => s.status === 'DONE')?.count || 0;
    const completion_rate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    return {
      total,
      by_status,
      completion_rate,
      today_completed: todayCompleted,
      overdue_count: overdue,
      by_category,
    };
  },
};
