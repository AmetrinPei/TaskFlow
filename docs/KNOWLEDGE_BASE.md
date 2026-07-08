# TaskFlow — 项目知识库

> 版本：v1.0  
> 最后更新：2026-07-07  
> 本文档汇总项目全部核心知识，作为开发过程中的一站式参考手册

---

## 目录

1. [快速参考卡片](#1-快速参考卡片)
2. [技术栈知识库](#2-技术栈知识库)
3. [后端核心代码知识库](#3-后端核心代码知识库)
4. [前端核心代码知识库](#4-前端核心代码知识库)
5. [数据库知识库](#5-数据库知识库)
6. [API 接口知识库](#6-api-接口知识库)
7. [业务逻辑知识库](#7-业务逻辑知识库)
8. [常见问题与解决方案](#8-常见问题与解决方案)
9. [命令速查手册](#9-命令速查手册)
10. [配置模板速查](#10-配置模板速查)
11. [代码片段速查](#11-代码片段速查)
12. [决策记录（ADR）](#12-决策记录adr)
13. [术语表](#13-术语表)

---

## 1. 快速参考卡片

### 1.1 项目一览

```
项目名：TaskFlow — 个人任务管理系统
技术栈：React + TS + Vite | Express + TS | SQLite | Tailwind CSS
结构：Monorepo（client/ + server/）
端口：前端 5173（dev）| 后端 3001
数据库：server/data/taskflow.db（SQLite 文件）
```

### 1.2 常用命令

```bash
# 开发
npm run dev                    # 一键启动前后端
cd server && npm run dev       # 只启动后端
cd client && npm run dev       # 只启动前端

# 构建
cd client && npm run build     # 前端构建

# 测试
cd server && npx vitest run    # 后端单元测试

# 数据库
rm server/data/taskflow.db     # 重置数据库（重启后自动重建）
```

### 1.3 关键文件地图

```
后端入口：     server/src/index.ts
后端配置：     server/src/app.ts
数据库初始化： server/src/config/database.ts
路由注册：     server/src/routes/index.ts
任务路由：     server/src/routes/taskRoutes.ts
任务控制器：   server/src/controllers/taskController.ts
任务服务：     server/src/services/taskService.ts
参数校验：     server/src/schemas/taskSchema.ts
类型定义：     server/src/types/index.ts
错误类：       server/src/utils/errors.ts
响应工具：     server/src/utils/response.ts

前端入口：     client/src/main.tsx
路由配置：     client/src/App.tsx
API 客户端：   client/src/api/client.ts
任务 API：     client/src/api/taskApi.ts
任务 Hook：    client/src/hooks/useTasks.ts
全局状态：     client/src/store/taskStore.ts
常量定义：     client/src/utils/constants.ts
日期工具：     client/src/utils/dateHelper.ts
任务列表页：   client/src/pages/TaskPage.tsx
统计面板页：   client/src/pages/StatsPage.tsx
```

### 1.4 状态与枚举速查

```typescript
// 任务状态
TODO          = 'TODO'           // 待办（蓝色）
IN_PROGRESS   = 'IN_PROGRESS'    // 进行中（黄色）
DONE          = 'DONE'           // 已完成（绿色）

// 优先级
HIGH          = 'HIGH'           // 高（红色）
MEDIUM        = 'MEDIUM'         // 中（橙色）
LOW           = 'LOW'            // 低（绿色）

// 状态流转：TODO → IN_PROGRESS → DONE → TODO（循环）
```

### 1.5 色彩速查

```
主色调/待办：  blue-500  (#3B82F6)
进行中：       yellow-500
已完成：       green-500 (#22C55E)
高优先级：     red-500   (#EF4444)
中优先级：     orange-500 (#F97316)
低优先级：     green-500
即将过期：     orange-500 (#F59E0B)
已过期：       red-500
页面背景：     gray-50   (#F9FAFB)
卡片背景：     white
文字主色：     gray-800  (#1F2937)
文字次要：     gray-500  (#6B7280)
```

---

## 2. 技术栈知识库

### 2.1 React 18

| 知识点 | 说明 |
|--------|------|
| 组件定义 | 使用函数组件 + 箭头函数或函数声明 |
| 状态管理 | `useState` 管理组件状态，`useContext` 管理全局状态 |
| 副作用 | `useEffect` 处理数据获取、订阅等副作用 |
| 自定义 Hook | 以 `use` 开头，封装可复用的状态逻辑 |
| 列表渲染 | 使用 `key` 属性（用唯一 ID，不用 index） |
| 条件渲染 | 三元运算符、`&&` 短路、提前 return |
| 路由 | `react-router-dom` v6，`<Routes>` + `<Route>` |

### 2.2 TypeScript

| 知识点 | 说明 |
|--------|------|
| 联合类型 | `type Status = 'TODO' \| 'IN_PROGRESS' \| 'DONE'` |
| 接口 | `interface Task { id: number; title: string; }` |
| 泛型 | `useState<Task[]>([])` |
| 可选属性 | `due_date?: string \| null` |
| 类型收窄 | `function isStatus(s: string): s is TaskStatus` |
| 严格模式 | `tsconfig.json` 中 `"strict": true` |
| 禁止 any | 用 `unknown` + 类型收窄替代 |

### 2.3 Vite

| 知识点 | 说明 |
|--------|------|
| 开发服务器 | `vite dev`，支持 HMR 热更新 |
| 代理配置 | `vite.config.ts` 中 `server.proxy` 转发 `/api` 请求 |
| 构建 | `vite build`，产出到 `dist/` |
| 环境变量 | `.env` 文件，`import.meta.env.VITE_XXX` 访问 |
| 代码分割 | `build.rollupOptions.output.manualChunks` |

### 2.4 Express

| 知识点 | 说明 |
|--------|------|
| 应用创建 | `const app = express()` |
| 中间件 | `app.use(cors())`、`app.use(express.json())` |
| 路由 | `app.get('/api/tasks', handler)` |
| 路由模块化 | `Router()` 创建子路由，`app.use('/api/tasks', router)` |
| 请求参数 | `req.params.id`（路径）、`req.query`（查询）、`req.body`（请求体） |
| 响应 | `res.json()`、`res.status(201).json()` |
| 错误处理 | `next(error)` 传递给错误中间件 |

### 2.5 SQLite + better-sqlite3

| 知识点 | 说明 |
|--------|------|
| 驱动 | `better-sqlite3`，同步 API |
| 连接 | `new Database(path)` |
| 执行 SQL | `db.exec(sql)` 执行多条 |
| 预编译 | `db.prepare(sql)` 创建预编译语句 |
| 查询 | `.all(...params)` 返回数组、`.get(...params)` 返回单条 |
| 写入 | `.run(...params)` 返回 `{ changes, lastInsertRowid }` |
| 外键 | `db.pragma('foreign_keys = ON')` 每次连接启用 |
| 参数化 | 使用 `?` 占位符，**严禁字符串拼接** |

### 2.6 Zod

| 知识点 | 说明 |
|--------|------|
| 字符串校验 | `z.string().min(1).max(100)` |
| 枚举校验 | `z.enum(['TODO', 'IN_PROGRESS', 'DONE'])` |
| 可选/默认 | `.optional().default('MEDIUM')` |
| 数字校验 | `z.number().int().positive()` |
| 对象校验 | `z.object({ title: z.string(), ... })` |
| 部分更新 | `schema.partial()` 所有字段变可选 |
| 解析 | `schema.safeParse(data)` 返回 `{ success, data/error }` |
| 查询参数 | `z.coerce.number()` 自动转换字符串为数字 |

### 2.7 Tailwind CSS

| 知识点 | 说明 |
|--------|------|
| 工具类 | `className="flex items-center gap-2 p-4"` |
| 响应式前缀 | `md:w-60`（768px+）、`lg:block`（1024px+） |
| 状态伪类 | `hover:bg-gray-100`、`focus:ring-2` |
| 自定义颜色 | `tailwind.config.js` 中 `theme.extend.colors` |
| 指令 | `@tailwind base; @tailwind components; @tailwind utilities;` |

### 2.8 其他依赖

| 库 | 用途 | 关键 API |
|----|------|----------|
| **axios** | HTTP 客户端 | `axios.create()`、拦截器、`response.data` |
| **react-router-dom** | 前端路由 | `<BrowserRouter>`、`<Routes>`、`useNavigate` |
| **recharts** | 图表 | `<PieChart>`、`<BarChart>`、`<Tooltip>` |
| **dayjs** | 日期处理 | `dayjs()`、`.diff()`、`.format()` |
| **@headlessui/react** | 无样式组件 | `<Dialog>`、`<Menu>`、`<Transition>` |
| **concurrently** | 并行命令 | `concurrently "cmd1" "cmd2"` |

---

## 3. 后端核心代码知识库

### 3.1 请求生命周期

```
客户端请求
    │
    ▼
app.ts 中间件链
    ├── cors()                    → 跨域处理
    ├── express.json()            → JSON 解析
    │
    ▼
routes/taskRoutes.ts
    ├── validate(schema)          → 参数校验（zod）
    │
    ▼
controllers/taskController.ts
    ├── 从 req 取参数
    ├── 调用 taskService
    ├── 用 successResponse() 包装
    └── try/catch → next(error)
    │
    ▼
services/taskService.ts
    ├── 业务逻辑
    ├── db.prepare().run/get/all  → 数据库操作
    └── 抛出 AppError / NotFoundError
    │
    ▼
middleware/errorHandler.ts
    ├── AppError → 返回对应状态码
    └── 未知错误 → 500
    │
    ▼
客户端收到 JSON 响应
```

### 3.2 后端分层职责

| 层 | 文件 | 做什么 | 不做什么 |
|----|------|--------|----------|
| Route | `taskRoutes.ts` | 定义路径 + 挂载校验中间件 | 写业务逻辑 |
| Controller | `taskController.ts` | 取参数、调 Service、返回响应 | 直接操作数据库 |
| Service | `taskService.ts` | 业务逻辑 + SQL 操作 | 处理 req/res 对象 |
| Middleware | `errorHandler.ts` | 统一错误处理 | 包含业务逻辑 |
| Database | `database.ts` | 连接管理、建表 | 包含业务判断 |

### 3.3 错误处理体系

```typescript
// 错误类继承链
Error
 └── AppError (statusCode, code, message)
      ├── NotFoundError     → 404, 'NOT_FOUND'
      ├── ValidationError   → 400, 'VALIDATION_ERROR'
      └── ConflictError     → 409, 'CONFLICT'

// 使用方式
throw new NotFoundError('任务');           // → 404 { code: 'NOT_FOUND', message: '任务不存在' }
throw new ValidationError('标题不能为空');  // → 400 { code: 'VALIDATION_ERROR', message: '...' }
throw new ConflictError('分类名称已存在');  // → 409 { code: 'CONFLICT', message: '...' }
```

### 3.4 统一响应格式

```json
// 成功（单个）
{ "success": true, "data": { ... }, "message": "操作成功" }

// 成功（列表）
{ "success": true, "data": [...], "total": 10 }

// 失败
{ "success": false, "error": { "code": "ERROR_CODE", "message": "描述" } }
```

### 3.5 参数校验流程

```
请求到达 → validate(schema) 中间件
    │
    ├── schema.safeParse(req.body) 或 safeParse(req.query)
    │
    ├── 成功 → req.body/query 被替换为解析后的数据 → next()
    │
    └── 失败 → 返回 400 { code: 'VALIDATION_ERROR', message: '...' }
```

---

## 4. 前端核心代码知识库

### 4.1 前端数据流

```
用户操作
    │
    ▼
组件（TaskItem / TaskForm）
    │ 调用
    ▼
自定义 Hook（useTasks）
    │ 调用
    ▼
API 模块（taskApi）
    │ 调用
    ▼
Axios 客户端（apiClient）
    │ HTTP 请求
    ▼
后端 API
    │ 响应
    ▼
Axios 拦截器（自动解包 response.data）
    │
    ▼
Hook 更新状态（setTasks）
    │
    ▼
组件重新渲染
    │
    ▼
Toast 提示用户
```

### 4.2 组件层级关系

```
App.tsx（路由配置）
├── Layout（整体布局）
│   ├── Header（顶部导航：Logo + 搜索 + 统计入口）
│   ├── Sidebar（侧边栏：状态筛选 + 分类列表）
│   │   └── CategoryList / CategoryForm
│   └── 主内容区（路由出口）
│       ├── TaskPage（任务列表页）
│       │   ├── TaskFilters（筛选工具栏 + 新建按钮）
│       │   ├── TaskList（任务列表）
│       │   │   └── TaskItem × N（单条任务卡片）
│       │   ├── TaskEmpty（空状态）
│       │   ├── TaskForm（创建/编辑模态框）
│       │   └── ConfirmDialog（删除确认）
│       └── StatsPage（统计面板页）
│           ├── StatsOverview（概览卡片）
│           ├── StatusChart（状态分布图）
│           └── CategoryChart（分类分布图）
│
├── 通用组件
│   ├── Modal（模态框容器）
│   ├── Toast（消息提示）
│   ├── Badge（状态/优先级徽章）
│   └── Loading（加载状态）
```

### 4.3 Hook 设计

```typescript
// useTasks — 任务数据管理
{
  tasks: Task[],          // 任务列表
  loading: boolean,       // 加载状态
  error: string | null,   // 错误信息
  fetchTasks(filters?),   // 获取列表
  createTask(data),       // 创建
  updateTask(id, data),   // 更新
  deleteTask(id),         // 删除
  toggleStatus(id, cur),  // 切换状态
}

// useCategories — 分类数据管理
{
  categories: Category[],
  fetchCategories(),
  createCategory(name),
  updateCategory(id, name),
  deleteCategory(id),
}

// useStats — 统计数据
{
  stats: StatsData,
  fetchStats(),
}

// useToast — 消息提示
{
  toasts: Toast[],
  addToast(message, type),
  removeToast(id),
}
```

### 4.4 前端工具函数

```typescript
// constants.ts — 状态映射
STATUS_MAP = {
  TODO:        { label: '待办',   color: 'bg-blue-100 text-blue-800',   next: 'IN_PROGRESS' },
  IN_PROGRESS: { label: '进行中', color: 'bg-yellow-100 text-yellow-800', next: 'DONE' },
  DONE:        { label: '已完成', color: 'bg-green-100 text-green-800',  next: 'TODO' },
}

PRIORITY_MAP = {
  HIGH:   { label: '高', color: 'text-red-500',    dot: 'bg-red-500' },
  MEDIUM: { label: '中', color: 'text-orange-500', dot: 'bg-orange-500' },
  LOW:    { label: '低', color: 'text-green-500',  dot: 'bg-green-500' },
}

// dateHelper.ts — 截止日期状态判断
getDueDateStatus(dueDate, taskStatus) → { text, className }
// > 7天: 灰色 | ≤7天: 橙色 | 已过期+未完成: 红色+"已过期" | 已完成: 灰色
```

---

## 5. 数据库知识库

### 5.1 表结构

```sql
-- categories 分类表
CREATE TABLE categories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,  -- 自增主键
  name       VARCHAR(20) NOT NULL UNIQUE,        -- 分类名（唯一）
  is_builtin INTEGER NOT NULL DEFAULT 0,         -- 1=预置 0=自定义
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- tasks 任务表
CREATE TABLE tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       VARCHAR(100) NOT NULL,             -- 标题（必填，≤100字符）
  description TEXT DEFAULT '',                   -- 描述（可选）
  status      VARCHAR(20) NOT NULL DEFAULT 'TODO'
                CHECK (status IN ('TODO','IN_PROGRESS','DONE')),
  priority    VARCHAR(10) NOT NULL DEFAULT 'MEDIUM'
                CHECK (priority IN ('LOW','MEDIUM','HIGH')),
  category_id INTEGER DEFAULT 1,                -- 外键 → categories.id
  due_date    DATE,                              -- 截止日期（可为空）
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET DEFAULT
);
```

### 5.2 关系说明

```
categories 1 ←→ N tasks
  └── 删除分类时，关联任务的 category_id 设为 1（默认分类）
  └── 预置分类（is_builtin=1）不可删除
```

### 5.3 预置数据

```sql
INSERT INTO categories (name, is_builtin) VALUES
  ('默认', 1),  -- id=1，外键默认值指向此条
  ('工作', 1),  -- id=2
  ('学习', 1),  -- id=3
  ('生活', 1);  -- id=4
```

### 5.4 常用查询

```sql
-- 任务列表（含分类名）
SELECT t.*, c.name AS category_name
FROM tasks t LEFT JOIN categories c ON t.category_id = c.id
WHERE t.status = ?
ORDER BY t.created_at DESC;

-- 按优先级排序（自定义排序）
ORDER BY CASE t.priority
  WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 3
END ASC;

-- 关键词搜索
WHERE t.title LIKE ?;  -- 参数: '%关键词%'

-- 统计概览
SELECT status, COUNT(*) AS count FROM tasks GROUP BY status;

-- 逾期任务数
SELECT COUNT(*) FROM tasks
WHERE due_date < DATE('now') AND status != 'DONE';

-- 今日完成数
SELECT COUNT(*) FROM tasks
WHERE status = 'DONE' AND DATE(updated_at) = DATE('now');

-- 分类统计
SELECT c.name, COUNT(t.id) AS count
FROM categories c LEFT JOIN tasks t ON t.category_id = c.id
GROUP BY c.id ORDER BY count DESC;
```

### 5.5 数据库初始化流程

```
应用启动 → import database.ts
    │
    ├── 创建 data/ 目录（如不存在）
    ├── new Database(path) — 自动创建 .db 文件
    ├── PRAGMA foreign_keys = ON
    ├── CREATE TABLE IF NOT EXISTS categories ...
    ├── CREATE TABLE IF NOT EXISTS tasks ...
    └── IF categories 为空 → INSERT 预置分类
```

---

## 6. API 接口知识库

### 6.1 接口总表

| # | 方法 | 路径 | 说明 | 状态码 |
|---|------|------|------|--------|
| 1 | GET | `/api/tasks` | 任务列表（筛选/排序/搜索） | 200 |
| 2 | POST | `/api/tasks` | 创建任务 | 201 |
| 3 | GET | `/api/tasks/:id` | 任务详情 | 200 |
| 4 | PUT | `/api/tasks/:id` | 更新任务 | 200 |
| 5 | PATCH | `/api/tasks/:id/status` | 切换状态 | 200 |
| 6 | DELETE | `/api/tasks/:id` | 删除任务 | 200 |
| 7 | GET | `/api/categories` | 分类列表 | 200 |
| 8 | POST | `/api/categories` | 创建分类 | 201 |
| 9 | PUT | `/api/categories/:id` | 更新分类 | 200 |
| 10 | DELETE | `/api/categories/:id` | 删除分类 | 200 |
| 11 | GET | `/api/stats` | 统计数据 | 200 |

### 6.2 查询参数（GET /api/tasks）

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `status` | string | TODO / IN_PROGRESS / DONE | `?status=TODO` |
| `category_id` | number | 分类 ID | `?category_id=2` |
| `priority` | string | LOW / MEDIUM / HIGH | `?priority=HIGH` |
| `keyword` | string | 标题模糊搜索 | `?keyword=PRD` |
| `sort_by` | string | created_at / priority / due_date | `?sort_by=priority` |
| `sort_order` | string | asc / desc（默认 desc） | `?sort_order=asc` |

### 6.3 请求体示例

```json
// POST /api/tasks — 创建任务
{
  "title": "完成PRD文档",           // 必填，1~100字符
  "description": "撰写完整需求文档",  // 可选，≤1000字符
  "priority": "HIGH",               // 可选，默认 MEDIUM
  "category_id": 2,                 // 可选，默认 1
  "due_date": "2026-07-15"          // 可选，YYYY-MM-DD
}

// PATCH /api/tasks/:id/status — 切换状态
{
  "status": "IN_PROGRESS"           // TODO / IN_PROGRESS / DONE
}

// POST /api/categories — 创建分类
{
  "name": "阅读"                    // 必填，1~20字符，不可重复
}
```

### 6.4 错误码速查

| 错误码 | HTTP 状态码 | 触发场景 |
|--------|------------|----------|
| `VALIDATION_ERROR` | 400 | 参数校验失败（空标题、超长、非法枚举值等） |
| `NOT_FOUND` | 404 | 任务/分类不存在 |
| `CONFLICT` | 409 | 分类名称重复 |
| `BUILTIN_ERROR` | 400 | 尝试删除预置分类 |
| `INTERNAL_ERROR` | 500 | 未预期的服务器错误 |

---

## 7. 业务逻辑知识库

### 7.1 任务状态流转规则

```
TODO ←→ IN_PROGRESS ←→ DONE
  ↑                      │
  └──────────────────────┘
  （任意状态之间可自由切换）
```

- 快捷切换：点击徽章循环 TODO → IN_PROGRESS → DONE → TODO
- 编辑表单：可选择任意状态
- 切换后立即生效，无需确认
- 状态变更后 updated_at 自动更新

### 7.2 分类删除与任务迁移

```
删除自定义分类
    │
    ├── 检查是否有任务属于该分类
    ├── 弹出提示："该分类下的 N 个任务将移至'默认'分类"
    ├── 确认后：UPDATE tasks SET category_id = 1 WHERE category_id = ?
    └── DELETE FROM categories WHERE id = ?

预置分类（is_builtin=1）→ 不可删除，操作被拒绝
```

### 7.3 截止日期提醒逻辑

```typescript
function getDueDateStatus(dueDate, taskStatus) {
  if (!dueDate || taskStatus === 'DONE') return 'normal';  // 不提醒

  const diff = dayjs(dueDate).diff(dayjs().startOf('day'), 'day');

  if (diff < 0)  return 'overdue';   // 红色 + "已过期"
  if (diff <= 7) return 'warning';   // 橙色
  return 'normal';                    // 灰色
}
```

### 7.4 统计计算逻辑

```
total          = COUNT(*) FROM tasks
by_status      = GROUP BY status → { TODO: n, IN_PROGRESS: n, DONE: n }
completion_rate = DONE数 / total × 100（total=0 时为 0）
today_completed = COUNT WHERE status='DONE' AND DATE(updated_at)=DATE('now')
overdue_count   = COUNT WHERE due_date < DATE('now') AND status != 'DONE'
by_category     = LEFT JOIN categories GROUP BY category → { name: count }
```

### 7.5 搜索防抖逻辑

```
用户输入 → 每次按键触发 state 更新
    │
    └── useDebounce(value, 300ms)
            │
            └── 300ms 内无新输入 → 触发 API 请求
```

---

## 8. 常见问题与解决方案

### 8.1 开发环境问题

| 问题 | 原因 | 解决 |
|------|------|------|
| `npm run dev` 后端报错端口占用 | 3001 端口被其他进程占用 | 关闭占用进程或修改 PORT 环境变量 |
| 前端请求 API 返回 404 | Vite 代理未生效 | 确认 `vite.config.ts` 中 proxy 配置正确 |
| 数据库文件不存在 | 未启动过后端 | 启动后端后自动生成 `server/data/taskflow.db` |
| TypeScript 类型报错 | 缺少 @types 包 | `npm install -D @types/express @types/cors` |
| Tailwind 样式不生效 | content 路径配置错误 | 检查 `tailwind.config.js` 中 content 包含所有文件路径 |
| better-sqlite3 安装失败 | 缺少编译工具 | Windows: `npm install -g windows-build-tools` |
| 修改代码后页面不更新 | HMR 失效 | 重启前端开发服务器 |
| 前端路由刷新 404 | Nginx/服务器未配置 fallback | 配置 `try_files $uri /index.html` |

### 8.2 功能实现问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 创建任务后列表不刷新 | 未更新本地状态 | createTask 成功后 `setTasks(prev => [newTask, ...prev])` |
| 状态切换后颜色不变 | 未使用 STATUS_MAP 映射 | 使用 `STATUS_MAP[task.status].color` 动态设置 className |
| 筛选后搜索不准确 | 筛选和搜索逻辑冲突 | 组合筛选条件，同时传给 API |
| 删除分类后任务分类没变 | 未处理外键迁移 | Service 层先 `UPDATE tasks SET category_id=1` 再删分类 |
| 统计数据和列表不一致 | 未重新获取统计 | 每次操作后同时刷新 tasks 和 stats |
| 日期显示差一天 | 时区问题 | 使用 `YYYY-MM-DD` 字符串格式，不做 Date 对象转换 |

### 8.3 部署问题

| 问题 | 原因 | 解决 |
|------|------|------|
| Docker 构建失败 | .dockerignore 未排除 node_modules | 检查 .dockerignore 配置 |
| 容器重启后数据丢失 | Volume 未挂载 | `docker-compose.yml` 中配置 `volumes: taskflow-data:/app/data` |
| Nginx 502 | Express 未启动或端口不对 | 检查 PM2 进程状态和端口配置 |
| 前端页面空白 | 构建产物路径错误 | 确认 Nginx root 指向 `client/dist` |
| API 返回 CORS 错误 | 生产环境未配置 CORS | Express 中 `cors({ origin: '*' })` 或指定域名 |

---

## 9. 命令速查手册

### 9.1 开发命令

```bash
# 项目初始化
npm create vite@latest client -- --template react-ts
cd server && npm init -y

# 安装依赖
npm install express better-sqlite3 cors zod
npm install -D typescript tsx @types/express @types/cors @types/better-sqlite3

# 开发运行
npm run dev                  # 一键启动（根目录）
cd server && npx tsx src/index.ts    # 单独启动后端
cd client && npx vite               # 单独启动前端

# 构建
cd client && npx vite build         # 前端构建
cd server && npx tsc                # 后端编译（可选）
```

### 9.2 测试命令

```bash
cd server && npx vitest run         # 运行全部单元测试
cd server && npx vitest watch       # 监听模式
cd server && npx vitest run -t "create"  # 运行匹配名称的用例
```

### 9.3 数据库命令

```bash
# 重置数据库
rm server/data/taskflow.db          # 删除后重启自动重建

# 查看数据（需安装 sqlite3 CLI）
sqlite3 server/data/taskflow.db
  .tables                           # 查看所有表
  SELECT * FROM categories;         # 查看分类
  SELECT * FROM tasks;              # 查看任务
  .schema tasks                     # 查看表结构
  .quit                             # 退出

# 备份
cp server/data/taskflow.db server/data/backup-$(date +%Y%m%d).db
```

### 9.4 部署命令

```bash
# PM2
pm2 start ecosystem.config.js       # 启动
pm2 restart taskflow                # 重启
pm2 stop taskflow                   # 停止
pm2 logs taskflow                   # 日志
pm2 monit                           # 监控
pm2 save                            # 保存进程列表

# Docker
docker compose up -d --build        # 构建并启动
docker compose logs -f              # 查看日志
docker compose down                 # 停止并移除
docker compose ps                   # 查看状态

# Nginx
sudo nginx -t                       # 测试配置
sudo systemctl reload nginx         # 重载配置
sudo systemctl status nginx         # 查看状态

# 冒烟测试
bash scripts/smoke-test.sh http://localhost:3001
```

---

## 10. 配置模板速查

### 10.1 tsconfig.json（后端）

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 10.2 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
});
```

### 10.3 tailwind.config.js

```javascript
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

### 10.4 .prettierrc

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

### 10.5 .gitignore

```gitignore
node_modules/
client/dist/
server/dist/
server/data/*.db
.env
.env.local
.DS_Store
Thumbs.db
*.log
```

### 10.6 ecosystem.config.js（PM2）

```javascript
module.exports = {
  apps: [{
    name: 'taskflow',
    script: 'npx',
    args: 'tsx server/src/index.ts',
    cwd: '/opt/taskflow',
    instances: 1,
    autorestart: true,
    max_memory_restart: '256M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      DB_PATH: '/opt/taskflow/data/taskflow.db',
    },
    error_file: '/opt/taskflow/logs/pm2-error.log',
    out_file: '/opt/taskflow/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }],
};
```

---

## 11. 代码片段速查

### 11.1 后端：创建任务 Service

```typescript
create(data: Partial<Task>): Task {
  const { title, description, priority, category_id, due_date } = data;
  const result = db.prepare(`
    INSERT INTO tasks (title, description, priority, category_id, due_date)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, description || '', priority || 'MEDIUM', category_id || 1, due_date || null);
  return this.getById(Number(result.lastInsertRowid));
}
```

### 11.2 后端：动态查询构建

```typescript
getAll(params: TaskQueryParams): Task[] {
  const conditions: string[] = [];
  const values: any[] = [];
  if (params.status) { conditions.push('t.status = ?'); values.push(params.status); }
  if (params.category_id) { conditions.push('t.category_id = ?'); values.push(params.category_id); }
  if (params.keyword) { conditions.push('t.title LIKE ?'); values.push(`%${params.keyword}%`); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return db.prepare(`SELECT t.*, c.name as category_name FROM tasks t LEFT JOIN categories c ON t.category_id = c.id ${where} ORDER BY t.created_at DESC`).all(...values) as Task[];
}
```

### 11.3 前端：API 封装

```typescript
export const taskApi = {
  getAll: (params?: Record<string, any>) => apiClient.get('/tasks', { params }),
  create: (data: TaskFormData) => apiClient.post<Task>('/tasks', data),
  update: (id: number, data: Partial<TaskFormData>) => apiClient.put<Task>(`/tasks/${id}`, data),
  updateStatus: (id: number, status: TaskStatus) => apiClient.patch<Task>(`/tasks/${id}/status`, { status }),
  delete: (id: number) => apiClient.delete(`/tasks/${id}`),
};
```

### 11.4 前端：防抖 Hook

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

### 11.5 前端：截止日期状态判断

```typescript
function getDueDateStatus(dueDate: string | null, taskStatus: TaskStatus) {
  if (!dueDate || taskStatus === 'DONE') return { text: dueDate, className: 'text-gray-500' };
  const diff = dayjs(dueDate).diff(dayjs().startOf('day'), 'day');
  if (diff < 0) return { text: `${dueDate}（已过期）`, className: 'text-red-500 font-semibold' };
  if (diff <= 7) return { text: dueDate, className: 'text-orange-500 font-medium' };
  return { text: dueDate, className: 'text-gray-500' };
}
```

### 11.6 后端：校验中间件

```typescript
export function validate(schema: ZodSchema, source: 'body' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(source === 'body' ? req.body : req.query);
    if (!result.success) {
      const message = result.error.errors.map(e => e.message).join('; ');
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message } });
    }
    req[source] = result.data;
    next();
  };
}
```

### 11.7 后端：全局错误处理

```typescript
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, error: { code: err.code, message: err.message } });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } });
}
```

---

## 12. 决策记录（ADR）

### ADR-001：选择 SQLite 而非 PostgreSQL

- **背景**：需要选择数据库
- **决策**：使用 SQLite（better-sqlite3）
- **理由**：零配置、文件存储、学习成本低、个人工具无需多用户并发
- **代价**：不支持多实例并发写入、不适合高并发场景

### ADR-002：选择 Monorepo 而非多仓库

- **背景**：前后端代码组织方式
- **决策**：单仓库（client/ + server/）
- **理由**：降低新手管理多个仓库的认知负担、统一版本管理
- **代价**：仓库体积较大、CI/CD 配置需同时处理前后端

### ADR-003：选择 React Context 而非 Redux

- **背景**：全局状态管理方案
- **决策**：React Context + useReducer
- **理由**：项目规模适中，Context 足够；减少依赖和学习成本
- **代价**：大量消费者时可能有性能问题（本项目不存在）

### ADR-004：选择 Zod 而非 Joi

- **背景**：请求参数校验库
- **决策**：使用 Zod
- **理由**：TypeScript 类型推导原生支持、前后端可共享 Schema
- **代价**：社区生态不如 Joi 成熟

### ADR-005：选择 tsx 而非 ts-node

- **背景**：开发阶段运行 TypeScript
- **决策**：使用 tsx
- **理由**：无需配置、启动速度快、支持 ESM 和 CJS
- **代价**：生产环境建议编译后运行

### ADR-006：视觉提醒而非推送通知

- **背景**：截止日期提醒方式
- **决策**：v1.0 使用颜色变化（视觉提醒）
- **理由**：实现简单、无需额外权限和后台服务
- **代价**：用户不打开页面则无法感知

---

## 13. 术语表

| 术语 | 英文 | 含义 |
|------|------|------|
| CRUD | Create/Read/Update/Delete | 增删改查四种基本操作 |
| RESTful | Representational State Transfer | HTTP 接口设计风格 |
| Monorepo | Monolithic Repository | 单仓库管理多项目 |
| Middleware | 中间件 | 请求处理链中的可插拔处理函数 |
| Controller | 控制器 | 接收请求、调用服务、返回响应的层 |
| Service | 服务层 | 封装业务逻辑的层 |
| Schema | 校验模式 | 定义数据结构和校验规则的对象 |
| Hook | React Hook | 在函数组件中使用状态和副作用的机制 |
| Context | React Context | React 跨组件传递数据的机制 |
| HMR | Hot Module Replacement | 模块热替换，修改代码后无需刷新页面 |
| SPA | Single Page Application | 单页面应用 |
| SSR | Server-Side Rendering | 服务端渲染（本项目未使用） |
| CORS | Cross-Origin Resource Sharing | 跨域资源共享 |
| XSS | Cross-Site Scripting | 跨站脚本攻击 |
| SQL 注入 | SQL Injection | 通过拼接 SQL 进行的攻击 |
| PM2 | Process Manager 2 | Node.js 进程管理工具 |
| Volume | Docker Volume | Docker 数据持久化机制 |
| CI/CD | Continuous Integration/Delivery | 持续集成/持续部署 |
| ADR | Architecture Decision Record | 架构决策记录 |
| Toast | 消息提示 | 自动消失的轻量通知 |
| 防抖 | Debounce | 限制函数执行频率的技术 |
| 幂等 | Idempotent | 多次执行结果相同的操作 |

---

> 本知识库为 TaskFlow 项目的一站式参考手册，涵盖技术栈、核心代码、业务逻辑、配置模板、常见问题等全部关键知识。开发过程中遇到任何问题，优先在此文档中查找答案。
