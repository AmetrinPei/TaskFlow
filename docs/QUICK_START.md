# TaskFlow — 快速上手指南

> 版本：v1.0  
> 最后更新：2026-07-07  
> 本文档面向编程新手，用最简洁的步骤帮你从零开始跑通整个项目

---

## 目录

1. [5 分钟跑起来](#1-5-分钟跑起来)
2. [项目全貌速览](#2-项目全貌速览)
3. [代码从哪开始看](#3-代码从哪开始看)
4. [理解后端：一个请求的旅程](#4-理解后端一个请求的旅程)
5. [理解前端：从页面到数据](#5-理解前端从页面到数据)
6. [开发流程：5 天计划](#6-开发流程5-天计划)
7. [核心概念速学](#7-核心概念速学)
8. [动手写第一个功能](#8-动手写第一个功能)
9. [常见坑与排错](#9-常见坑与排错)
10. [学习资源与求助路径](#10-学习资源与求助路径)
11. [每日检查清单](#11-每日检查清单)
12. [文档导航](#12-文档导航)

---

## 1. 5 分钟跑起来

### 前置条件

只需要两样东西：

| 工具 | 下载地址 | 验证命令 |
|------|----------|----------|
| **Node.js** 18+ | https://nodejs.org/ （下载 LTS 版本） | `node -v` |
| **Git** | https://git-scm.com/ | `git --version` |

### 三步启动

```bash
# 第 1 步：进入项目目录
cd d:\workspace\task\Qoder

# 第 2 步：安装所有依赖
cd server && npm install && cd ..\client && npm install && cd ..

# 第 3 步：一键启动前后端
npm run dev
```

看到以下输出说明成功：

```
🚀 TaskFlow Server running on http://localhost:3001   ← 后端启动成功
  VITE v5.x  ready in xxx ms                         ← 前端启动成功
  ➜  Local:   http://localhost:5173/
```

### 打开浏览器

访问 **http://localhost:5173** ，你应该看到 TaskFlow 的首页。

> 如果页面空白或有报错，直接跳到第 9 节「常见坑与排错」。

---

## 2. 项目全貌速览

### 这个项目是什么？

一个**个人任务管理系统**——你可以创建任务、设置优先级和截止日期、分类管理、查看统计。

### 技术栈一览

```
前端：React + TypeScript + Vite + Tailwind CSS
后端：Express + TypeScript + SQLite
工具：Zod（校验）、Recharts（图表）、Day.js（日期）
```

### 项目结构（只看最重要的）

```
taskflow/
├── client/          ← 前端代码（React 页面、组件、样式）
├── server/          ← 后端代码（API 接口、数据库、业务逻辑）
└── docs/            ← 项目文档（你正在看的这些）
```

### 9 个功能模块

```
任务管理：创建 → 查看 → 编辑 → 删除 → 状态流转（待办/进行中/已完成）
属性管理：分类（工作/学习/生活）+ 优先级（高/中/低）
提醒机制：截止日期变色提醒
数据看板：统计面板（数字 + 图表）
```

---

## 3. 代码从哪开始看

### 后端：从入口开始

```
server/src/index.ts          ← 从这里启动，只有几行代码
       │
       ▼
server/src/app.ts            ← Express 配置，看看用了哪些中间件
       │
       ▼
server/src/routes/index.ts   ← 所有 API 路径都在这里注册
       │
       ▼
server/src/services/taskService.ts  ← 核心业务逻辑，增删改查都在这里
```

**阅读建议**：先看 `index.ts`（5 行），再看 `app.ts`（10 行），然后跟着路由找到 Controller，再找到 Service。一条线串下来，整个后端就理解了。

### 前端：从路由开始

```
client/src/App.tsx           ← 路由配置，看看有哪些页面
       │
       ▼
client/src/pages/TaskPage.tsx ← 首页，看看页面怎么组合组件
       │
       ▼
client/src/components/tasks/TaskList.tsx  ← 任务列表组件
       │
       ▼
client/src/hooks/useTasks.ts  ← 数据怎么获取，状态怎么管理
       │
       ▼
client/src/api/taskApi.ts     ← 最终调用后端 API
```

**阅读建议**：先看 `App.tsx` 了解有哪些页面，然后看 `TaskPage.tsx` 了解页面由哪些组件组成，再看 `useTasks.ts` 了解数据怎么来。

---

## 4. 理解后端：一个请求的旅程

当你点击"创建任务"按钮时，发生了什么？

```
你点击"创建"
    │
    ▼
① 前端 TaskForm.tsx
   收集表单数据 → 调用 taskApi.create(data)
    │
    ▼
② 前端 axios
   发送 POST /api/tasks 请求
    │
    ▼  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ 网络 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
    │
    ▼
③ 后端 Express 中间件
   cors() → express.json() → 解析请求体
    │
    ▼
④ 后端路由 taskRoutes.ts
   匹配 POST /api/tasks → 先经过 validate(schema) 校验
    │
    ├── 校验失败 → 返回 400 错误
    └── 校验通过 → 继续
    │
    ▼
⑤ 后端控制器 taskController.ts
   从 req.body 取数据 → 调用 taskService.create(data)
    │
    ▼
⑥ 后端服务 taskService.ts
   执行 SQL: INSERT INTO tasks (title, ...) VALUES (?, ...)
    │
    ▼
⑦ SQLite 数据库
   数据写入 taskflow.db 文件
    │
    ▼
⑧ 原路返回
   Service 返回新任务 → Controller 包装成 JSON → Express 发回响应
    │
    ▼  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ 网络 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
    │
    ▼
⑨ 前端 axios 拦截器
   解包响应数据
    │
    ▼
⑩ 前端 useTasks Hook
   更新任务列表状态 → React 重新渲染 → 新任务出现在列表中
    │
    ▼
⑪ Toast 提示 "创建成功"
```

**关键理解**：后端是分层的，每一层只做一件事：

| 层 | 文件 | 做什么 |
|----|------|--------|
| 路由 | `taskRoutes.ts` | 匹配 URL 路径 |
| 校验 | `validate(schema)` | 检查参数是否合法 |
| 控制器 | `taskController.ts` | 接收请求，返回响应 |
| 服务 | `taskService.ts` | 业务逻辑 + 数据库操作 |
| 数据库 | `database.ts` | 存储数据 |

---

## 5. 理解前端：从页面到数据

### 页面是怎么拼出来的？

```
App.tsx（路由）
└── Layout.tsx（布局骨架）
    ├── Header.tsx（顶部：Logo + 搜索框）
    ├── Sidebar.tsx（左侧：状态筛选 + 分类列表）
    └── 主内容区
        └── TaskPage.tsx（任务列表页）
            ├── TaskFilters.tsx（筛选工具栏 + "新建"按钮）
            ├── TaskList.tsx（任务列表）
            │   └── TaskItem.tsx × N（每条任务卡片）
            ├── TaskEmpty.tsx（没任务时的空状态）
            └── TaskForm.tsx（创建/编辑弹窗）
```

### 数据是怎么来的？

```
TaskPage 组件
    │ 调用
    ▼
useTasks() Hook  ← 封装了所有任务相关的数据逻辑
    │ 内部调用
    ▼
taskApi.getAll()  ← 发送 HTTP 请求
    │
    ▼
axios → 后端 API → 返回 JSON
    │
    ▼
Hook 拿到数据 → setTasks(data) → 组件重新渲染
```

**关键理解**：组件负责"展示"，Hook 负责"数据"。这是前端最重要的分离原则。

---

## 6. 开发流程：5 天计划

### 总览

```
Day 1          Day 2          Day 3          Day 4          Day 5
基础搭建        后端 API       前端页面        前后端联调      优化打磨
──────────────────────────────────────────────────────────────────────
初始化项目      类型定义        类型/常量       Hook 封装       分类管理
配置 TS        分类 CRUD       布局组件        CRUD 对接       截止日期提醒
配置 Tailwind   任务 CRUD       列表/表单       筛选搜索        响应式
数据库建表      筛选排序搜索     模态框/Toast    状态切换        边界处理
Express 框架    错误处理        组件渲染        统计面板        回归测试
```

### Day 1 详细步骤

| # | 做什么 | 怎么做 | 完成标志 |
|---|--------|--------|----------|
| 1 | 创建项目结构 | 建 `client/` 和 `server/` 目录 | 目录存在 |
| 2 | 配置 TypeScript | 写 `tsconfig.json`，开启 `strict: true` | 无编译错误 |
| 3 | 配置 Tailwind | 安装依赖，写 `tailwind.config.js` | `text-red-500` 生效 |
| 4 | 初始化数据库 | 写 `config/database.ts`，建表 + 预置分类 | `.db` 文件生成 |
| 5 | 搭建 Express | 写 `app.ts` + `index.ts` + 错误中间件 | 访问 3001 有响应 |
| 6 | 配置代理 | `vite.config.ts` 中 proxy 转发 `/api` | 前端请求能到后端 |

### Day 2 核心：写后端 API

**开发顺序很重要**：

```
1. 先写类型定义（types/index.ts）
2. 再写校验规则（schemas/taskSchema.ts）
3. 然后写业务逻辑（services/taskService.ts）
4. 接着写控制器（controllers/taskController.ts）
5. 最后写路由（routes/taskRoutes.ts）
```

**每写完一个接口就测试**：

```bash
# 用 curl 测试
curl http://localhost:3001/api/categories          # 获取分类
curl -X POST http://localhost:3001/api/tasks \     # 创建任务
  -H "Content-Type: application/json" \
  -d '{"title":"测试任务"}'
```

### Day 3 核心：写前端页面

**开发顺序**：

```
1. 先写类型和常量（types/ + utils/constants.ts）
2. 再写布局骨架（Layout + Header + Sidebar）
3. 然后写列表和卡片（TaskList + TaskItem），先用假数据
4. 接着写表单弹窗（TaskForm + Modal）
5. 最后写通用组件（ConfirmDialog + Toast）
```

### Day 4 核心：联调

```
1. 写 useTasks Hook，对接 API
2. 把假数据替换为真实 API 数据
3. 实现筛选、搜索、排序
4. 实现状态快捷切换
5. 写统计面板
```

### Day 5 核心：打磨

```
1. 分类管理完整对接
2. 截止日期颜色提醒
3. 响应式适配（平板端）
4. Loading、空状态、错误提示
5. 完整流程回归测试
```

---

## 7. 核心概念速学

### 7.1 Express 路由（后端怎么接收请求）

```typescript
// 定义一个 GET 接口
router.get('/tasks', (req, res) => {
  // req.query → 查询参数 ?status=TODO
  // req.params → 路径参数 /tasks/:id
  // req.body → 请求体（POST/PUT 的数据）

  const tasks = taskService.getAll(req.query);
  res.json({ success: true, data: tasks });
});
```

### 7.2 React 组件（前端怎么展示页面）

```typescript
// 一个最简单的任务卡片组件
function TaskItem({ task, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
      <span className="font-medium">{task.title}</span>
      <button onClick={() => onDelete(task.id)} className="text-red-500">
        删除
      </button>
    </div>
  );
}
```

### 7.3 useState（前端怎么管理状态）

```typescript
// 声明一个状态变量
const [tasks, setTasks] = useState<Task[]>([]);

// 读取：直接用 tasks
// 修改：调用 setTasks
setTasks(prev => [...prev, newTask]);  // 追加一条
setTasks(prev => prev.filter(t => t.id !== id));  // 删除一条
```

### 7.4 useEffect（前端怎么获取数据）

```typescript
// 组件加载时获取数据
useEffect(() => {
  fetchTasks();  // 调用 API 获取任务列表
}, []);          // 空数组 = 只在组件首次加载时执行

// 筛选条件变化时重新获取
useEffect(() => {
  fetchTasks(filters);
}, [filters]);   // filters 变化时重新执行
```

### 7.5 SQL 查询（数据库怎么存取）

```sql
-- 查询全部任务（含分类名）
SELECT t.*, c.name AS category_name
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
ORDER BY t.created_at DESC;

-- 插入一条任务
INSERT INTO tasks (title, priority, category_id)
VALUES ('新任务', 'HIGH', 2);

-- 更新任务状态
UPDATE tasks SET status = 'DONE', updated_at = CURRENT_TIMESTAMP WHERE id = 1;

-- 删除任务
DELETE FROM tasks WHERE id = 1;
```

---

## 8. 动手写第一个功能

### 练习：添加一个"获取单个任务详情"的接口

**第 1 步：写路由**（`server/src/routes/taskRoutes.ts`）

```typescript
// 添加这一行
router.get('/:id', taskController.getById);
```

**第 2 步：写控制器**（`server/src/controllers/taskController.ts`）

```typescript
// 在 taskController 对象中添加
async getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const task = taskService.getById(id);
    res.json(successResponse(task));
  } catch (error) {
    next(error);
  }
},
```

**第 3 步：写服务**（`server/src/services/taskService.ts`）

```typescript
// 这个方法其实已经存在了！
// taskService.getById(id) 已经实现
```

**第 4 步：测试**

```bash
# 先创建一个任务
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"我的第一个任务"}'
# 记下返回的 id

# 然后查询
curl http://localhost:3001/api/tasks/1
# 应该返回该任务的详细信息
```

**恭喜你完成了第一个后端功能！**

---

## 9. 常见坑与排错

### 启动问题

| 现象 | 原因 | 解决 |
|------|------|------|
| `npm install` 报错 | 网络问题 | 换淘宝镜像：`npm config set registry https://registry.npmmirror.com` |
| `better-sqlite3` 安装失败 | 缺少编译工具 | `npm install -g windows-build-tools` |
| 端口 3001 被占用 | 其他程序占用 | `netstat -ano \| findstr :3001` 找到进程并关闭 |
| 前端页面空白 | 后端没启动 | 确认两个终端都在运行 |

### 功能问题

| 现象 | 原因 | 解决 |
|------|------|------|
| API 返回 404 | 路径写错 / 后端没启动 | 检查路由路径，确认后端在运行 |
| 创建任务后列表不刷新 | 没更新本地状态 | `setTasks(prev => [newTask, ...prev])` |
| 状态切换后颜色不变 | 没用 STATUS_MAP | 用 `STATUS_MAP[task.status].color` |
| Tailwind 样式不生效 | 类名写错 / 配置问题 | 检查 `tailwind.config.js` 的 content 路径 |
| 页面刷新后 404 | 前端路由问题 | Nginx 配 `try_files $uri /index.html` |

### 数据库问题

| 现象 | 原因 | 解决 |
|------|------|------|
| 数据库文件不存在 | 没启动过后端 | 启动后端自动生成 |
| 数据不对 / 想重置 | 测试数据混乱 | 删除 `server/data/taskflow.db`，重启 |
| 外键不生效 | 未启用外键检查 | `database.ts` 中 `db.pragma('foreign_keys = ON')` |

---

## 10. 学习资源与求助路径

### 遇到问题怎么办？

```
遇到问题
    │
    ├── 第 1 步：查本文档第 9 节（常见坑）
    │
    ├── 第 2 步：查 FAQ 文档（docs/FAQ.md）
    │
    ├── 第 3 步：查知识库（docs/KNOWLEDGE_BASE.md）
    │
    ├── 第 4 步：看报错信息 → 复制关键错误 → 搜索引擎
    │
    ├── 第 5 步：查官方文档
    │   ├── React: https://react.dev
    │   ├── Express: https://expressjs.com
    │   ├── Tailwind: https://tailwindcss.com/docs
    │   ├── TypeScript: https://www.typescriptlang.org/docs
    │   └── Vite: https://vitejs.dev
    │
    └── 第 6 步：问 AI 助手（把报错信息和相关代码发给它）
```

### 技术栈学习顺序

如果你是纯新手，建议按以下顺序学习：

```
1. HTML + CSS + JavaScript 基础（前提）
       │
2. TypeScript 基础（类型、接口、泛型）
       │
3. React 基础（组件、Props、State、Hook）
       │
4. Express 基础（路由、中间件、请求响应）
       │
5. SQLite 基础（建表、CRUD、JOIN）
       │
6. Tailwind CSS（边用边查，不需要提前学完）
```

---

## 11. 每日检查清单

### Day 1 完成后你应该能：

- [ ] `npm run dev` 一键启动前后端
- [ ] 浏览器访问 `localhost:5173` 看到页面（即使是空白）
- [ ] 浏览器访问 `localhost:3001/api/categories` 看到 JSON 数据
- [ ] `server/data/taskflow.db` 文件存在

### Day 2 完成后你应该能：

- [ ] `curl localhost:3001/api/categories` 返回 4 个分类
- [ ] `curl -X POST localhost:3001/api/tasks -d '{"title":"测试"}'` 创建成功
- [ ] `curl localhost:3001/api/tasks` 返回任务列表
- [ ] `curl -X PUT localhost:3001/api/tasks/1 -d '{"title":"新标题"}'` 更新成功
- [ ] `curl -X DELETE localhost:3001/api/tasks/1` 删除成功
- [ ] `curl localhost:3001/api/tasks?status=TODO` 筛选生效

### Day 3 完成后你应该能：

- [ ] 页面显示正确的布局（Header + Sidebar + 主内容区）
- [ ] 任务列表用假数据正确渲染
- [ ] 点击"新建"弹出模态框
- [ ] 表单可以填写和校验

### Day 4 完成后你应该能：

- [ ] 在页面上创建任务，列表实时显示
- [ ] 编辑任务，修改后保存成功
- [ ] 删除任务，弹出确认框后消失
- [ ] 点击状态徽章，状态循环切换
- [ ] 筛选和搜索功能正常
- [ ] 统计面板显示正确数据

### Day 5 完成后你应该能：

- [ ] 分类增删改全部正常
- [ ] 过期任务显示红色提醒
- [ ] 平板端布局正确
- [ ] 完整走一遍创建→编辑→筛选→统计的流程无报错

---

## 12. 文档导航

### 全部文档一览

| 文档 | 什么时候看 | 内容 |
|------|-----------|------|
| **本文档**（快速上手） | **现在** | 跑起来、理解结构、开始开发 |
| [PRD](./PRD.md) | 需要了解"做什么" | 功能需求、验收标准、数据模型 |
| [实施计划](./IMPLEMENTATION_PLAN.md) | 需要知道"怎么做" | 架构设计、每日任务、代码示例 |
| [开发规范](./DEVELOPMENT_SPECIFICATION.md) | 写代码时参考 | 命名规范、编码规范、最佳实践 |
| [测试计划](./TEST_PLAN.md) | 需要验证功能 | 测试用例、验收标准 |
| [部署计划](./DEPLOYMENT_PLAN.md) | 项目完成后上线 | 4 种部署方案、运维手册 |
| [项目总结](./PROJECT_SUMMARY.md) | 了解全貌 | 项目全景、文档导航 |
| [知识库](./KNOWLEDGE_BASE.md) | 开发中速查 | 代码片段、配置模板、常见问题 |
| [知识图谱](./KNOWLEDGE_GRAPH.md) | 建立全局认知 | 知识关联、依赖关系、技能树 |
| [FAQ](./FAQ.md) | 遇到问题时查 | 50+ 常见问题与解答 |

### 按角色推荐阅读

| 你是谁 | 先看这个 | 再看 |
|--------|---------|------|
| **编程新手** | 本文档 → 项目总结 | PRD → 实施计划 |
| **前端开发** | 开发规范 §5/§6 → 实施计划 §6 | 知识库 §4 |
| **后端开发** | 开发规范 §4 → 实施计划 §5 | 知识库 §3 |
| **只想跑起来** | 本文档第 1 节 | 不用看别的 |

---

## 附录：命令速查

```bash
# ===== 开发 =====
npm run dev                          # 一键启动前后端
cd server && npm run dev             # 只启动后端
cd client && npm run dev             # 只启动前端

# ===== 安装 =====
npm install                          # 安装当前目录依赖
npm install express better-sqlite3   # 安装指定包
npm install -D typescript            # 安装开发依赖

# ===== 构建 =====
cd client && npm run build           # 前端构建

# ===== 测试 =====
cd server && npx vitest run          # 运行单元测试

# ===== 数据库 =====
sqlite3 server/data/taskflow.db      # 打开数据库 CLI
  .tables                            # 查看所有表
  SELECT * FROM tasks;               # 查看任务
  .quit                              # 退出
rm server/data/taskflow.db           # 重置数据库

# ===== 部署 =====
pm2 start ecosystem.config.js        # PM2 启动
docker compose up -d --build         # Docker 启动
```

---

> 记住：**先跑起来，再理解原理，最后优化细节**。不要试图一次理解所有东西，按 Day 1 → Day 5 的节奏稳步推进。遇到问题先查本文档和 FAQ，解决不了再搜索或问 AI。祝你开发顺利！
