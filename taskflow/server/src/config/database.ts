import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '../../data/taskflow.db');

// 确保 data 目录存在
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db: DatabaseType = new Database(DB_PATH);

// 启用外键
db.pragma('foreign_keys = ON');

// 初始化表结构
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       VARCHAR(20) NOT NULL UNIQUE,
      is_builtin INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       VARCHAR(100) NOT NULL,
      description TEXT DEFAULT '',
      status      VARCHAR(20) NOT NULL DEFAULT 'TODO'
                    CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
      priority    VARCHAR(10) NOT NULL DEFAULT 'MEDIUM'
                    CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
      category_id INTEGER DEFAULT 1,
      due_date    DATE,
      sort_order  INTEGER NOT NULL DEFAULT 0,
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET DEFAULT
    );
  `);

  // 迁移：为已有表添加 sort_order 列（如果不存在）
  const columns = db.prepare("PRAGMA table_info('tasks')").all() as { name: string }[];
  if (!columns.some((col) => col.name === 'sort_order')) {
    db.exec(`ALTER TABLE tasks ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0`);
    db.exec(`UPDATE tasks SET sort_order = id`);
  }

  // 插入预置分类（仅在表为空时）
  const count = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (count.count === 0) {
    const insert = db.prepare('INSERT INTO categories (name, is_builtin) VALUES (?, 1)');
    insert.run('默认');
    insert.run('工作');
    insert.run('学习');
    insert.run('生活');
  }
}

initDatabase();
export default db;
