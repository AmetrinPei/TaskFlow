# TaskFlow — 个人任务管理系统 项目实施计划

> 版本：v1.0  
> 最后更新：2026-07-07  
> 配套文档：[PRD 需求文档](./PRD.md)  
> 技术栈：React + TypeScript + Vite ｜ Node.js + Express + TypeScript ｜ SQLite ｜ Tailwind CSS

---

## 目录

1. [项目架构设计](#1-项目架构设计)
2. [技术选型与依赖清单](#2-技术选型与依赖清单)
3. [项目目录结构](#3-项目目录结构)
4. [阶段一：项目初始化与基础搭建](#4-阶段一项目初始化与基础搭建)
5. [阶段二：后端核心开发](#5-阶段二后端核心开发)
6. [阶段三：前端核心开发](#6-阶段三前端核心开发)
7. [阶段四：前后端联调](#7-阶段四前后端联调)
8. [阶段五：统计面板与数据可视化](#8-阶段五统计面板与数据可视化)
9. [阶段六：优化、测试与部署](#9-阶段六优化测试与部署)
10. [测试策略](#10-测试策略)
11. [部署方案](#11-部署方案)
12. [风险识别与应对](#12-风险识别与应对)
13. [开发规范](#13-开发规范)
14. [附录：每日开发任务分解](#14-附录每日开发任务分解)

---

## 1. 项目架构设计

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                             │
│                  （React + Tailwind CSS）                     │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTP (RESTful API)
                           │  JSON
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Express 应用服务器                        │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────────┐     │
│  │  路由层    │→│  控制器层      │→│  服务层（业务逻辑） │     │
│  │  Routes   │  │  Controllers │  │  Services         │     │
│  └───────────┘  └──────────────┘  └────────┬─────────┘     │
│                                             │               │
│  ┌──────────────────────────────────────────┐│              │
│  │  中间件：CORS / 错误处理 / 请求校验       ││              │
│  └──────────────────────────────────────────┘│              │
└──────────────────────────────────────────────│──────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    SQLite 数据库文件                          │
│              （better-sqlite3 驱动，文件存储）                 │
│              ┌────────────┐  ┌────────────┐                 │
│              │  tasks 表  │  │categories表│                 │
│              └────────────┘  └────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 分层职责说明

| 层级 | 职责 | 说明 |
|------|------|------|
| **路由层 (Routes)** | 定义 URL 与处理函数的映射 | 只做路径分发，不含业务逻辑 |
| **控制器层 (Controllers)** | 解析请求参数，调用服务层，格式化响应 | 负责"接"和"回"，不含复杂逻辑 |
| **服务层 (Services)** | 核心业务逻辑与数据库操作 | 所有增删改查、数据校验在此完成 |
| **中间件 (Middleware)** | 通用处理：跨域、错误捕获、参数校验 | 可插拔，与业务解耦 |
| **数据层 (Database)** | 数据库连接、建表、SQL 执行 | 使用 better-sqlite3 同步 API |

### 1.3 前后端通信协议

- **协议**：HTTP + JSON
- **风格**：RESTful
- **基础路径**：`/api`
- **跨域**：开发环境通过 Vite proxy 代理；生产环境通过 CORS 中间件
- **统一响应格式**：

```json
// 成功
{ "success": true, "data": { ... } }

// 失败
{ "success": false, "error": { "code": "ERROR_CODE", "message": "描述" } }
```

---

## 2. 技术选型与依赖清单

### 2.1 后端依赖

| 包名 | 版本 | 用途 | 选型理由 |
|------|------|------|----------|
| `express` | ^4.18 | Web 框架 | 生态成熟，学习资源丰富 |
| `better-sqlite3` | ^11.0 | SQLite 驱动 | 同步 API，性能优秀，适合小型应用 |
| `cors` | ^2.8 | 跨域处理 | 开发/生产环境均需 |
| `zod` | ^3.23 | 请求参数校验 | TypeScript 友好，类型推导 |
| `tsx` | ^4.0 | TypeScript 运行 | 开发阶段无需编译，直接运行 TS |
| `typescript` | ^5.5 | 类型系统 | 类型安全 |
| `@types/express` | ^4.17 | 类型定义 | Express 的 TS 类型 |
| `@types/cors` | ^2.8 | 类型定义 | CORS 的 TS 类型 |
| `@types/better-sqlite3` | ^7.6 | 类型定义 | better-sqlite3 的 TS 类型 |

### 2.2 前端依赖

| 包名 | 版本 | 用途 | 选型理由 |
|------|------|------|----------|
| `react` | ^18.3 | UI 框架 | 主流框架，社区庞大 |
| `react-dom` | ^18.3 | DOM 渲染 | React 的 DOM 渲染器 |
| `react-router-dom` | ^6.25 | 路由管理 | 官方推荐的路由方案 |
| `axios` | ^1.7 | HTTP 客户端 | 拦截器、错误处理便捷 |
| `tailwindcss` | ^3.4 | CSS 框架 | 原子化 CSS，开发效率高 |
| `@headlessui/react` | ^2.1 | 无样式组件库 | 模态框、下拉等交互组件 |
| `recharts` | ^2.13 | 图表库 | 基于 React 的声明式图表 |
| `dayjs` | ^1.11 | 日期处理 | 轻量级日期库（2KB） |
| `vite` | ^5.4 | 构建工具 | 极速开发服务器 |
| `@vitejs/plugin-react` | ^4.3 | React 插件 | Vite 的 React 支持 |
| `autoprefixer` | ^10.4 | CSS 兼容 | Tailwind 依赖 |
| `postcss` | ^8.4 | CSS 处理 | Tailwind 依赖 |

### 2.3 开发工具依赖

| 包名 | 用途 |
|------|------|
| `eslint` | 代码检查 |
| `@typescript-eslint/parser` | TS 语法解析 |
| `@typescript-eslint/eslint-plugin` | TS 规则集 |
| `prettier` | 代码格式化 |
| `concurrently` | 同时启动前后端开发服务 |

---

## 3. 项目目录结构

### 3.1 总体结构（Monorepo）

```
taskflow/
├── client/                    # 前端项目（React + Vite）
├── server/                    # 后端项目（Express + TS）
├── package.json               # 根 package.json（脚本入口）
├── .gitignore
└── README.md
```

> 采用 **Monorepo** 结构（单仓库管理前后端），降低新手管理多个仓库的认知负担。

### 3.2 后端目录结构

```
server/
├── src/
│   ├── index.ts               # 应用入口，启动 Express 服务
│   ├── app.ts                 # Express 应用配置（中间件注册）
│   ├── config/
│   │   └── database.ts        # 数据库连接与初始化
│   ├── middleware/
│   │   ├── errorHandler.ts    # 全局错误处理中间件
│   │   ├── validate.ts        # 请求参数校验中间件
│   │   └── cors.ts            # CORS 配置
│   ├── routes/
│   │   ├── index.ts           # 路由汇总注册
│   │   ├── taskRoutes.ts      # 任务相关路由
│   │   └── categoryRoutes.ts  # 分类相关路由
│   ├── controllers/
│   │   ├── taskController.ts  # 任务控制器
│   │   ├── categoryController.ts # 分类控制器
│   │   └── statsController.ts # 统计控制器
│   ├── services/
│   │   ├── taskService.ts     # 任务业务逻辑
│   │   ├── categoryService.ts # 分类业务逻辑
│   │   └── statsService.ts    # 统计业务逻辑
│   ├── schemas/
│   │   ├── taskSchema.ts      # 任务参数校验 Schema (zod)
│   │   └── categorySchema.ts  # 分类参数校验 Schema (zod)
│   ├── types/
│   │   └── index.ts           # 全局类型定义（Task, Category 等）
│   └── utils/
│       ├── response.ts        # 统一响应格式工具函数
│       └── errors.ts          # 自定义错误类
├── data/                      # SQLite 数据库文件目录
│   └── taskflow.db            # 数据库文件（自动生成）
├── tsconfig.json
└── package.json
```

### 3.3 前端目录结构

```
client/
├── src/
│   ├── main.tsx               # 应用入口
│   ├── App.tsx                # 根组件（路由配置）
│   ├── index.css              # 全局样式 + Tailwind 指令
│   ├── api/
│   │   ├── client.ts          # Axios 实例配置
│   │   ├── taskApi.ts         # 任务相关 API 调用
│   │   ├── categoryApi.ts     # 分类相关 API 调用
│   │   └── statsApi.ts        # 统计相关 API 调用
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx     # 顶部导航栏
│   │   │   ├── Sidebar.tsx    # 侧边栏
│   │   │   └── Layout.tsx     # 整体布局容器
│   │   ├── tasks/
│   │   │   ├── TaskList.tsx   # 任务列表组件
│   │   │   ├── TaskItem.tsx   # 单条任务卡片
│   │   │   ├── TaskForm.tsx   # 创建/编辑任务表单（模态框内）
│   │   │   ├── TaskFilters.tsx # 筛选工具栏
│   │   │   └── TaskEmpty.tsx  # 空状态组件
│   │   ├── categories/
│   │   │   ├── CategoryList.tsx   # 分类列表
│   │   │   └── CategoryForm.tsx   # 分类创建/编辑表单
│   │   ├── stats/
│   │   │   ├── StatsOverview.tsx  # 统计概览卡片
│   │   │   ├── StatusChart.tsx    # 状态分布图
│   │   │   └── CategoryChart.tsx  # 分类分布图
│   │   └── common/
│   │       ├── Modal.tsx      # 通用模态框
│   │       ├── Toast.tsx      # Toast 提示
│   │       ├── ConfirmDialog.tsx # 确认对话框
│   │       ├── Loading.tsx    # 加载状态
│   │       └── Badge.tsx      # 状态/优先级徽章
│   ├── pages/
│   │   ├── TaskPage.tsx       # 任务列表页（首页）
│   │   └── StatsPage.tsx      # 统计面板页
│   ├── hooks/
│   │   ├── useTasks.ts        # 任务数据 Hook
│   │   ├── useCategories.ts   # 分类数据 Hook
│   │   ├── useStats.ts        # 统计数据 Hook
│   │   └── useToast.ts        # Toast 通知 Hook
│   ├── store/
│   │   └── taskStore.ts       # 全局状态管理（React Context）
│   ├── types/
│   │   └── index.ts           # 前端类型定义（与后端对齐）
│   ├── utils/
│   │   ├── constants.ts       # 常量定义（状态、优先级映射等）
│   │   ├── dateHelper.ts      # 日期工具函数
│   │   └── helpers.ts         # 通用工具函数
│   └── vite-env.d.ts
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 4. 阶段一：项目初始化与基础搭建

> 目标：完成项目脚手架、数据库初始化、Express 基础框架  
> 建议耗时：1 天

### Task 1.1 — 初始化项目结构

**具体操作**：

1. 创建根目录 `taskflow/`，初始化 `package.json`
2. 使用 `npm create vite@latest client -- --template react-ts` 创建前端项目
3. 手动创建 `server/` 目录，初始化后端 `package.json`
4. 配置根 `package.json` 的 scripts，实现一键启动前后端

**关键配置文件**：

```jsonc
// 根 package.json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev"
  }
}
```

```jsonc
// server/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

### Task 1.2 — 配置 Tailwind CSS

**具体操作**：

1. 安装 `tailwindcss`、`postcss`、`autoprefixer`
2. 运行 `npx tailwindcss init -p` 生成配置文件
3. 配置 `tailwind.config.js` 的 `content` 路径
4. 在 `index.css` 中添加 Tailwind 指令

```js
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
};
```

### Task 1.3 — 数据库初始化模块

**具体操作**：

1. 创建 `server/src/config/database.ts`
2. 实现数据库连接（使用 better-sqlite3）
3. 编写建表 SQL（categories 表 + tasks 表）
4. 插入预置分类数据
5. 启用外键约束（`PRAGMA foreign_keys = ON`）

**核心逻辑**：

```typescript
// server/src/config/database.ts
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../data/taskflow.db');

// 确保 data 目录存在
import fs from 'fs';
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

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
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET DEFAULT
    );
  `);

  // 插入预置分类（仅在表为空时）
  const count = db.prepare('SELECT COUNT(*) as count FROM categories').get() as any;
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
```

### Task 1.4 — Express 基础框架

**具体操作**：

1. 创建 `app.ts`：配置中间件（JSON 解析、CORS、静态文件）
2. 创建 `index.ts`：启动服务器，监听端口
3. 创建全局错误处理中间件
4. 创建统一响应工具函数
5. 创建自定义错误类

**关键文件**：

```typescript
// server/src/app.ts
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { registerRoutes } from './routes';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 注册路由
registerRoutes(app);

// 全局错误处理（必须放在路由之后）
app.use(errorHandler);

export default app;
```

```typescript
// server/src/index.ts
import app from './app';
import './config/database'; // 初始化数据库

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 TaskFlow Server running on http://localhost:${PORT}`);
});
```

```typescript
// server/src/utils/response.ts
export function successResponse(data: any, message?: string) {
  return { success: true, data, ...(message && { message }) };
}

export function listResponse(data: any[], total: number) {
  return { success: true, data, total };
}
```

```typescript
// server/src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource}不存在`);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'VALIDATION_ERROR', message);
  }
}
```

### Task 1.5 — Vite 代理配置

```typescript
// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### Task 1.6 — 阶段验证

| 验证项 | 验证方法 | 预期结果 |
|--------|----------|----------|
| 后端启动 | `npm run dev:server` | 控制台输出 "Server running on :3001" |
| 数据库初始化 | 检查 `server/data/taskflow.db` | 文件存在，包含 categories 和 tasks 表 |
| 预置数据 | 查询 categories 表 | 包含"默认、工作、学习、生活"4 条记录 |
| 前端启动 | `npm run dev:client` | 浏览器打开 `localhost:5173` 显示 Vite 默认页面 |
| 代理生效 | 前端请求 `/api/health` | 请求转发到后端 3001 端口 |

---

## 5. 阶段二：后端核心开发

> 目标：完成所有 RESTful API 接口  
> 建议耗时：2 天

### Task 2.1 — 类型定义

```typescript
// server/src/types/index.ts
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category_id: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  // 联表查询时附带
  category_name?: string;
}

export interface Category {
  id: number;
  name: string;
  is_builtin: number;
  created_at: string;
}

export interface TaskQueryParams {
  status?: TaskStatus;
  category_id?: number;
  priority?: TaskPriority;
  keyword?: string;
  sort_by?: 'created_at' | 'priority' | 'due_date';
  sort_order?: 'asc' | 'desc';
}
```

### Task 2.2 — 参数校验 Schema

```typescript
// server/src/schemas/taskSchema.ts
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符'),
  description: z.string().max(1000, '描述不能超过1000个字符').optional().default(''),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
  category_id: z.number().int().positive().optional().default(1),
  due_date: z.string().nullable().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskQuerySchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  category_id: z.coerce.number().int().positive().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  keyword: z.string().optional(),
  sort_by: z.enum(['created_at', 'priority', 'due_date']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});
```

```typescript
// server/src/schemas/categorySchema.ts
import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, '分类名不能为空').max(20, '分类名不能超过20个字符'),
});

export const updateCategorySchema = createCategorySchema.partial();
```

### Task 2.3 — 校验中间件

```typescript
// server/src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema, source: 'body' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(source === 'body' ? req.body : req.query);
    if (!result.success) {
      const message = result.error.errors.map(e => e.message).join('; ');
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message },
      });
    }
    req[source] = result.data;
    next();
  };
}
```

### Task 2.4 — 分类 CRUD 接口

**开发顺序**：先做分类（因为任务依赖分类外键）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取所有分类 | GET | `/api/categories` | 返回全部分类列表 |
| 创建分类 | POST | `/api/categories` | 名称不可重复 |
| 更新分类 | PUT | `/api/categories/:id` | 预置分类可改名 |
| 删除分类 | DELETE | `/api/categories/:id` | 预置分类不可删除；关联任务移至"默认" |

**Service 层核心逻辑**：

```typescript
// server/src/services/categoryService.ts
import db from '../config/database';
import { Category } from '../types';
import { AppError, NotFoundError } from '../utils/errors';

export const categoryService = {
  getAll(): Category[] {
    return db.prepare('SELECT * FROM categories ORDER BY id').all() as Category[];
  },

  create(name: string): Category {
    // 检查重名
    const existing = db.prepare('SELECT id FROM categories WHERE name = ?').get(name);
    if (existing) throw new AppError(409, 'DUPLICATE', '分类名称已存在');

    const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid) as Category;
  },

  update(id: number, name: string): Category {
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | undefined;
    if (!category) throw new NotFoundError('分类');

    // 检查重名（排除自身）
    const duplicate = db.prepare('SELECT id FROM categories WHERE name = ? AND id != ?').get(name, id);
    if (duplicate) throw new AppError(409, 'DUPLICATE', '分类名称已存在');

    db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name, id);
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category;
  },

  delete(id: number): void {
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | undefined;
    if (!category) throw new NotFoundError('分类');
    if (category.is_builtin) throw new AppError(400, 'BUILTIN_ERROR', '预置分类不可删除');

    // 将该分类下的任务移至"默认"分类（id=1）
    db.prepare('UPDATE tasks SET category_id = 1 WHERE category_id = ?').run(id);
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  },
};
```

### Task 2.5 — 任务 CRUD 接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取任务列表 | GET | `/api/tasks` | 支持筛选、排序、搜索 |
| 获取任务详情 | GET | `/api/tasks/:id` | 返回单个任务 + 分类名 |
| 创建任务 | POST | `/api/tasks` | 默认状态 TODO |
| 更新任务 | PUT | `/api/tasks/:id` | 可修改任意字段 |
| 切换状态 | PATCH | `/api/tasks/:id/status` | 快捷状态切换 |
| 删除任务 | DELETE | `/api/tasks/:id` | 直接删除 |

**Service 层核心逻辑**：

```typescript
// server/src/services/taskService.ts
import db from '../config/database';
import { Task, TaskQueryParams } from '../types';
import { NotFoundError } from '../utils/errors';

export const taskService = {
  getAll(params: TaskQueryParams): Task[] {
    const conditions: string[] = [];
    const values: any[] = [];

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
      conditions.push('t.title LIKE ?');
      values.push(`%${params.keyword}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sortBy = params.sort_by || 'created_at';
    const sortOrder = params.sort_order || 'desc';

    // 优先级排序需要自定义顺序
    const orderClause = sortBy === 'priority'
      ? `ORDER BY CASE t.priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 3 END ${sortOrder}`
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
    const task = db.prepare(`
      SELECT t.*, c.name as category_name
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(id) as Task | undefined;

    if (!task) throw new NotFoundError('任务');
    return task;
  },

  create(data: Partial<Task>): Task {
    const { title, description, priority, category_id, due_date } = data;
    const result = db.prepare(`
      INSERT INTO tasks (title, description, priority, category_id, due_date)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, description || '', priority || 'MEDIUM', category_id || 1, due_date || null);

    return this.getById(Number(result.lastInsertRowid));
  },

  update(id: number, data: Partial<Task>): Task {
    this.getById(id); // 确认存在

    const fields: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.priority !== undefined) { fields.push('priority = ?'); values.push(data.priority); }
    if (data.category_id !== undefined) { fields.push('category_id = ?'); values.push(data.category_id); }
    if (data.due_date !== undefined) { fields.push('due_date = ?'); values.push(data.due_date); }

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
    this.getById(id); // 确认存在
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  },
};
```

### Task 2.6 — 路由注册

```typescript
// server/src/routes/index.ts
import { Express } from 'express';
import { taskRoutes } from './taskRoutes';
import { categoryRoutes } from './categoryRoutes';
import { statsRoutes } from './statsRoutes';

export function registerRoutes(app: Express) {
  app.use('/api/tasks', taskRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/stats', statsRoutes);
}
```

### Task 2.7 — 阶段验证

| 验证项 | 验证方法 | 预期结果 |
|--------|----------|----------|
| 分类列表 | `GET /api/categories` | 返回 4 个预置分类 |
| 创建分类 | `POST /api/categories` body: `{"name":"阅读"}` | 返回新分类，id=5 |
| 重名检测 | 再次 POST `{"name":"阅读"}` | 返回 409 错误 |
| 创建任务 | `POST /api/tasks` body: `{"title":"测试任务"}` | 返回新任务，status=TODO |
| 筛选查询 | `GET /api/tasks?status=TODO` | 只返回待办任务 |
| 状态切换 | `PATCH /api/tasks/1/status` body: `{"status":"IN_PROGRESS"}` | 状态更新成功 |
| 删除分类 | `DELETE /api/categories/1` | 返回 400 错误（预置不可删） |

---

## 6. 阶段三：前端核心开发

> 目标：完成页面布局、任务列表、创建/编辑模态框  
> 建议耗时：2 天

### Task 3.1 — 全局类型与常量定义

```typescript
// client/src/types/index.ts
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category_id: number;
  category_name: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  is_builtin: number;
  created_at: string;
}
```

```typescript
// client/src/utils/constants.ts
export const STATUS_MAP = {
  TODO: { label: '待办', color: 'bg-blue-100 text-blue-800', next: 'IN_PROGRESS' },
  IN_PROGRESS: { label: '进行中', color: 'bg-yellow-100 text-yellow-800', next: 'DONE' },
  DONE: { label: '已完成', color: 'bg-green-100 text-green-800', next: 'TODO' },
};

export const PRIORITY_MAP = {
  HIGH: { label: '高', color: 'text-red-500', dot: 'bg-red-500' },
  MEDIUM: { label: '中', color: 'text-orange-500', dot: 'bg-orange-500' },
  LOW: { label: '低', color: 'text-green-500', dot: 'bg-green-500' },
};
```

### Task 3.2 — Axios 封装与 API 模块

```typescript
// client/src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 响应拦截器：统一错误处理
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error?.message || '网络请求失败';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
```

```typescript
// client/src/api/taskApi.ts
import apiClient from './client';

export const taskApi = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get('/tasks', { params }),

  getById: (id: number) =>
    apiClient.get(`/tasks/${id}`),

  create: (data: any) =>
    apiClient.post('/tasks', data),

  update: (id: number, data: any) =>
    apiClient.put(`/tasks/${id}`, data),

  updateStatus: (id: number, status: string) =>
    apiClient.patch(`/tasks/${id}/status`, { status }),

  delete: (id: number) =>
    apiClient.delete(`/tasks/${id}`),
};
```

### Task 3.3 — 全局状态管理（React Context）

```typescript
// client/src/store/taskStore.ts
// 使用 React Context + useReducer 管理全局状态
// 包含：tasks 列表、categories 列表、筛选条件、加载状态

interface TaskState {
  tasks: Task[];
  categories: Category[];
  filters: {
    status: TaskStatus | 'ALL';
    category_id: number | null;
    keyword: string;
    sort_by: string;
    sort_order: 'asc' | 'desc';
  };
  loading: boolean;
}

// Action 类型：SET_TASKS, SET_CATEGORIES, SET_FILTERS, SET_LOADING
// 提供 TaskProvider 和 useTaskContext Hook
```

### Task 3.4 — 布局组件

**Header 顶部导航栏**：
- 左侧：Logo + "TaskFlow" 标题
- 中间：搜索框（带防抖）
- 右侧：统计面板入口按钮

**Sidebar 侧边栏**：
- 状态筛选区：全部 / 待办 / 进行中 / 已完成
- 分类列表区：显示所有分类 + 点击筛选
- 底部："+ 新建分类"按钮

**Layout 布局容器**：
- 桌面端：左侧固定 240px 侧边栏 + 右侧自适应主内容区
- 平板端：侧边栏隐藏，通过汉堡菜单展开

### Task 3.5 — 任务列表组件

**TaskList**：
- 遍历 tasks 数组，渲染 TaskItem 列表
- 支持空状态展示（TaskEmpty 组件）
- 列表顶部显示任务总数

**TaskItem**（单条任务卡片）：

```
┌─────────────────────────────────────────────────────┐
│  ● 任务标题               🔵待办  [→] [编辑] [删除]  │
│    📁 工作  |  📅 2026-07-10                        │
└─────────────────────────────────────────────────────┘
```

- 左侧：优先级圆点 + 标题
- 右侧上排：状态徽章（可点击循环切换）+ 操作按钮
- 右侧下排：分类名 + 截止日期（根据过期规则变色）
- 已完成任务：标题加删除线，整体透明度降低

**TaskFilters 筛选工具栏**：
- 状态 Tab 切换
- 分类下拉选择
- 排序方式选择
- "+ 新建任务"按钮（醒目样式）

### Task 3.6 — 创建/编辑任务模态框（TaskForm）

- 复用同一组件，通过 `mode: 'create' | 'edit'` 区分
- 编辑模式自动预填数据
- 表单字段：标题（必填）、描述、分类（下拉）、优先级（单选）、截止日期（日期选择器）
- 提交时进行前端校验
- 提交按钮显示 Loading 状态
- 成功后关闭模态框 + 刷新列表 + 显示 Toast

### Task 3.7 — 删除确认对话框（ConfirmDialog）

- 通用组件，接受 `title`、`message`、`onConfirm`、`onCancel`
- 确认按钮为红色
- 支持 Esc 键关闭

### Task 3.8 — Toast 通知组件

- 支持 `success`、`error`、`info` 三种类型
- 自动 3 秒后消失
- 从屏幕右上角滑入
- 支持同时显示多条

### Task 3.9 — 阶段验证

| 验证项 | 验证方法 | 预期结果 |
|--------|----------|----------|
| 布局展示 | 打开首页 | 侧边栏 + 顶部导航 + 主内容区正确布局 |
| 空状态 | 无任务时查看列表 | 显示空状态插图和引导文案 |
| 创建任务 | 点击"+ 新建任务"，填写表单 | 模态框弹出，表单可正常填写和提交 |
| 列表渲染 | 创建几条任务后 | 任务列表正确显示所有信息 |
| 状态切换 | 点击任务的状态徽章 | 状态循环切换，颜色即时变化 |
| 筛选功能 | 切换状态/分类筛选 | 列表即时过滤 |
| 编辑任务 | 点击编辑按钮 | 模态框预填数据，修改后保存成功 |
| 删除任务 | 点击删除按钮 | 弹出确认框，确认后任务消失 |

---

## 7. 阶段四：前后端联调

> 目标：打通前后端数据流，实现完整业务闭环  
> 建议耗时：1 天

### Task 4.1 — 自定义 Hooks 对接 API

```typescript
// client/src/hooks/useTasks.ts
// 封装任务数据的获取、创建、更新、删除逻辑
// 内部管理 loading 和 error 状态
// 提供 refreshTasks() 方法供外部调用刷新

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async (filters?: any) => { ... };
  const createTask = async (data: any) => { ... };
  const updateTask = async (id: number, data: any) => { ... };
  const deleteTask = async (id: number) => { ... };
  const toggleStatus = async (id: number, currentStatus: TaskStatus) => { ... };

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, toggleStatus };
}
```

### Task 4.2 — 搜索防抖实现

```typescript
// client/src/utils/helpers.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 在 TaskFilters 中使用
const debouncedKeyword = useDebounce(keyword, 300);
useEffect(() => { fetchTasks({ ...filters, keyword: debouncedKeyword }); }, [debouncedKeyword]);
```

### Task 4.3 — 截止日期视觉提醒逻辑

```typescript
// client/src/utils/dateHelper.ts
import dayjs from 'dayjs';

export function getDueDateStatus(dueDate: string | null, taskStatus: TaskStatus) {
  if (!dueDate || taskStatus === 'DONE') return { text: dueDate, className: 'text-gray-500' };

  const today = dayjs().startOf('day');
  const due = dayjs(dueDate);
  const diff = due.diff(today, 'day');

  if (diff < 0) return { text: `${dueDate}（已过期）`, className: 'text-red-500 font-semibold' };
  if (diff <= 7) return { text: dueDate, className: 'text-orange-500 font-medium' };
  return { text: dueDate, className: 'text-gray-500' };
}
```

### Task 4.4 — 分类管理页面联调

- 侧边栏分类列表对接 `GET /api/categories`
- 新建分类弹窗对接 `POST /api/categories`
- 编辑分类对接 `PUT /api/categories/:id`
- 删除分类对接 `DELETE /api/categories/:id`（显示受影响任务数量）

### Task 4.5 — 端到端流程验证

| 完整场景 | 操作步骤 | 预期结果 |
|----------|----------|----------|
| 创建→查看 | 创建任务"完成PRD文档"，分类"工作"，优先级"高" | 任务出现在列表顶部 |
| 状态流转 | 点击该任务状态徽章，从待办→进行中→已完成 | 状态标签颜色依次变化 |
| 筛选验证 | 筛选"已完成"状态 | 只看到刚才完成的任务 |
| 编辑验证 | 编辑任务，修改优先级为"低" | 列表中优先级图标即时更新 |
| 分类联动 | 删除"工作"分类 | 提示有 N 个任务将移至"默认"，确认后任务分类变更 |
| 搜索验证 | 搜索关键词"PRD" | 列表只显示匹配任务 |
| 过期提醒 | 创建一个截止日期为昨天的任务 | 显示红色"已过期"标记 |

---

## 8. 阶段五：统计面板与数据可视化

> 目标：完成后端统计接口 + 前端图表展示  
> 建议耗时：1 天

### Task 5.1 — 后端统计接口

```typescript
// server/src/services/statsService.ts
export const statsService = {
  getOverview() {
    const total = db.prepare('SELECT COUNT(*) as count FROM tasks').get() as any;
    const byStatus = db.prepare(`
      SELECT status, COUNT(*) as count FROM tasks GROUP BY status
    `).all();
    const todayCompleted = db.prepare(`
      SELECT COUNT(*) as count FROM tasks
      WHERE status = 'DONE' AND DATE(updated_at) = DATE('now')
    `).get() as any;
    const overdue = db.prepare(`
      SELECT COUNT(*) as count FROM tasks
      WHERE due_date < DATE('now') AND status != 'DONE'
    `).get() as any;
    const byCategory = db.prepare(`
      SELECT c.name, COUNT(t.id) as count
      FROM categories c
      LEFT JOIN tasks t ON t.category_id = c.id
      GROUP BY c.id
      ORDER BY count DESC
    `).all();

    return {
      total: total.count,
      by_status: byStatus,
      completion_rate: total.count > 0
        ? Math.round((byStatus.find((s: any) => s.status === 'DONE')?.count || 0) / total.count * 100)
        : 0,
      today_completed: todayCompleted.count,
      overdue_count: overdue.count,
      by_category: byCategory,
    };
  },
};
```

### Task 5.2 — 前端统计面板页面

**StatsOverview（概览卡片）**：
- 4 个数字卡片横排：总数、待办、进行中、已完成
- 下方 3 个小卡片：完成率、逾期数、今日完成
- 数字使用大号字体，配合颜色区分

**StatusChart（状态分布图）**：
- 使用 Recharts 的 PieChart 绘制环形图
- 三种状态用不同颜色区分
- 中间显示完成率百分比

**CategoryChart（分类分布图）**：
- 使用 Recharts 的 BarChart 绘制水平柱状图
- 每个分类用不同颜色
- 显示具体数值

### Task 5.3 — 路由配置

```typescript
// client/src/App.tsx
// / → TaskPage（任务列表页）
// /stats → StatsPage（统计面板页）
```

### Task 5.4 — 阶段验证

| 验证项 | 验证方法 | 预期结果 |
|--------|----------|----------|
| 统计接口 | `GET /api/stats` | 返回正确的统计数据 |
| 概览卡片 | 进入统计面板 | 数字与实际任务数一致 |
| 环形图 | 查看状态分布 | 三种状态比例正确 |
| 柱状图 | 查看分类分布 | 各分类数量正确 |
| 空数据 | 删除所有任务后查看 | 显示"暂无数据"提示 |
| 实时性 | 创建新任务后返回统计页 | 数据已更新 |

---

## 9. 阶段六：优化、测试与部署

> 目标：提升用户体验，修复 Bug，部署上线  
> 建议耗时：1 天

### Task 6.1 — 响应式适配

| 断点 | 调整内容 |
|------|----------|
| `≥1024px` | 侧边栏固定显示，主内容区自适应 |
| `768px ~ 1023px` | 侧边栏隐藏，顶部导航增加汉堡菜单按钮，点击展开侧边栏（覆盖层） |
| `<768px` | 不做专门适配，提示用户使用更大屏幕（v1.0 范围） |

### Task 6.2 — 交互细节打磨

- [ ] 所有操作按钮增加 Loading 状态，防止重复提交
- [ ] 表单校验错误信息直接显示在字段下方（红色文字）
- [ ] 列表项增加 hover 效果和操作按钮渐显
- [ ] 模态框支持 Esc 关闭 + 点击遮罩关闭
- [ ] 删除任务后显示"撤销"按钮（3 秒内可撤销，可选增强）
- [ ] 页面切换增加过渡动画
- [ ] 键盘导航支持（Tab 切换、Enter 提交）

### Task 6.3 — 错误处理完善

- [ ] 网络断开时显示友好提示
- [ ] API 返回错误时显示具体错误信息
- [ ] 数据库锁定等异常的后端优雅处理
- [ ] 前端全局 Error Boundary 捕获

### Task 6.4 — 性能优化

- [ ] 搜索输入 300ms 防抖
- [ ] 图片/图标使用 SVG 或 icon font，减少请求
- [ ] 生产构建启用代码分割（React.lazy）
- [ ] Tailwind CSS purge 未使用样式

### Task 6.5 — 编写单元测试

重点测试后端 Service 层核心逻辑：

| 测试目标 | 测试用例 |
|----------|----------|
| taskService.create | 正常创建 / 标题为空报错 |
| taskService.update | 正常更新 / 任务不存在报错 |
| taskService.delete | 正常删除 / 任务不存在报错 |
| categoryService.create | 正常创建 / 重名报错 |
| categoryService.delete | 正常删除 / 预置分类不可删 / 关联任务迁移 |
| statsService | 统计数据准确性 |

---

## 10. 测试策略

### 10.1 测试分层

```
           ┌─────────────┐
          ╱  E2E 测试     ╲        手动验证为主
         ╱  (浏览器端到端)  ╲
        ┌───────────────────┐
       │   集成测试          │       API 接口测试
       │  (API 请求/响应)    │
      ┌─────────────────────┐
     │    单元测试            │     Service 层逻辑
     │   (函数级别)          │
    └───────────────────────┘
```

### 10.2 测试工具

| 工具 | 用途 | 使用范围 |
|------|------|----------|
| `vitest` | 单元测试框架 | 后端 Service 层 |
| `supertest` | HTTP 测试 | API 集成测试（可选） |

### 10.3 测试优先级

| 优先级 | 测试内容 | 方式 |
|--------|----------|------|
| P0（必须） | 任务 CRUD 完整流程 | 手动端到端验证 |
| P0（必须） | 分类管理完整流程 | 手动端到端验证 |
| P1（重要） | 筛选/排序/搜索正确性 | 手动验证 |
| P1（重要） | 状态流转正确性 | 手动验证 |
| P2（建议） | Service 层单元测试 | 自动化 |
| P3（可选） | API 集成测试 | 自动化 |

---

## 11. 部署方案

### 11.1 开发环境

```bash
# 一键启动前后端
npm run dev

# 前端：http://localhost:5173
# 后端：http://localhost:3001
```

### 11.2 生产构建

```bash
# 前端构建
cd client && npm run build
# 产出：client/dist/

# 后端构建（可选，也可直接用 tsx 运行）
cd server && npx tsc
# 产出：server/dist/
```

### 11.3 部署选项

| 方案 | 适合场景 | 说明 |
|------|----------|------|
| **本地运行** | 个人使用 | 直接 `node server/dist/index.js`，浏览器访问 |
| **Vercel + Railway** | 云端部署 | 前端部署 Vercel，后端部署 Railway |
| **Docker 单机** | 完整容器化 | 编写 Dockerfile，一键启动 |

### 11.4 Docker 部署方案（推荐）

```dockerfile
# Dockerfile（多阶段构建）
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY client/ ./client/
COPY server/ ./server/
RUN cd client && npm install && npm run build
RUN cd server && npm install

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/src ./server/src
COPY --from=builder /app/server/package.json ./server/

EXPOSE 3001
CMD ["npx", "tsx", "server/src/index.ts"]
```

---

## 12. 风险识别与应对

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|----------|
| SQLite 并发写入冲突 | 高并发下数据异常 | 低（个人工具） | better-sqlite3 为同步 API，天然避免并发问题 |
| 数据库文件丢失 | 数据全部丢失 | 中 | 定期备份 `taskflow.db` 文件；后续可增加导出功能 |
| 前端状态管理复杂 | 数据不同步 | 中 | 使用 React Context 集中管理；操作后统一刷新 |
| 日期时区问题 | 截止日期显示错误 | 中 | 统一使用 `YYYY-MM-DD` 字符串格式，不做时区转换 |
| Tailwind 样式冲突 | 组件样式异常 | 低 | 使用组件化开发，样式作用域隔离 |
| API 接口变更 | 前后端不一致 | 低 | 类型定义前后端保持同步，修改接口先更新类型 |

---

## 13. 开发规范

### 13.1 命名规范

| 类别 | 规范 | 示例 |
|------|------|------|
| 文件名（组件） | PascalCase | `TaskList.tsx` |
| 文件名（工具/服务） | camelCase | `taskService.ts` |
| 变量/函数 | camelCase | `fetchTasks`, `taskList` |
| 常量 | UPPER_SNAKE_CASE | `STATUS_MAP`, `API_BASE_URL` |
| 类型/接口 | PascalCase | `Task`, `Category`, `TaskStatus` |
| 数据库表名 | snake_case 复数 | `tasks`, `categories` |
| 数据库字段 | snake_case | `category_id`, `due_date` |
| API 路径 | kebab-case | `/api/tasks`, `/api/categories` |

### 13.2 Git 提交规范

```
feat: 新增任务创建功能
fix: 修复状态切换后列表不刷新
style: 调整任务卡片间距
refactor: 重构筛选逻辑
docs: 更新 API 文档
chore: 升级依赖版本
```

### 13.3 代码组织原则

| 原则 | 说明 |
|------|------|
| **单一职责** | 每个文件只做一件事，每个函数只负责一个功能 |
| **DRY** | 重复逻辑抽取为工具函数或公共组件 |
| **关注点分离** | 数据获取（Hook）与 UI 渲染（Component）分离 |
| **类型优先** | 先定义 TypeScript 类型，再编写实现代码 |

---

## 14. 附录：每日开发任务分解

### Day 1 — 基础搭建

| 序号 | 任务 | 产出物 | 完成标志 |
|------|------|--------|----------|
| 1 | 初始化 Monorepo 项目结构 | 根目录 + client + server | `npm run dev` 前后端均启动 |
| 2 | 配置 TypeScript | tsconfig.json（前后端各一份） | 无 TS 编译错误 |
| 3 | 配置 Tailwind CSS | tailwind.config.js + postcss.config.js | `className="text-red-500"` 生效 |
| 4 | 数据库初始化模块 | `config/database.ts` | 数据库文件创建成功，表结构正确 |
| 5 | Express 基础框架 | `app.ts` + `index.ts` + 中间件 | 访问 `localhost:3001` 有响应 |
| 6 | Vite 代理配置 | `vite.config.ts` | 前端请求 `/api` 转发到后端 |

### Day 2 — 后端 API（分类 + 任务基础）

| 序号 | 任务 | 产出物 | 完成标志 |
|------|------|--------|----------|
| 1 | 类型定义 + 校验 Schema | `types/` + `schemas/` | 类型无报错，Schema 可校验数据 |
| 2 | 分类 CRUD 全套接口 | routes + controller + service | 4 个接口均可正常调用 |
| 3 | 任务创建 + 查询接口 | 同上 | POST 创建 + GET 查询正常 |
| 4 | 任务更新 + 删除 + 状态切换 | 同上 | PUT/PATCH/DELETE 正常 |
| 5 | 筛选/排序/搜索功能 | 查询参数支持 | 各种筛选组合返回正确结果 |

### Day 3 — 前端页面（布局 + 列表 + 表单）

| 序号 | 任务 | 产出物 | 完成标志 |
|------|------|--------|----------|
| 1 | 全局类型 + 常量 + 工具函数 | `types/` + `utils/` | 定义完整，无类型错误 |
| 2 | Layout 布局（Header + Sidebar） | `components/layout/` | 布局正确展示 |
| 3 | 任务列表 + 单条任务卡片 | `TaskList` + `TaskItem` | 硬编码数据可正确渲染 |
| 4 | 创建/编辑任务模态框 | `TaskForm` + `Modal` | 表单可填写，前端校验通过 |
| 5 | 删除确认 + Toast 组件 | `ConfirmDialog` + `Toast` | 交互正常 |

### Day 4 — 联调 + 统计面板

| 序号 | 任务 | 产出物 | 完成标志 |
|------|------|--------|----------|
| 1 | API Hook 封装 | `hooks/useTasks.ts` 等 | 数据可正常获取和更新 |
| 2 | 前后端联调 — 任务 CRUD | 更新各组件 | 创建→列表显示→编辑→删除全通 |
| 3 | 联调 — 筛选/搜索/排序 | 更新 TaskFilters | 筛选搜索即时生效 |
| 4 | 联调 — 状态快捷切换 | 更新 TaskItem | 点击徽章切换状态 |
| 5 | 后端统计接口 | `statsService` + route | 返回正确统计数据 |
| 6 | 前端统计面板 | StatsPage + 图表组件 | 图表正确渲染 |

### Day 5 — 优化打磨

| 序号 | 任务 | 产出物 | 完成标志 |
|------|------|--------|----------|
| 1 | 分类管理完整联调 | Sidebar 分类区 | 增删改分类全通 |
| 2 | 截止日期视觉提醒 | `dateHelper.ts` + 样式 | 颜色变化正确 |
| 3 | 响应式适配 | 样式调整 | 768px+ 两种布局正常 |
| 4 | Loading / 空状态 / 错误处理 | 各组件增强 | 各种边界状态有友好展示 |
| 5 | 完整流程回归测试 | — | 所有 PRD 验收标准通过 |

---

## 总结：关键里程碑检查点

| 里程碑 | 检查点 | 通过标准 |
|--------|--------|----------|
| **M1 基础搭建** | 项目能跑 | 前后端启动无报错，数据库初始化成功 |
| **M2 后端 API** | 接口可用 | 所有 API 通过 Postman/curl 测试 |
| **M3 前端页面** | 页面能看 | 布局正确，组件渲染无异常 |
| **M4 联调完成** | 功能可用 | 完整 CRUD + 筛选 + 状态切换全通 |
| **M5 统计面板** | 数据可视 | 统计数据准确，图表正确展示 |
| **M6 交付** | 产品完整 | 通过所有验收标准，可演示可部署 |

---

> 📌 **执行建议**：严格按照 Day 1 → Day 5 顺序推进，每个 Task 完成后对照"完成标志"自查。遇到阻塞问题优先解决，不要跳过。每完成一个阶段，对照 PRD 验收标准逐条检查。
