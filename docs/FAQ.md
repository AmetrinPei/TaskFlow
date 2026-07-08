# TaskFlow — 常见问题文档（FAQ）

> 版本：v1.0  
> 最后更新：2026-07-07  
> 配套文档：[PRD](./PRD.md) ｜ [实施计划](./IMPLEMENTATION_PLAN.md) ｜ [开发规范](./DEVELOPMENT_SPECIFICATION.md) ｜ [测试计划](./TEST_PLAN.md) ｜ [部署计划](./DEPLOYMENT_PLAN.md) ｜ [项目总结](./PROJECT_SUMMARY.md) ｜ [知识库](./KNOWLEDGE_BASE.md)

---

## 目录

1. [项目概述类问题](#1-项目概述类问题)
2. [环境搭建类问题](#2-环境搭建类问题)
3. [后端开发类问题](#3-后端开发类问题)
4. [前端开发类问题](#4-前端开发类问题)
5. [数据库类问题](#5-数据库类问题)
6. [前后端联调类问题](#6-前后端联调类问题)
7. [业务逻辑类问题](#7-业务逻辑类问题)
8. [UI/样式类问题](#8-ui样式类问题)
9. [测试类问题](#9-测试类问题)
10. [部署运维类问题](#10-部署运维类问题)
11. [TypeScript 类问题](#11-typescript-类问题)
12. [性能优化类问题](#12-性能优化类问题)
13. [架构设计类问题](#13-架构设计类问题)
14. [新手常见困惑](#14-新手常见困惑)

---

## 1. 项目概述类问题

### Q1.1：TaskFlow 是什么？为什么要做这个项目？

**A**：TaskFlow 是一个**个人任务管理系统**，帮助用户管理日常待办事项。选择这个项目的原因：

| 维度 | 说明 |
|------|------|
| 实用性 | 自己就能用，解决真实的任务管理需求 |
| 技术覆盖 | 前后端 + 数据库 + API，覆盖全栈基础 |
| 难度适中 | 核心功能不复杂，但可扩展性强 |
| 可演示 | 完成后是一个完整可运行的产品 |

### Q1.2：项目用到了哪些技术？为什么选这些技术？

**A**：

| 技术 | 选型理由 |
|------|----------|
| **React** | 主流前端框架，学习资源丰富，就业市场需求大 |
| **TypeScript** | 类型安全，减少运行时错误，IDE 智能提示 |
| **Vite** | 极速的开发服务器，比 Webpack 快 10 倍以上 |
| **Express** | Node.js 最成熟的 Web 框架，社区庞大 |
| **SQLite** | 零配置数据库，文件存储，无需安装数据库服务 |
| **Tailwind CSS** | 原子化 CSS，不用写 CSS 文件，开发效率高 |
| **Zod** | TypeScript 友好的参数校验库，类型自动推导 |

### Q1.3：项目有哪些功能？

**A**：9 大功能模块：

```
任务管理：创建 / 查看 / 编辑 / 删除 / 状态流转
属性管理：分类管理 / 优先级设置
提醒机制：截止日期视觉提醒
数据看板：统计面板（数字卡片 + 图表）
```

### Q1.4：项目是单用户还是多用户？需要登录吗？

**A**：v1.0 是**单用户个人工具**，不需要注册/登录。所有数据存储在本地 SQLite 文件中。后续版本可以添加用户认证功能。

### Q1.5：项目的文档体系是怎样的？应该按什么顺序阅读？

**A**：

```
PRD（做什么）→ 实施计划（怎么做）→ 开发规范（怎么做好）→ 测试计划（怎么验证）→ 部署计划（怎么上线）→ 项目总结（全景）→ 知识库（速查）→ FAQ（你在这里）
```

| 角色 | 推荐阅读顺序 |
|------|-------------|
| 编程新手 | 项目总结 → PRD → 实施计划 → 开发规范 |
| 前端开发 | 开发规范 → 实施计划（阶段三） → PRD（UI 部分） |
| 后端开发 | 开发规范 → 实施计划（阶段二） → PRD（数据模型 + API） |

---

## 2. 环境搭建类问题

### Q2.1：运行项目需要什么环境？

**A**：

| 工具 | 最低版本 | 检查命令 |
|------|----------|----------|
| Node.js | 18.x LTS | `node -v` |
| npm | 9.x（随 Node 安装） | `npm -v` |
| Git | 2.30+ | `git --version` |

### Q2.2：如何安装 Node.js？

**A**：

1. 访问 [https://nodejs.org/](https://nodejs.org/)
2. 下载 **LTS（长期支持）** 版本
3. 运行安装程序，一路默认即可
4. 打开终端验证：`node -v` 和 `npm -v`

> Windows 用户建议使用 nvm-windows 管理多版本 Node.js。

### Q2.3：`npm install` 报错怎么办？

**A**：常见原因和解决方案：

| 错误 | 原因 | 解决 |
|------|------|------|
| `EACCES` / 权限不足 | 没有写入权限 | Windows 以管理员运行终端；Mac/Linux 用 `sudo` |
| `ECONNRESET` / 网络超时 | 网络问题 | 切换淘宝镜像：`npm config set registry https://registry.npmmirror.com` |
| `better-sqlite3` 编译失败 | 缺少编译工具 | Windows: `npm install -g windows-build-tools`；Mac: `xcode-select --install` |
| `ERESOLVE` / 依赖冲突 | 版本不兼容 | 尝试 `npm install --legacy-peer-deps` |
| `ENOENT` / 找不到 package.json | 在错误目录执行 | 确认在正确的目录下（client/ 或 server/） |

### Q2.4：`npm run dev` 报错端口被占用怎么办？

**A**：

```bash
# Windows：查找占用 3001 端口的进程
netstat -ano | findstr :3001
# 记下 PID，然后杀掉
taskkill /PID <PID> /F

# 或者修改端口：设置环境变量
$env:PORT=3002; npm run dev
```

### Q2.5：VS Code 推荐安装哪些扩展？

**A**：

| 扩展 | 用途 |
|------|------|
| **ESLint** | 代码检查 |
| **Prettier** | 代码格式化 |
| **Tailwind CSS IntelliSense** | Tailwind 类名提示 |
| **TypeScript Importer** | 自动导入 TS 模块 |
| **Error Lens** | 行内显示错误 |
| **Auto Rename Tag** | JSX 标签自动重命名 |

---

## 3. 后端开发类问题

### Q3.1：后端的代码分层是怎样的？为什么要分层？

**A**：

```
Routes（路由）→ Controllers（控制器）→ Services（服务）→ Database（数据库）
```

**为什么要分层**：
- **职责清晰**：每层只做一件事，代码容易理解
- **便于测试**：Service 层可以独立测试，不依赖 HTTP
- **便于维护**：修改数据库不影响路由，修改 UI 不影响业务逻辑
- **新手友好**：按固定模式写代码，不容易写乱

**核心原则**：禁止跨层调用。路由不写 SQL，Service 不碰 req/res。

### Q3.2：`app.ts` 和 `index.ts` 为什么要分开？

**A**：

| 文件 | 职责 |
|------|------|
| `app.ts` | 创建 Express 应用、配置中间件、注册路由。**不包含启动逻辑** |
| `index.ts` | 启动服务器（`app.listen`）、初始化数据库 |

分开的好处：测试时可以只导入 `app` 而不启动服务器，方便做接口测试。

### Q3.3：为什么用 `better-sqlite3` 而不是 `sqlite3`？

**A**：

| 特性 | better-sqlite3 | sqlite3 |
|------|---------------|---------|
| API 风格 | **同步** | 异步回调 |
| 性能 | 更快（无回调开销） | 稍慢 |
| 代码可读性 | 高（像写普通函数） | 低（回调嵌套） |
| 适合场景 | 小型应用、个人工具 | 高并发场景 |

同步 API 对新手更友好，代码更直观。

### Q3.4：什么是参数化查询？为什么不能用字符串拼接？

**A**：

```typescript
// ✅ 正确：参数化查询（安全）
db.prepare('SELECT * FROM tasks WHERE title = ?').run(title);

// ❌ 错误：字符串拼接（SQL 注入风险！）
db.prepare(`SELECT * FROM tasks WHERE title = '${title}'`).run();
```

如果用户输入 `'; DROP TABLE tasks; --`，字符串拼接会执行恶意 SQL，而参数化查询会把它当作普通文本。

**规则**：所有用户输入必须通过 `?` 占位符传入。

### Q3.5：`next(error)` 是什么意思？为什么要这样写？

**A**：`next(error)` 是把错误传递给 Express 的**全局错误处理中间件**。

```typescript
// Controller 中
async create(req, res, next) {
  try {
    const task = taskService.create(req.body);
    res.json(successResponse(task));
  } catch (error) {
    next(error);  // ← 把错误传给错误处理中间件
  }
}

// 错误处理中间件（自动处理所有错误）
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ ... });
  }
  res.status(500).json({ ... });
});
```

**好处**：不需要在每个 Controller 中写 `res.status(xxx).json(...)` 的错误响应逻辑，统一处理。

### Q3.6：Zod 校验失败时返回什么？

**A**：返回 400 状态码 + 错误信息：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "标题不能为空"
  }
}
```

校验中间件在请求到达 Controller 之前就拦截了非法数据，Controller 不需要关心校验逻辑。

### Q3.7：为什么 `updated_at` 需要手动更新？

**A**：SQLite 的 `DEFAULT CURRENT_TIMESTAMP` 只在**插入**时自动设置，**更新时不会自动刷新**。所以在 UPDATE 语句中需要手动加上：

```sql
UPDATE tasks SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
```

---

## 4. 前端开发类问题

### Q4.1：前端项目的数据是怎么获取的？

**A**：通过**自定义 Hook** 封装：

```
组件 → useTasks() → taskApi → axios → 后端 API
              │
              ├── tasks（数据）
              ├── loading（加载状态）
              ├── error（错误信息）
              └── fetchTasks / createTask / ...（操作方法）
```

组件只需要调用 Hook，不需要关心 HTTP 请求的细节。

### Q4.2：为什么用 React Context 而不是 Redux？

**A**：

| 对比 | React Context | Redux |
|------|--------------|-------|
| 复杂度 | 低，React 内置 | 高，需要额外学习 |
| 依赖 | 无额外依赖 | 需要 redux + react-redux |
| 适合规模 | 中小型项目 | 大型复杂项目 |
| 本项目 | ✅ 足够 | ❌ 杀鸡用牛刀 |

TaskFlow 的状态不复杂，Context 完全够用。

### Q4.3：`useEffect` 的依赖数组是什么意思？

**A**：

```typescript
// 空数组：组件挂载时执行一次
useEffect(() => { fetchTasks(); }, []);

// 有依赖：依赖变化时重新执行
useEffect(() => { fetchTasks(filters); }, [filters]);

// 无数组：每次渲染都执行（几乎不会用）
useEffect(() => { ... });
```

**常见错误**：忘记加依赖，导致数据不更新。ESLint 的 `react-hooks/exhaustive-deps` 规则会提醒你。

### Q4.4：为什么列表渲染要用 `key`？不能用 `index` 吗？

**A**：`key` 帮助 React 识别哪些元素变了，从而高效更新 DOM。

```typescript
// ✅ 正确：用唯一 ID
{tasks.map(task => <TaskItem key={task.id} task={task} />)}

// ❌ 错误：用 index（列表会变动时）
{tasks.map((task, index) => <TaskItem key={index} task={task} />)}
```

用 `index` 的问题：删除中间一条任务后，后续所有任务的 index 都变了，React 会错误地复用 DOM，导致状态混乱。

### Q4.5：模态框怎么实现关闭？

**A**：支持三种关闭方式：

```typescript
// 1. 点击关闭按钮
<button onClick={onClose}>×</button>

// 2. 按 Esc 键
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  window.addEventListener('keydown', handleEsc);
  return () => window.removeEventListener('keydown', handleEsc);
}, [onClose]);

// 3. 点击遮罩层
<div className="fixed inset-0 bg-black/50" onClick={onClose}>
  <div onClick={e => e.stopPropagation()}>
    {/* 模态框内容，点击不冒泡 */}
  </div>
</div>
```

### Q4.6：前端路由刷新后 404 怎么解决？

**A**：这是 SPA（单页面应用）的经典问题。刷新时服务器找不到 `/stats` 路径。

**解决方案**：让服务器对所有非文件请求返回 `index.html`。

```nginx
# Nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

```typescript
// Express 生产模式
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});
```

---

## 5. 数据库类问题

### Q5.1：数据库文件在哪里？怎么查看数据？

**A**：

- 文件位置：`server/data/taskflow.db`
- 首次启动后端时自动创建
- 查看数据方式：

```bash
# 方式一：使用 sqlite3 命令行工具
sqlite3 server/data/taskflow.db
SELECT * FROM tasks;
.tables
.quit

# 方式二：使用 VS Code 扩展 "SQLite Viewer"
# 直接双击 .db 文件查看

# 方式三：通过 API 查看
curl http://localhost:3001/api/tasks
```

### Q5.2：怎么重置数据库？

**A**：

```bash
# 删除数据库文件
rm server/data/taskflow.db

# 重启后端，会自动重建表结构和预置分类
npm run dev
```

> 注意：这会**清除所有数据**，仅在开发阶段使用。

### Q5.3：为什么删除分类后任务不会丢失？

**A**：因为外键约束设置了 `ON DELETE SET DEFAULT`：

```sql
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET DEFAULT
```

但 better-sqlite3 对外键的支持有限，所以我们在 Service 层手动处理：

```typescript
delete(id: number) {
  // 先把该分类下的任务移到"默认"分类（id=1）
  db.prepare('UPDATE tasks SET category_id = 1 WHERE category_id = ?').run(id);
  // 再删除分类
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
}
```

### Q5.4：SQLite 的日期怎么处理？

**A**：本项目统一使用 **字符串格式** `YYYY-MM-DD`，不使用 JavaScript 的 Date 对象存入数据库。

```typescript
// 存入：直接存字符串
due_date: '2026-07-15'

// 读取：用 dayjs 处理
import dayjs from 'dayjs';
const due = dayjs(task.due_date);
const diff = due.diff(dayjs(), 'day');
```

**好处**：避免时区转换问题，前后端格式一致。

### Q5.5：数据库会越来越大吗？需要清理吗？

**A**：个人使用场景下增长非常缓慢。预估：

| 任务数 | 数据库大小 |
|--------|-----------|
| 0 | ~20 KB |
| 100 | ~100 KB |
| 1000 | ~500 KB |
| 10000 | ~5 MB |

无需担心空间问题。如果删除了大量数据后想缩小文件体积：

```sql
VACUUM;  -- 重建数据库文件，释放空闲空间
```

---

## 6. 前后端联调类问题

### Q6.1：前端请求 API 报 404 怎么办？

**A**：按以下步骤排查：

| 步骤 | 检查内容 | 命令 |
|------|----------|------|
| 1 | 后端是否在运行 | 终端是否显示 "Server running on :3001" |
| 2 | API 路径是否正确 | 浏览器直接访问 `localhost:3001/api/tasks` |
| 3 | Vite 代理是否配置 | 检查 `vite.config.ts` 中 proxy 配置 |
| 4 | 前端 baseURL 是否正确 | 检查 `api/client.ts` 中 `baseURL: '/api'` |

### Q6.2：前端请求成功但数据不显示？

**A**：常见原因：

| 原因 | 排查 |
|------|------|
| 数据结构不匹配 | `console.log(response)` 查看实际结构，确认 `response.data` 还是 `response.data.data` |
| Axios 拦截器已解包 | 检查拦截器是否已经 `return response.data`，组件中不需要再 `.data` |
| 状态未更新 | 确认 `setTasks(response.data)` 是否正确赋值 |
| 类型不匹配 | 检查前端 Task 类型是否与后端返回的字段一致 |

### Q6.3：CORS 报错怎么处理？

**A**：

```
Access to XMLHttpRequest at 'http://localhost:3001/api/tasks'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**开发环境**：不需要处理 CORS，因为 Vite proxy 会代理请求（同源）。

**生产环境**（前后端不同域名时）：

```typescript
// server/src/app.ts
import cors from 'cors';
app.use(cors({
  origin: ['https://your-frontend.com', 'http://localhost:5173'],
}));
```

### Q6.4：操作后列表不刷新怎么办？

**A**：确保在操作成功后更新本地状态：

```typescript
// ✅ 正确：操作后更新本地状态
const createTask = async (data: TaskFormData) => {
  const response = await taskApi.create(data);
  setTasks(prev => [response.data, ...prev]);  // ← 更新本地状态
};

// ❌ 错误：只调了 API，没更新本地状态
const createTask = async (data: TaskFormData) => {
  await taskApi.create(data);
  // 忘记更新 setTasks → 列表不刷新
};
```

或者操作成功后调用 `fetchTasks()` 重新获取全部数据。

---

## 7. 业务逻辑类问题

### Q7.1：任务状态是怎么流转的？

**A**：三个状态循环切换：

```
待办(TODO) → 进行中(IN_PROGRESS) → 已完成(DONE) → 待办(TODO) → ...
```

- 点击状态徽章：自动切换到下一个状态
- 编辑表单：可以选择任意状态
- 任意状态之间可以自由回退

### Q7.2：为什么已完成的任务不显示"已过期"？

**A**：这是业务规则。已完成的任务不需要提醒，即使截止日期已过。

```typescript
if (taskStatus === 'DONE') return 'normal';  // 已完成不提醒
```

### Q7.3：删除分类时为什么要提示"任务将移至默认分类"？

**A**：防止用户误删分类后，该分类下的任务变成"无分类"。通过移至"默认"分类，保证每个任务都有分类。

### Q7.4：预置分类为什么不能删除？

**A**：预置分类（默认/工作/学习/生活）是系统基础数据：
- "默认"分类是外键的默认目标（`category_id DEFAULT 1`），删除会导致数据不一致
- 其他预置分类提供开箱即用的体验，用户可以改名但不能删除

### Q7.5：搜索是前端搜索还是后端搜索？

**A**：两种都支持，本项目推荐**后端搜索**：

```
前端输入关键词 → 300ms 防抖 → GET /api/tasks?keyword=xxx → 后端 SQL LIKE 查询 → 返回结果
```

后端搜索的好处：数据量大时性能好，搜索结果更准确。

---

## 8. UI/样式类问题

### Q8.1：Tailwind CSS 的类名太多了，怎么记住？

**A**：不需要记住所有类名。常用技巧：

| 方法 | 说明 |
|------|------|
| **安装 VS Code 扩展** | Tailwind CSS IntelliSense 自动提示 |
| **查官方文档** | [https://tailwindcss.com/docs](https://tailwindcss.com/docs) |
| **类比记忆** | `p-4` = padding 1rem, `m-2` = margin 0.5rem, `flex` = display:flex |
| **看现有代码** | 项目中已有大量示例，直接参考 |

常用类名速记：

```
布局：  flex, grid, gap-2, items-center, justify-between
间距：  p-4(内边距), m-2(外边距), space-y-3(子元素间距)
文字：  text-sm, text-lg, font-bold, text-gray-500
颜色：  bg-blue-500, text-red-500, bg-white
圆角：  rounded, rounded-lg, rounded-full
阴影：  shadow, shadow-sm, shadow-lg
尺寸：  w-full, h-screen, w-60, max-w-md
```

### Q8.2：响应式布局怎么实现？

**A**：使用 Tailwind 的断点前缀：

```typescript
// 侧边栏：桌面端显示，平板端隐藏
<aside className="hidden md:block w-60">
  {/* md: 768px+ */}
</aside>

// 汉堡菜单：只在平板端显示
<button className="md:hidden">☰</button>
```

| 前缀 | 宽度 | 含义 |
|------|------|------|
| 无前缀 | 默认 | 所有屏幕 |
| `md:` | ≥768px | 平板及以上 |
| `lg:` | ≥1024px | 桌面及以上 |

### Q8.3：怎么让操作按钮只在 hover 时显示？

**A**：

```typescript
<div className="group">
  {/* 默认隐藏，hover 时显示 */}
  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
    编辑
  </button>
</div>
```

---

## 9. 测试类问题

### Q9.1：需要写多少测试？

**A**：按优先级：

| 优先级 | 内容 | 方式 |
|--------|------|------|
| **P0 必须** | 完整业务流程（创建→查看→编辑→删除） | 手动验证 |
| **P1 重要** | 筛选/排序/状态流转 | 手动验证 |
| **P2 建议** | 后端 Service 层单元测试 | Vitest 自动化 |
| **P3 可选** | API 接口测试、前端组件测试 | 自动化 |

**建议**：先保证手动测试全部通过，有余力再写自动化测试。

### Q9.2：怎么运行后端单元测试？

**A**：

```bash
cd server
npx vitest run          # 运行全部测试
npx vitest watch        # 监听模式（文件变化自动重跑）
npx vitest run -t "create"  # 只运行名称包含 "create" 的用例
```

### Q9.3：测试前需要重置数据库吗？

**A**：是的。在测试 setup 文件中：

```typescript
beforeEach(() => {
  db.exec('DELETE FROM tasks');
  db.exec("DELETE FROM categories WHERE is_builtin = 0");
});
```

确保每个测试用例从干净的状态开始，避免测试之间互相影响。

---

## 10. 部署运维类问题

### Q10.1：有几种部署方式？推荐哪种？

**A**：

| 方案 | 难度 | 推荐场景 |
|------|------|----------|
| **本地部署** | ★☆☆☆☆ | 新手入门、个人使用 |
| **Docker** | ★★★☆☆ | 生产推荐、环境隔离 |
| **云平台** | ★★★★☆ | 需要公网访问 |
| **云服务器** | ★★★☆☆ | 完全控制 |

**新手建议**：先用本地部署跑起来，再尝试 Docker。

### Q10.2：Docker 部署后数据会丢失吗？

**A**：如果不挂载 Volume，容器删除后数据会丢失。必须配置持久化：

```yaml
# docker-compose.yml
volumes:
  - taskflow-data:/app/data   # ← 关键：挂载数据卷
```

### Q10.3：怎么备份数据库？

**A**：

```bash
# 简单备份：复制文件
cp server/data/taskflow.db backups/taskflow-$(date +%Y%m%d).db

# 自动备份：添加定时任务（Linux）
# crontab -e → 添加：
0 2 * * * cp /opt/taskflow/data/taskflow.db /opt/taskflow/backups/taskflow-$(date +\%Y\%m\%d).db
```

### Q10.4：怎么更新已部署的应用？

**A**：

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装新依赖（如有）
cd server && npm install --production && cd ..
cd client && npm install && npm run build && cd ..

# 3. 重启服务
pm2 restart taskflow
# 或
docker compose restart
```

### Q10.5：服务挂了怎么排查？

**A**：

| 步骤 | 命令 | 看什么 |
|------|------|--------|
| 1. 检查进程 | `pm2 status` 或 `docker ps` | 进程是否在运行 |
| 2. 查看日志 | `pm2 logs taskflow` | 错误信息 |
| 3. 检查端口 | `netstat -ano \| findstr :3001` | 端口是否被占用 |
| 4. 检查数据库 | 确认 `taskflow.db` 文件存在 | 数据库是否损坏 |
| 5. 重启服务 | `pm2 restart taskflow` | 重启是否恢复 |

---

## 11. TypeScript 类问题

### Q11.1：`any` 和 `unknown` 有什么区别？为什么不让用 `any`？

**A**：

```typescript
// any：放弃类型检查（危险）
let value: any = "hello";
value.toFixed();  // 编译不报错，运行时报错！

// unknown：需要类型收窄后才能使用（安全）
let value: unknown = "hello";
if (typeof value === 'string') {
  value.toUpperCase();  // 收窄后可以安全使用
}
```

**规则**：用 `unknown` 替代 `any`，通过类型收窄保证安全。

### Q11.2：前后端的类型定义需要保持一致吗？

**A**：**必须一致**。后端返回的数据结构必须匹配前端的类型定义。

```typescript
// 后端 server/src/types/index.ts
export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  // ...
}

// 前端 client/src/types/index.ts — 必须相同
export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  // ...
}
```

修改接口时，先更新类型定义，再更新实现代码。

### Q11.3：`type` 和 `interface` 怎么选？

**A**：

```typescript
// interface：定义对象结构
interface Task {
  id: number;
  title: string;
}

// type：定义联合类型、工具类型等
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type TaskFormData = Partial<Task>;  // 工具类型
```

**简单规则**：对象结构用 `interface`，其他用 `type`。

### Q11.4：`Partial<Task>` 是什么意思？

**A**：`Partial` 是 TypeScript 内置工具类型，把所有属性变为可选：

```typescript
// Task 的所有字段都是必填的
interface Task { title: string; status: TaskStatus; priority: TaskPriority; }

// Partial<Task> 的所有字段都是可选的
type UpdateData = Partial<Task>;
// 等价于：{ title?: string; status?: TaskStatus; priority?: TaskPriority; }

// 用于更新操作：只需传入要修改的字段
updateTask(1, { title: '新标题' });  // 只传 title 即可
```

---

## 12. 性能优化类问题

### Q12.1：搜索框输入时每次都请求 API，会不会太频繁？

**A**：使用**防抖（debounce）** 解决。用户停止输入 300ms 后才触发请求：

```typescript
const debouncedKeyword = useDebounce(keyword, 300);

useEffect(() => {
  fetchTasks({ ...filters, keyword: debouncedKeyword });
}, [debouncedKeyword]);
```

### Q12.2：列表有 100 条任务会卡吗？

**A**：不会。React 渲染 100 条简单列表毫无压力。如果到 1000 条以上才需要考虑虚拟滚动。

### Q12.3：前端构建产物太大怎么优化？

**A**：

```typescript
// vite.config.ts — 代码分割
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],    // 第三方库单独打包
        charts: ['recharts'],              // 图表库按需加载
      },
    },
  },
}
```

效果：首屏只加载核心 JS（~100KB），图表库在访问统计页时才加载。

---

## 13. 架构设计类问题

### Q13.1：为什么选 Monorepo 而不是前后端分开两个仓库？

**A**：

| 优势 | 说明 |
|------|------|
| 统一管理 | 一个 `npm run dev` 启动全部 |
| 类型同步 | 前后端类型定义放在一起，方便保持同步 |
| 版本一致 | 一次 Git 提交包含前后端变更，便于回溯 |
| 新手友好 | 不需要管理多个仓库 |

### Q13.2：为什么不用 Next.js 做全栈？

**A**：Next.js 虽然强大，但：
- 学习曲线更陡（SSR、SSG 等概念）
- 隐藏了前后端交互的细节
- 本项目目标是学习**前后端分离**架构

Express + React 的组合让每一层都清晰可见，更适合学习。

### Q13.3：后续想加用户认证，架构需要大改吗？

**A**：不需要大改。主要变更：

| 变更点 | 工作量 |
|--------|--------|
| 新增 users 表 | 小 |
| 新增认证中间件 | 中 |
| 任务表加 user_id 字段 | 小 |
| 前端加登录页面 | 中 |
| API 接口不变 | ✅ 无需修改 |

分层架构的好处就是新增功能不影响已有代码。

---

## 14. 新手常见困惑

### Q14.1：代码太多了，不知道从哪里开始看？

**A**：按以下顺序阅读代码：

```
1. server/src/index.ts          → 后端从这里启动
2. server/src/app.ts            → 看看配置了哪些中间件
3. server/src/routes/index.ts   → 看看有哪些路由
4. server/src/services/taskService.ts → 核心业务逻辑

5. client/src/App.tsx           → 前端路由配置
6. client/src/pages/TaskPage.tsx → 首页长什么样
7. client/src/hooks/useTasks.ts  → 数据怎么获取
8. client/src/api/taskApi.ts     → API 怎么调用
```

### Q14.2：报错了看不懂怎么办？

**A**：

1. **看错误信息的最后一行**：通常是具体原因
2. **看第一个出现的文件名和行号**：就是你的代码出错的位置
3. **复制错误信息搜索**：Stack Overflow / Google 通常有答案
4. **问 AI**：把错误信息发给 AI 助手，让它解释

### Q14.3：不知道怎么实现某个功能怎么办？

**A**：

1. **查文档**：先查本项目的知识库（KNOWLEDGE_BASE.md）和开发规范
2. **查官方文档**：React / Express / Tailwind 官方文档
3. **搜示例**：Google "react how to xxx" 或 "express xxx example"
4. **问 AI**：描述你的需求，让 AI 给出实现方案
5. **看类似代码**：项目中已有类似功能，参考着改

### Q14.4：前后端都报错了，先修哪个？

**A**：**先修后端**。因为前端的数据来自后端，如果后端接口有问题，前端修了也没用。

排查顺序：
```
数据库 → 后端 Service → 后端 API → 前端 API 调用 → 前端 UI 渲染
```

### Q14.5：开发 5 天真的能做完吗？

**A**：实施计划中的 5 天是**全职开发**的估算。如果每天投入 2~3 小时：

| 投入 | 预计周期 |
|------|----------|
| 全职（8h/天） | 5 天 |
| 半职（4h/天） | 8~10 天 |
| 业余（2h/天） | 15~20 天 |

**建议**：不要赶进度，理解每一行代码比快速完成更重要。

### Q14.6：可以边学边做吗？还是先学完再开始？

**A**：**边学边做**。本项目的设计就是为新手服务的。

推荐方式：
```
1. 先通读 PRD，理解要做什么
2. 按实施计划 Day 1 开始，遇到不懂的概念停下来学
3. 让 AI 解释每段代码的含义
4. 做完一个功能就测试一下
5. 遇到问题查 FAQ 和知识库
```

### Q14.7：Git 提交信息怎么写？

**A**：使用 Conventional Commits 格式：

```
feat(task): 实现任务创建功能
fix(date): 修复截止日期显示错误
style(ui): 调整任务卡片间距
refactor(api): 重构请求封装
docs: 更新接口文档
chore: 升级依赖版本
```

格式：`类型(范围): 描述`

### Q14.8：怎么确认我的代码符合开发规范？

**A**：

1. **配置 ESLint + Prettier**：自动检查格式问题
2. **查看开发规范文档**：DEVELOPMENT_SPECIFICATION.md 第 13 章有代码审查清单
3. **提交前自查**：
   - 有没有 `any` 类型？
   - 有没有 `console.log` 调试代码？
   - SQL 是否用了参数化查询？
   - 组件 Props 有没有类型定义？

---

> 本文档持续更新。如果你遇到了文档中没有覆盖的问题，欢迎补充。
