# TaskFlow — 开发规范文档

> 版本：v1.0  
> 最后更新：2026-07-07  
> 配套文档：[PRD 需求文档](./PRD.md) ｜ [项目实施计划](./IMPLEMENTATION_PLAN.md)  
> 技术栈：React + TypeScript + Vite ｜ Node.js + Express + TypeScript ｜ SQLite ｜ Tailwind CSS

---

## 目录

1. [项目工程规范](#1-项目工程规范)
2. [命名规范](#2-命名规范)
3. [TypeScript 编码规范](#3-typescript-编码规范)
4. [后端开发规范](#4-后端开发规范)
5. [前端开发规范](#5-前端开发规范)
6. [React 组件规范](#6-react-组件规范)
7. [Tailwind CSS 样式规范](#7-tailwind-css-样式规范)
8. [API 接口规范](#8-api-接口规范)
9. [数据库规范](#9-数据库规范)
10. [Git 工作流规范](#10-git-工作流规范)
11. [测试规范](#11-测试规范)
12. [安全规范](#12-安全规范)
13. [代码审查清单](#13-代码审查清单)
14. [常见反模式与最佳实践](#14-常见反模式与最佳实践)

---

## 1. 项目工程规范

### 1.1 项目结构

```
taskflow/
├── client/          # 前端（React + Vite + TypeScript + Tailwind CSS）
├── server/          # 后端（Express + TypeScript + SQLite）
├── docs/            # 项目文档
├── package.json     # 根配置（脚本入口）
└── .gitignore
```

采用 **Monorepo** 结构，前后端在同一个仓库中管理。

### 1.2 环境要求

| 工具 | 最低版本 | 说明 |
|------|----------|------|
| Node.js | 18.x | 推荐使用 LTS 版本 |
| npm | 9.x | 随 Node.js 一起安装 |
| Git | 2.30+ | 版本控制 |
| VS Code | 最新 | 推荐编辑器 |

### 1.3 编辑器配置

项目根目录提供 `.vscode/settings.json` 统一团队编辑器配置：

```jsonc
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 1.4 ESLint + Prettier 配置

**后端 `.eslintrc.js`**：

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-console': 'warn',
  },
};
```

**前端 `.eslintrc.js`**：

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
```

**`.prettierrc`**（前后端共用）：

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "endOfLine": "auto"
}
```

### 1.5 tsconfig 配置

**后端 `server/tsconfig.json`**：

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**前端 `client/tsconfig.json`**：

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

> **关键**：前后端均开启 `"strict": true`，确保类型安全。

---

## 2. 命名规范

### 2.1 文件命名

| 文件类型 | 命名规则 | 示例 |
|----------|----------|------|
| React 组件 | **PascalCase** | `TaskList.tsx`、`Header.tsx`、`Modal.tsx` |
| 工具/服务/Hook 文件 | **camelCase** | `taskService.ts`、`dateHelper.ts`、`useTasks.ts` |
| 类型定义文件 | **camelCase** | `index.ts`（放在 `types/` 目录下） |
| 常量文件 | **camelCase** | `constants.ts` |
| 样式文件 | **camelCase** | `index.css` |
| 配置文件 | **kebab-case 或固定名** | `tailwind.config.js`、`vite.config.ts` |
| 测试文件 | 原文件名 + `.test` | `taskService.test.ts` |

### 2.2 代码命名

| 类别 | 规则 | 正确示例 | 错误示例 |
|------|------|----------|----------|
| 变量 | camelCase | `taskList`、`isLoading` | `task_list`、`TaskList` |
| 函数 | camelCase | `fetchTasks()`、`handleSubmit()` | `FetchTasks()`、`handle_submit()` |
| 常量 | UPPER_SNAKE_CASE | `STATUS_MAP`、`MAX_TITLE_LENGTH` | `statusMap`、`maxTitleLength` |
| 接口/类型 | PascalCase | `Task`、`Category`、`TaskStatus` | `task`、`category` |
| 枚举值 | PascalCase 或 UPPER_SNAKE_CASE | `TODO`、`IN_PROGRESS` | `todo`、`inProgress` |
| React 组件名 | PascalCase | `TaskList`、`TaskItem` | `taskList`、`task-list` |
| Hook 函数 | `use` 前缀 + PascalCase | `useTasks`、`useToast` | `getTasks`、`tasksHook` |
| 事件处理函数 | `handle` 前缀 | `handleClick`、`handleSubmit` | `onClick`（传给原生元素时除外） |
| 布尔变量 | `is`/`has`/`should` 前缀 | `isLoading`、`hasError` | `loading`、`error`（易混淆） |

### 2.3 数据库命名

| 类别 | 规则 | 示例 |
|------|------|------|
| 表名 | **snake_case 复数** | `tasks`、`categories` |
| 字段名 | **snake_case** | `category_id`、`due_date`、`created_at` |
| 主键 | `id` | `id INTEGER PRIMARY KEY` |
| 外键 | `{关联表单名单数}_id` | `category_id` |
| 索引 | `idx_{表名}_{字段名}` | `idx_tasks_status` |
| 约束 | `chk_{表名}_{字段名}` | `chk_tasks_status` |

### 2.4 API 路径命名

| 规则 | 正确示例 | 错误示例 |
|------|----------|----------|
| 使用 **kebab-case** | `/api/tasks`、`/api/categories` | `/api/getTasks`、`/api/Categories` |
| 资源名用 **复数名词** | `/api/tasks`、`/api/categories` | `/api/task`、`/api/category` |
| 路径中不含动词 | `/api/tasks`（GET=列表，POST=创建） | `/api/getTasks`、`/api/createTask` |
| 参数用路径段 | `/api/tasks/1` | `/api/tasks?id=1`（获取单个时） |

---

## 3. TypeScript 编码规范

### 3.1 核心原则

| 原则 | 说明 |
|------|------|
| **类型优先** | 先定义类型，再写实现代码 |
| **避免 any** | 用 `unknown` 或具体类型替代 `any`；如必须使用，添加 `// eslint-disable-next-line` 注释说明原因 |
| **类型复用** | 公共类型集中定义在 `types/index.ts`，前后端各维护一份 |
| **类型同步** | 前端类型定义必须与后端保持一致（手动同步或共享包） |

### 3.2 类型定义规范

**后端类型定义**：

```typescript
// ✅ 正确：使用 type 定义联合类型，interface 定义对象结构
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
  category_name?: string;  // 联表查询时存在
}
```

```typescript
// ❌ 错误：用 string 代替联合类型
interface Task {
  status: string;    // 太宽泛，无法获得类型提示
  priority: string;  // 无法约束合法值
}
```

**前端类型定义**：

```typescript
// ✅ 正确：前端类型与后端对齐，额外定义 UI 专用类型
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

// 表单专用类型（部分字段可选）
export interface TaskFormData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  category_id?: number;
  due_date?: string | null;
}

// 筛选条件类型
export interface TaskFilters {
  status: TaskStatus | 'ALL';
  category_id: number | null;
  keyword: string;
  sort_by: 'created_at' | 'priority' | 'due_date';
  sort_order: 'asc' | 'desc';
}
```

### 3.3 函数签名规范

```typescript
// ✅ 正确：明确参数类型和返回类型
function createTask(data: TaskFormData): Promise<Task> {
  // ...
}

// ✅ 正确：使用解构参数，提高可读性
function updateTask(id: number, data: Partial<TaskFormData>): Promise<Task> {
  // ...
}

// ❌ 错误：参数过多，无类型标注
function updateTask(id, title, description, status, priority, ...) {
  // ...
}
```

### 3.4 禁止与警告规则

| 级别 | 规则 | 说明 |
|------|------|------|
| **禁止** | 使用 `any` 类型 | 用 `unknown` + 类型收窄替代 |
| **禁止** | 使用 `@ts-ignore` | 用 `@ts-expect-error` 替代，并附注释说明原因 |
| **禁止** | 非空断言 `!` 滥用 | 优先使用可选链 `?.` 和空值合并 `??` |
| **警告** | 枚举使用 | 优先用联合类型（`type Status = 'A' \| 'B'`），简单场景无需 `enum` |
| **警告** | 命名空间 | 禁止使用 `namespace`，使用 ES Module 组织代码 |

### 3.5 类型收窄与守卫

```typescript
// ✅ 正确：使用类型守卫
function isValidStatus(status: string): status is TaskStatus {
  return ['TODO', 'IN_PROGRESS', 'DONE'].includes(status);
}

// ✅ 正确：使用可选链和空值合并
const categoryName = task?.category_name ?? '未分类';
const dueDateText = task.due_date ? formatDate(task.due_date) : '无截止日期';
```

---

## 4. 后端开发规范

### 4.1 分层架构规范

后端严格遵循四层架构，每层职责明确，**禁止跨层调用**：

```
请求 → Routes → Controllers → Services → Database
                                        ↓
响应 ← Routes ← Controllers ← Services ← 结果
```

| 层级 | 允许的操作 | 禁止的操作 |
|------|-----------|-----------|
| **Routes** | 定义路径和方法映射、挂载校验中间件 | 写业务逻辑、直接操作数据库 |
| **Controllers** | 解析请求参数、调用 Service、格式化响应 | 直接写 SQL、复杂业务判断 |
| **Services** | 业务逻辑、数据库操作、数据校验 | 处理 HTTP 请求/响应对象 |
| **Database** | 连接管理、建表、SQL 执行 | 包含业务逻辑 |

### 4.2 路由定义规范

```typescript
// ✅ 正确：路由文件只负责路径映射和中间件挂载
// server/src/routes/taskRoutes.ts
import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../schemas/taskSchema';

const router = Router();

router.get('/', validate(taskQuerySchema, 'query'), taskController.getAll);
router.post('/', validate(createTaskSchema), taskController.create);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.patch('/:id/status', taskController.updateStatus);
router.delete('/:id', taskController.delete);

export default router;
```

```typescript
// ❌ 错误：在路由文件中写业务逻辑
router.post('/', (req, res) => {
  const title = req.body.title;
  if (!title) return res.status(400).json({ error: '标题不能为空' });
  const task = db.prepare('INSERT INTO tasks ...').run(title);  // 直接操作数据库
  res.json(task);
});
```

### 4.3 Controller 规范

```typescript
// ✅ 正确：Controller 只做三件事——取参数、调 Service、返响应
export const taskController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = taskService.getAll(req.query as TaskQueryParams);
      res.json(successResponse(tasks));
    } catch (error) {
      next(error);  // 统一交给错误处理中间件
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const task = taskService.create(req.body);
      res.status(201).json(successResponse(task, '任务创建成功'));
    } catch (error) {
      next(error);
    }
  },
};
```

**Controller 规则**：
- 每个方法必须用 `try/catch` 包裹，错误统一交给 `next(error)` 处理
- 禁止在 Controller 中直接操作数据库
- 响应格式必须使用 `successResponse()` / `listResponse()` 工具函数
- 创建成功返回 `201` 状态码，删除成功返回 `204` 或带消息的 `200`

### 4.4 Service 规范

```typescript
// ✅ 正确：Service 封装完整业务逻辑
export const taskService = {
  getAll(params: TaskQueryParams): Task[] {
    // 构建动态查询条件
    // 执行 SQL
    // 返回结果
  },

  create(data: TaskCreateData): Task {
    // 业务校验（如标题不能为空——虽然 Schema 已校验，Service 层做兜底）
    // 执行插入
    // 返回新建的任务（通过 getById 获取完整数据）
  },
};
```

**Service 规则**：
- 每个 Service 以对象字面量形式导出，方法按功能命名
- 数据库操作使用参数化查询（`?` 占位符），**严禁字符串拼接 SQL**
- 查询结果必须定义返回类型
- 错误使用自定义异常类（`AppError`、`NotFoundError`、`ValidationError`）抛出

```typescript
// ✅ 正确：参数化查询
db.prepare('SELECT * FROM tasks WHERE title LIKE ?').run(`%${keyword}%`);

// ❌ 错误：字符串拼接（SQL 注入风险）
db.prepare(`SELECT * FROM tasks WHERE title LIKE '%${keyword}%'`).run();
```

### 4.5 错误处理规范

**自定义错误类体系**：

```typescript
// server/src/utils/errors.ts

// 基础错误类
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// 404 资源不存在
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource}不存在`);
  }
}

// 400 参数校验失败
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'VALIDATION_ERROR', message);
  }
}

// 409 资源冲突（如重名）
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}
```

**全局错误处理中间件**：

```typescript
// server/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  // 自定义业务错误
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }

  // 未知错误（开发环境暴露详情，生产环境隐藏）
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
    },
  });
}
```

**错误码规范**：

| 错误码 | HTTP 状态码 | 使用场景 |
|--------|------------|----------|
| `VALIDATION_ERROR` | 400 | 请求参数不合法 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `CONFLICT` | 409 | 资源冲突（如分类名重复） |
| `BUILTIN_ERROR` | 400 | 预置资源不可操作 |
| `INTERNAL_ERROR` | 500 | 未预期的服务器错误 |

### 4.6 日志规范

```typescript
// ✅ 正确：使用有意义的日志
console.log(`[TaskService] Created task: id=${task.id}, title="${task.title}"`);
console.error(`[TaskService] Failed to create task:`, error);

// ❌ 错误：无意义的日志
console.log('error');
console.log(data);
```

**日志级别约定**：

| 方法 | 使用场景 |
|------|----------|
| `console.log` | 服务启动、关键操作成功 |
| `console.warn` | 可恢复的异常、降级处理 |
| `console.error` | 不可恢复的错误，附带错误堆栈 |
| `console.debug` | 开发调试信息（生产环境应关闭） |

---

## 5. 前端开发规范

### 5.1 目录组织规范

```
client/src/
├── api/           # API 调用层（每个资源一个文件）
├── components/    # 可复用组件（按功能模块分子目录）
│   ├── common/    # 通用组件（Modal、Toast、Badge 等）
│   ├── layout/    # 布局组件（Header、Sidebar、Layout）
│   ├── tasks/     # 任务相关组件
│   ├── categories/# 分类相关组件
│   └── stats/     # 统计相关组件
├── hooks/         # 自定义 Hooks（数据获取逻辑）
├── pages/         # 页面组件（路由级别）
├── store/         # 全局状态管理
├── types/         # 类型定义
├── utils/         # 工具函数
└── assets/        # 静态资源（图片、SVG 等）
```

**组件放置规则**：
- **页面组件**（`pages/`）：路由直接渲染的顶层组件，负责组合子组件和管理页面级状态
- **业务组件**（`components/tasks/` 等）：与特定业务相关的组件，只在该业务模块内使用
- **通用组件**（`components/common/`）：与业务无关的可复用组件，可在任何模块中使用

### 5.2 导入顺序规范

每个文件的 `import` 语句按以下顺序排列，各组之间空一行：

```typescript
// 1. React 核心
import { useState, useEffect } from 'react';

// 2. 第三方库
import axios from 'axios';
import dayjs from 'dayjs';

// 3. 项目内模块（按路径层级）
import { TaskList } from '../components/tasks/TaskList';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { STATUS_MAP } from '../utils/constants';

// 4. 样式文件
import './TaskPage.css';
```

### 5.3 组件文件结构规范

每个组件文件按以下顺序组织内容：

```typescript
// 1. 导入语句
import { useState } from 'react';
import { Task } from '../../types';

// 2. 类型定义（组件 Props）
interface TaskItemProps {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

// 3. 组件定义（函数声明或箭头函数）
export function TaskItem({ task, onStatusChange, onEdit, onDelete }: TaskItemProps) {
  // 3.1 Hooks（useState, useEffect 等）
  const [isEditing, setIsEditing] = useState(false);

  // 3.2 计算值 / 派生状态
  const dueDateInfo = getDueDateStatus(task.due_date, task.status);

  // 3.3 事件处理函数
  const handleStatusClick = () => {
    onStatusChange(task.id, STATUS_MAP[task.status].next);
  };

  // 3.4 渲染
  return (
    <div>...</div>
  );
}
```

### 5.4 状态管理规范

| 状态类型 | 管理方式 | 示例 |
|----------|----------|------|
| 组件内部 UI 状态 | `useState` | 模态框开关、表单输入值、hover 状态 |
| 跨组件共享状态 | React Context | 任务列表、分类列表、筛选条件 |
| 服务端数据 | 自定义 Hook + axios | 任务列表获取、统计数据获取 |
| URL 参数 | react-router | 当前页面路径 |

**禁止事项**：
- 禁止在组件外部使用可变变量存储状态（`let count = 0`）
- 禁止将服务端数据同时存储在 Context 和组件 `useState` 中（会造成数据不一致）

### 5.5 自定义 Hook 规范

```typescript
// ✅ 正确：Hook 封装数据获取 + 状态管理 + 操作方法
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskApi.getAll(filters);
      setTasks(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取任务列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: TaskFormData) => {
    const response = await taskApi.create(data);
    setTasks(prev => [response.data, ...prev]);
    return response.data;
  }, []);

  // ... updateTask, deleteTask, toggleStatus

  return { tasks, loading, error, fetchTasks, createTask, /* ... */ };
}
```

**Hook 规则**：
- Hook 名称必须以 `use` 开头
- 遵循 React Hooks 规则：只在顶层调用，不在条件/循环中调用
- 返回值为对象，包含数据和方法
- 异步操作必须处理 loading、error、data 三态

---

## 6. React 组件规范

### 6.1 组件定义方式

```typescript
// ✅ 推荐：使用函数声明（便于调试，组件名自动推导）
export function TaskList({ tasks, onEdit }: TaskListProps) {
  return <div>...</div>;
}

// ✅ 也可以：箭头函数导出
const TaskItem = ({ task }: TaskItemProps) => {
  return <div>...</div>;
};
export default TaskItem;

// ❌ 禁止：使用 class 组件
class TaskList extends React.Component { ... }
```

### 6.2 Props 规范

```typescript
// ✅ 正确：明确定义 Props 类型
interface TaskFormProps {
  mode: 'create' | 'edit';
  initialData?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

// ❌ 错误：使用 children 传递过多内容
// ❌ 错误：Props 超过 7 个（应拆分为子组件或使用对象参数）
```

**Props 规则**：
- Props 接口命名：`{组件名}Props`，如 `TaskItemProps`
- 回调函数以 `on` 开头：`onClick`、`onSubmit`、`onChange`
- 可选 Props 使用 `?` 标注，并提供合理默认值
- Props 数量控制在 **5 个以内**，超过时考虑拆分子组件或传入对象

### 6.3 事件处理规范

```typescript
// ✅ 正确：事件处理函数命名用 handle 前缀
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // ...
};

// ✅ 正确：传给子组件的回调用 on 前缀
<TaskItem
  onEdit={() => openEditModal(task)}
  onDelete={() => openDeleteConfirm(task.id)}
/>

// ❌ 错误：在 JSX 中直接写复杂逻辑
<button onClick={() => {
  if (validate()) {
    setLoading(true);
    api.update(task.id, data).then(...).catch(...);
  }
}}>
```

### 6.4 列表渲染规范

```typescript
// ✅ 正确：使用唯一且稳定的 key
{tasks.map(task => (
  <TaskItem key={task.id} task={task} />
))}

// ❌ 错误：使用 index 作为 key（列表会变动时）
{tasks.map((task, index) => (
  <TaskItem key={index} task={task} />
))}
```

### 6.5 条件渲染规范

```typescript
// ✅ 方式 1：三元运算符（二选一）
{isLoading ? <Loading /> : <TaskList tasks={tasks} />}

// ✅ 方式 2：逻辑与（存在则渲染）
{tasks.length === 0 && <TaskEmpty />}

// ✅ 方式 3：提前返回（Guard Clause）
if (isLoading) return <Loading />;
if (error) return <ErrorMessage message={error} />;
return <TaskList tasks={tasks} />;
```

### 6.6 useEffect 规范

```typescript
// ✅ 正确：明确依赖项
useEffect(() => {
  fetchTasks(filters);
}, [filters]);  // filters 变化时重新获取

// ✅ 正确：清理副作用
useEffect(() => {
  const timer = setInterval(() => refreshData(), 30000);
  return () => clearInterval(timer);  // 组件卸载时清理
}, []);

// ❌ 错误：遗漏依赖项
useEffect(() => {
  fetchTasks(filters);  // filters 在依赖中缺失
}, []);

// ❌ 错误：在 useEffect 中直接定义异步函数
useEffect(async () => {       // useEffect 不能是 async
  const data = await fetchData();
}, []);

// ✅ 正确：在内部调用
useEffect(() => {
  const loadData = async () => {
    const data = await fetchData();
    setData(data);
  };
  loadData();
}, []);
```

---

## 7. Tailwind CSS 样式规范

### 7.1 基本原则

| 原则 | 说明 |
|------|------|
| **Utility-First** | 优先使用 Tailwind 工具类，避免自定义 CSS |
| **组合优于覆盖** | 通过组合工具类实现样式，不使用 `!important` 覆盖 |
| **语义化提取** | 重复出现的工具类组合提取为组件，不在多处复制粘贴 |

### 7.2 颜色使用规范

严格使用项目色彩体系（参照 PRD 6.4 节）：

```typescript
// ✅ 正确：使用 Tailwind 预设颜色
<span className="text-blue-500">待办</span>
<span className="bg-red-100 text-red-800 px-2 py-1 rounded">高</span>

// ✅ 正确：在 tailwind.config.js 中扩展自定义颜色
// theme.extend.colors.primary = '#3B82F6'
<button className="bg-primary text-white">主按钮</button>

// ❌ 错误：使用任意色值
<span style={{ color: '#3B82F6' }}>待办</span>
```

**语义化颜色映射**：

| 语义 | Tailwind 类名 | 使用场景 |
|------|--------------|----------|
| 主色调 | `text-blue-500` / `bg-blue-500` | 链接、主按钮、品牌色 |
| 待办 | `text-blue-800 bg-blue-100` | 状态徽章 |
| 进行中 | `text-yellow-800 bg-yellow-100` | 状态徽章 |
| 已完成 | `text-green-800 bg-green-100` | 状态徽章 |
| 高优先级 | `text-red-500` | 优先级指示 |
| 中优先级 | `text-orange-500` | 优先级指示 |
| 低优先级 | `text-green-500` | 优先级指示 |
| 即将过期 | `text-orange-500` | 截止日期 ≤7 天 |
| 已过期 | `text-red-500 font-semibold` | 截止日期已过 |
| 文字主色 | `text-gray-800` | 标题、正文 |
| 文字次要 | `text-gray-500` | 辅助信息 |
| 背景 | `bg-gray-50` | 页面背景 |
| 卡片 | `bg-white` | 卡片背景 |

### 7.3 间距与布局规范

```typescript
// ✅ 页面级布局：使用 Flex/Grid
<div className="flex h-screen">
  <aside className="w-60 flex-shrink-0">侧边栏</aside>
  <main className="flex-1 overflow-auto">主内容</main>
</div>

// ✅ 卡片组件：统一的内边距和圆角
<div className="bg-white rounded-lg shadow-sm p-4">
  ...
</div>

// ✅ 列表项：统一的间距
<div className="space-y-3">
  {tasks.map(task => <TaskItem key={task.id} task={task} />)}
</div>
```

**间距约定**：

| 场景 | 类名 | 说明 |
|------|------|------|
| 页面内边距 | `p-6` | 页面主内容区 |
| 卡片内边距 | `p-4` | 卡片内部 |
| 列表项间距 | `space-y-3` | 任务列表各项之间 |
| 按钮组间距 | `space-x-2` 或 `gap-2` | 并排按钮之间 |
| 表单字段间距 | `space-y-4` | 表单项之间 |

### 7.4 响应式规范

```typescript
// 移动优先：默认样式为最小屏幕，用断点前缀扩展
<div className="w-full md:w-60 lg:w-72">
  {/* 默认全宽，md(768px+)固定宽度 */}
</div>

// 桌面端显示侧边栏，平板端隐藏
<aside className="hidden md:block w-60">
  {/* 侧边栏内容 */}
</aside>
```

**断点约定**：

| 断点 | 宽度 | 布局策略 |
|------|------|----------|
| 默认 | <768px | 不做专门适配（提示使用更大屏幕） |
| `md` | ≥768px | 平板布局：侧边栏隐藏，汉堡菜单展开 |
| `lg` | ≥1024px | 桌面布局：侧边栏固定显示 |

### 7.5 禁止事项

| 禁止 | 替代方案 |
|------|----------|
| `!important` | 调整选择器优先级或重构组件结构 |
| 内联 `style={{}}` | 使用 Tailwind 工具类 |
| 自定义 CSS 文件（除全局样式） | 使用 Tailwind `@apply` 或工具类 |
| 硬编码像素值 | 使用 Tailwind 间距系统（`p-4` 而非 `padding: 16px`） |

---

## 8. API 接口规范

### 8.1 RESTful 设计原则

| 原则 | 说明 | 示例 |
|------|------|------|
| **资源导向** | URL 代表资源，HTTP 方法代表操作 | `GET /api/tasks`（获取列表） |
| **复数名词** | 资源名统一用复数 | `/api/tasks`，非 `/api/task` |
| **无动词** | URL 中不含动词 | `POST /api/tasks`（创建），非 `/api/createTask` |
| **嵌套有度** | 最多一层嵌套（本项目不使用嵌套） | `/api/tasks`，非 `/api/categories/1/tasks` |

### 8.2 HTTP 方法约定

| 方法 | 语义 | 幂等性 | 成功状态码 |
|------|------|--------|-----------|
| `GET` | 查询资源 | 是 | 200 |
| `POST` | 创建资源 | 否 | 201 |
| `PUT` | 全量更新资源 | 是 | 200 |
| `PATCH` | 部分更新资源 | 是 | 200 |
| `DELETE` | 删除资源 | 是 | 200（带消息）或 204 |

### 8.3 统一响应格式

**成功响应（单个）**：

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "完成PRD文档",
    "status": "TODO"
  },
  "message": "任务创建成功"
}
```

**成功响应（列表）**：

```json
{
  "success": true,
  "data": [
    { "id": 1, "title": "任务A" },
    { "id": 2, "title": "任务B" }
  ],
  "total": 2
}
```

**错误响应**：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "标题不能为空"
  }
}
```

### 8.4 请求参数规范

| 参数位置 | 用途 | 示例 |
|----------|------|------|
| **路径参数** | 资源标识 | `/api/tasks/:id` |
| **查询参数** | 筛选/排序/分页 | `?status=TODO&sort_by=created_at&sort_order=desc` |
| **请求体（JSON）** | 创建/更新数据 | `{ "title": "新任务", "priority": "HIGH" }` |

**查询参数命名规范**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `status` | string | 筛选状态 |
| `category_id` | number | 筛选分类 |
| `priority` | string | 筛选优先级 |
| `keyword` | string | 关键词搜索 |
| `sort_by` | string | 排序字段 |
| `sort_order` | string | 排序方向（asc/desc） |

### 8.5 前端 API 调用规范

```typescript
// ✅ 正确：API 调用集中管理，每个资源一个文件
// client/src/api/taskApi.ts
export const taskApi = {
  getAll: (params?: TaskQueryParams) =>
    apiClient.get<Task[]>('/tasks', { params }),

  create: (data: TaskFormData) =>
    apiClient.post<Task>('/tasks', data),

  update: (id: number, data: Partial<TaskFormData>) =>
    apiClient.put<Task>(`/tasks/${id}`, data),

  updateStatus: (id: number, status: TaskStatus) =>
    apiClient.patch<Task>(`/tasks/${id}/status`, { status }),

  delete: (id: number) =>
    apiClient.delete(`/tasks/${id}`),
};
```

```typescript
// ❌ 错误：在组件中直接使用 axios
function TaskList() {
  useEffect(() => {
    axios.get('/api/tasks').then(res => setTasks(res.data));  // 散落在组件中
  }, []);
}
```

**Axios 拦截器规范**：

```typescript
// client/src/api/client.ts
// 响应拦截器：统一解包 data + 错误处理
apiClient.interceptors.response.use(
  (response) => response.data,   // 自动解包 { data: ... } 层
  (error) => {
    const message = error.response?.data?.error?.message || '网络请求失败';
    // 可在此处统一弹出 Toast
    return Promise.reject(new Error(message));
  }
);
```

---

## 9. 数据库规范

### 9.1 表设计规范

| 规则 | 说明 |
|------|------|
| 表名 **snake_case 复数** | `tasks`、`categories` |
| 每张表必须有 `id` 主键 | `id INTEGER PRIMARY KEY AUTOINCREMENT` |
| 时间字段使用 `DATETIME` | `created_at`、`updated_at` |
| 时间默认值 | `DEFAULT CURRENT_TIMESTAMP` |
| 使用 `CHECK` 约束枚举值 | `CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE'))` |
| 外键约束 | `FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET DEFAULT` |
| 启用外键检查 | `PRAGMA foreign_keys = ON`（每次连接时执行） |

### 9.2 字段类型约定

| 用途 | SQLite 类型 | TypeScript 类型 | 示例 |
|------|------------|----------------|------|
| 主键 | `INTEGER` | `number` | `id` |
| 短文本 | `VARCHAR(n)` | `string` | `title VARCHAR(100)` |
| 长文本 | `TEXT` | `string` | `description TEXT` |
| 枚举值 | `VARCHAR(n)` + CHECK | 联合类型 | `status VARCHAR(20)` |
| 整数标记 | `INTEGER` | `number` | `is_builtin INTEGER` |
| 日期 | `DATE` | `string`（YYYY-MM-DD） | `due_date DATE` |
| 日期时间 | `DATETIME` | `string`（ISO 8601） | `created_at DATETIME` |
| 可空字段 | 无 NOT NULL | `T \| null` | `due_date DATE`（可为空） |

### 9.3 SQL 编写规范

```sql
-- ✅ 正确：关键字大写，格式化缩进
SELECT t.id, t.title, t.status, c.name AS category_name
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.status = ?
ORDER BY t.created_at DESC;

-- ✅ 正确：使用参数化查询
db.prepare('SELECT * FROM tasks WHERE title LIKE ?').run(`%${keyword}%`);

-- ❌ 错误：字符串拼接（SQL 注入风险！）
db.prepare(`SELECT * FROM tasks WHERE title LIKE '%${keyword}%'`).run();

-- ❌ 错误：SELECT *（在联表查询中）
db.prepare('SELECT * FROM tasks t JOIN categories c ON ...').all();
-- 应明确列出需要的字段
```

### 9.4 数据初始化规范

```typescript
// ✅ 正确：幂等初始化（多次运行不会重复插入）
const count = db.prepare('SELECT COUNT(*) as count FROM categories').get() as any;
if (count.count === 0) {
  // 仅在表为空时插入预置数据
  const insert = db.prepare('INSERT INTO categories (name, is_builtin) VALUES (?, 1)');
  insert.run('默认');
  insert.run('工作');
  insert.run('学习');
  insert.run('生活');
}
```

---

## 10. Git 工作流规范

### 10.1 分支策略

```
main          ← 稳定版本，可部署
 └── develop  ← 开发主线
      ├── feat/task-crud      ← 功能分支
      ├── feat/stats-panel    ← 功能分支
      └── fix/date-display    ← 修复分支
```

| 分支 | 用途 | 命名规则 |
|------|------|----------|
| `main` | 生产环境代码 | 固定 |
| `develop` | 开发集成分支 | 固定 |
| `feat/*` | 新功能开发 | `feat/功能简述`，如 `feat/task-crud` |
| `fix/*` | Bug 修复 | `fix/问题简述`，如 `fix/date-display` |
| `refactor/*` | 重构 | `refactor/重构内容` |

### 10.2 Commit 消息规范

采用 **Conventional Commits** 格式：

```
<type>(<scope>): <description>

[可选 body]

[可选 footer]
```

**type 类型**：

| type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(task): 添加任务创建功能` |
| `fix` | Bug 修复 | `fix(date): 修复截止日期显示错误` |
| `style` | 样式调整（不影响逻辑） | `style(task): 调整任务卡片间距` |
| `refactor` | 重构（不改变功能） | `refactor(api): 重构请求封装` |
| `test` | 添加/修改测试 | `test(service): 添加任务服务单元测试` |
| `docs` | 文档变更 | `docs: 更新 API 接口文档` |
| `chore` | 构建/工具/依赖变更 | `chore: 升级 TypeScript 到 5.5` |
| `perf` | 性能优化 | `perf(list): 优化长列表渲染性能` |

**scope 范围**（可选）：

| scope | 说明 |
|-------|------|
| `task` | 任务相关 |
| `category` | 分类相关 |
| `stats` | 统计相关 |
| `ui` | 通用 UI 组件 |
| `api` | 后端接口 |
| `db` | 数据库 |

**示例**：

```
feat(task): 实现任务列表筛选和排序功能

- 支持按状态、分类、优先级筛选
- 支持按创建时间、优先级、截止日期排序
- 搜索框支持关键词模糊匹配

Closes #12
```

### 10.3 .gitignore 规范

```gitignore
# 依赖
node_modules/

# 构建产物
client/dist/
server/dist/

# 数据库文件（不提交到仓库）
server/data/*.db

# 环境变量
.env
.env.local
.env.production

# 编辑器
.vscode/settings.json  # 如有个人配置
.idea/

# 系统文件
.DS_Store
Thumbs.db

# 日志
*.log
```

---

## 11. 测试规范

### 11.1 测试文件组织

```
server/
├── src/
│   ├── services/
│   │   ├── taskService.ts
│   │   └── taskService.test.ts     # 测试文件与源文件同目录
│   └── ...

client/
├── src/
│   ├── utils/
│   │   ├── dateHelper.ts
│   │   └── dateHelper.test.ts      # 测试文件与源文件同目录
│   └── ...
```

### 11.2 测试命名规范

```typescript
// describe 描述被测模块
describe('taskService', () => {

  // describe 描述被测方法
  describe('create', () => {

    // it/test 描述具体场景，格式："应该 + 预期行为"
    it('应该在提供有效数据时成功创建任务', () => { ... });
    it('应该在标题为空时抛出 ValidationError', () => { ... });
    it('应该使用默认优先级 MEDIUM', () => { ... });

  });
});
```

### 11.3 测试结构（AAA 模式）

```typescript
it('应该在标题为空时抛出 ValidationError', () => {
  // Arrange（准备）
  const invalidData = { title: '' };

  // Act（执行）
  const action = () => taskService.create(invalidData);

  // Assert（断言）
  expect(action).toThrow(ValidationError);
});
```

### 11.4 测试优先级

| 优先级 | 测试对象 | 方式 |
|--------|----------|------|
| **P0 必须** | 后端 Service 层 CRUD 逻辑 | 单元测试 |
| **P0 必须** | 完整业务流程（创建→查看→编辑→删除） | 手动端到端验证 |
| **P1 重要** | 工具函数（日期计算、数据格式化） | 单元测试 |
| **P1 重要** | 筛选/排序/搜索正确性 | 手动验证 |
| **P2 建议** | API 接口请求/响应 | 集成测试 |
| **P3 可选** | 前端组件渲染 | 组件测试 |

### 11.5 测试数据规范

```typescript
// ✅ 正确：使用工厂函数创建测试数据
function createTestTask(overrides?: Partial<Task>): Task {
  return {
    id: 1,
    title: '测试任务',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    category_id: 1,
    due_date: null,
    created_at: '2026-07-07T00:00:00Z',
    updated_at: '2026-07-07T00:00:00Z',
    ...overrides,
  };
}

// 使用
const highPriorityTask = createTestTask({ priority: 'HIGH', title: '紧急任务' });
```

---

## 12. 安全规范

### 12.1 SQL 注入防护

```typescript
// ✅ 必须：使用参数化查询
db.prepare('SELECT * FROM tasks WHERE title = ?').run(title);

// ❌ 严禁：字符串拼接
db.prepare(`SELECT * FROM tasks WHERE title = '${title}'`).run();
```

### 12.2 XSS 防护

```typescript
// ✅ React 默认转义：安全
<div>{userInput}</div>

// ❌ 严禁：使用 dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 12.3 输入校验

- **后端**：所有 API 入参必须通过 `zod` Schema 校验
- **前端**：表单提交前进行前端校验（提升用户体验，但不能替代后端校验）
- 字符串长度限制、枚举值白名单、数值范围检查

### 12.4 敏感信息

| 禁止 | 说明 |
|------|------|
| 硬编码密钥/密码 | 使用环境变量 `.env` |
| 提交 `.env` 文件 | 加入 `.gitignore` |
| 提交数据库文件 | `server/data/*.db` 加入 `.gitignore` |
| 在日志中打印敏感信息 | 密码、Token 等 |

### 12.5 依赖安全

- 定期运行 `npm audit` 检查依赖漏洞
- 使用固定版本号（`package-lock.json`）确保可重复构建

---

## 13. 代码审查清单

每次提交代码前，对照以下清单自查：

### 13.1 通用检查

- [ ] 代码能通过 ESLint 检查（无 error 级别问题）
- [ ] 无 `console.log` 调试代码（或已用 `// eslint-disable-next-line no-console` 标注）
- [ ] 无 `any` 类型（或已标注原因）
- [ ] 无硬编码的魔法数字/字符串（已提取为常量）
- [ ] 新增文件已放在正确的目录下
- [ ] 导入顺序正确

### 13.2 后端检查

- [ ] 新增 API 已添加参数校验 Schema
- [ ] Controller 中无直接数据库操作
- [ ] Service 中使用参数化 SQL 查询
- [ ] 错误使用自定义异常类抛出
- [ ] 响应格式使用统一工具函数
- [ ] 数据库操作有正确的错误处理

### 13.3 前端检查

- [ ] 组件 Props 有明确的 TypeScript 类型
- [ ] 列表渲染使用唯一且稳定的 `key`
- [ ] `useEffect` 依赖项完整
- [ ] 异步操作处理了 loading / error / data 三态
- [ ] 表单有前端校验
- [ ] 用户输入在渲染时已转义（防 XSS）
- [ ] 样式使用 Tailwind 工具类，无内联 style
- [ ] 响应式布局在 md 和 lg 断点均正常

### 13.4 Git 检查

- [ ] Commit 消息符合 Conventional Commits 格式
- [ ] 不包含敏感信息（密码、密钥、数据库文件）
- [ ] 不包含 `node_modules`、`dist`、`.db` 等文件

---

## 14. 常见反模式与最佳实践

### 14.1 后端反模式

| 反模式 | 问题 | 正确做法 |
|--------|------|----------|
| 在路由中写业务逻辑 | 代码混乱，无法测试 | 抽取到 Controller + Service |
| 直接操作 `req/res` 在 Service 中 | Service 与 HTTP 耦合 | Service 只返回数据，Controller 负责响应 |
| 字符串拼接 SQL | SQL 注入风险 | 使用参数化查询 `?` 占位符 |
| 全局 `try/catch` 吞掉错误 | 问题无法定位 | 使用 `next(error)` 传递给错误中间件 |
| 每次请求创建数据库连接 | 性能浪费 | 单例模式，应用启动时创建一次 |

### 14.2 前端反模式

| 反模式 | 问题 | 正确做法 |
|--------|------|----------|
| 在组件中直接调用 axios | 代码散落，难以维护 | 封装到 `api/` 模块 |
| 在 `useEffect` 中写复杂逻辑 | 难以调试，依赖项混乱 | 抽取到自定义 Hook |
| 用 `index` 作为列表 `key` | 列表变动时渲染异常 | 使用唯一 ID 作为 key |
| 大量内联 `style={{}}` | 无法复用，性能差 | 使用 Tailwind 工具类 |
| 过度使用 Context | 任何变化导致所有消费者重渲染 | 局部状态用 `useState`，只在真正需要共享时用 Context |
| Props  drilling 过深 | 组件耦合度高 | 使用 Context 或重组组件树 |
| 在渲染中创建函数/对象 | 每次渲染创建新引用 | 使用 `useCallback` / `useMemo`（需要时） |

### 14.3 最佳实践总结

| 实践 | 说明 |
|------|------|
| **小步提交** | 每个 commit 只做一件事，便于回溯和审查 |
| **先写类型** | 先定义 TypeScript 接口，再写实现代码 |
| **先写 Service** | 后端开发顺序：类型 → Schema → Service → Controller → Route |
| **先写组件骨架** | 前端开发顺序：类型 → 组件骨架 → 硬编码数据渲染 → 接入 API |
| **常量集中管理** | 状态映射、优先级映射、配置项等集中在 `constants.ts` |
| **错误边界** | 前端使用 ErrorBoundary 捕获组件渲染错误 |
| **乐观更新** | 状态切换等简单操作可先更新 UI，再调用 API（失败时回滚） |
| **组件单一职责** | 一个组件只做一件事；列表组件不负责渲染单项 |
| **Hook 封装数据逻辑** | 数据获取、状态管理、操作方法统一封装在 Hook 中 |
| **工具函数纯函数化** | 工具函数不依赖外部状态，相同输入永远返回相同输出 |

---

> 📌 **规范说明**：本文档为 TaskFlow 项目的开发规范，所有参与开发的成员应遵循此规范。规范不是束缚，而是帮助团队保持一致性、降低沟通成本的工具。如对规范有疑问或建议，欢迎讨论调整。
