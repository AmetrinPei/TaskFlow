# TaskFlow — 项目部署计划文档

> 版本：v1.0  
> 最后更新：2026-07-07  
> 配套文档：[PRD 需求文档](./PRD.md) ｜ [项目实施计划](./IMPLEMENTATION_PLAN.md) ｜ [开发规范](./DEVELOPMENT_SPECIFICATION.md) ｜ [测试计划](./TEST_PLAN.md)  
> 技术栈：React + TypeScript + Vite ｜ Node.js + Express + TypeScript ｜ SQLite ｜ Tailwind CSS

---

## 目录

1. [部署概述](#1-部署概述)
2. [部署架构总览](#2-部署架构总览)
3. [环境规划](#3-环境规划)
4. [方案一：本地部署（推荐入门）](#4-方案一本地部署推荐入门)
5. [方案二：Docker 容器部署（推荐生产）](#5-方案二docker-容器部署推荐生产)
6. [方案三：云平台分离部署](#6-方案三云平台分离部署)
7. [方案四：云服务器单机部署](#7-方案四云服务器单机部署)
8. [生产环境配置](#8-生产环境配置)
9. [Nginx 反向代理配置](#9-nginx-反向代理配置)
10. [数据管理策略](#10-数据管理策略)
11. [进程管理与守护](#11-进程管理与守护)
12. [CI/CD 自动化部署](#12-cicd-自动化部署)
13. [监控与日志](#13-监控与日志)
14. [安全加固](#14-安全加固)
15. [部署验证清单](#15-部署验证清单)
16. [回滚方案](#16-回滚方案)
17. [运维手册](#17-运维手册)
18. [部署方案对比与选择指南](#18-部署方案对比与选择指南)

---

## 1. 部署概述

### 1.1 部署目标

| 目标 | 说明 |
|------|------|
| **可用性** | 部署后系统可正常访问，所有功能运行正确 |
| **数据安全** | SQLite 数据库文件持久化存储，不因重启/更新丢失 |
| **易维护** | 部署流程清晰，支持便捷更新和回滚 |
| **低门槛** | 为编程新手提供从简到繁的多种部署路径 |

### 1.2 部署特点分析

TaskFlow 作为个人单用户工具，具有以下部署特点：

| 特点 | 影响 |
|------|------|
| **SQLite 文件数据库** | 数据以文件形式存储，需持久化挂载；不支持多实例并发写入 |
| **前后端分离** | 前端为静态文件，后端为 Node.js 进程，需反向代理 |
| **低并发** | 个人使用场景，无需负载均衡和水平扩展 |
| **无外部依赖** | 不依赖 Redis、消息队列等外部服务，部署极简 |

### 1.3 部署方案总览

| 方案 | 难度 | 成本 | 适合场景 | 推荐度 |
|------|------|------|----------|--------|
| **方案一：本地部署** | 极低 | 免费 | 个人日常使用、开发调试 | 新手首选 |
| **方案二：Docker 容器** | 中 | 免费/低 | 需要环境隔离、便捷迁移 | 生产推荐 |
| **方案三：云平台分离** | 中高 | 低 | 需要公网访问、前端 CDN 加速 | 进阶选择 |
| **方案四：云服务器单机** | 中 | 中 | 需要完全控制、公网访问 | 传统方案 |

---

## 2. 部署架构总览

### 2.1 通用部署架构

```
                         用户浏览器
                             │
                             │  https://your-domain.com
                             ▼
                    ┌────────────────┐
                    │  Nginx 反向代理 │  (可选，方案二/四使用)
                    │   端口 80/443  │
                    └───┬────────┬───┘
                        │        │
           静态文件 ←───┘        └──→ API 代理
           /client/dist              │
                                     ▼
                        ┌────────────────┐
                        │  Express 服务   │
                        │  端口 3001     │
                        └───────┬────────┘
                                │
                                ▼
                        ┌────────────────┐
                        │  SQLite 数据库  │
                        │  taskflow.db   │
                        │  (持久化存储)   │
                        └────────────────┘
```

### 2.2 请求流转路径

| 请求类型 | 路径 | 处理方式 |
|----------|------|----------|
| 前端页面 | `/`、`/stats` 等 | Nginx 直接返回 `client/dist/` 静态文件 |
| API 请求 | `/api/*` | Nginx 反向代理到 Express `localhost:3001` |
| 静态资源 | `/assets/*` | Nginx 直接返回（带缓存头） |

---

## 3. 环境规划

### 3.1 环境定义

| 环境 | 用途 | 地址 | 数据 |
|------|------|------|------|
| **开发环境 (dev)** | 日常开发调试 | `localhost:5173` (前端) + `localhost:3001` (后端) | 测试数据，可随时重置 |
| **生产环境 (prod)** | 正式使用 | 实际部署地址 | 真实数据，需持久化备份 |

### 3.2 系统要求

| 项目 | 最低要求 | 推荐配置 |
|------|----------|----------|
| **操作系统** | Windows 10 / Ubuntu 20.04 / macOS 12 | Ubuntu 22.04 LTS |
| **Node.js** | v18.x LTS | v20.x LTS |
| **内存** | 512 MB | 1 GB+ |
| **磁盘** | 200 MB（应用）+ 数据空间 | 1 GB+ |
| **网络** | 本地访问无需公网 | 公网访问需开放 80/443 端口 |

### 3.3 端口规划

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端开发服务器 | 5173 | 仅开发环境使用（Vite） |
| 后端 Express 服务 | 3001 | API 服务端口 |
| Nginx HTTP | 80 | 生产环境入口（可选） |
| Nginx HTTPS | 443 | 启用 SSL 后使用（可选） |

### 3.4 目录规划（生产环境）

```
/opt/taskflow/                  # 应用根目录
├── app/                        # 应用代码
│   ├── client/dist/            # 前端构建产物
│   ├── server/                 # 后端代码
│   └── package.json            # 根配置
├── data/                       # 数据目录（持久化挂载）
│   └── taskflow.db             # SQLite 数据库文件
├── backups/                    # 数据库备份目录
│   └── taskflow-2026-07-07.db  # 备份文件
├── logs/                       # 日志目录
│   ├── app.log                 # 应用日志
│   └── nginx/                  # Nginx 日志
└── docker-compose.yml          # Docker 编排文件（方案二使用）
```

---

## 4. 方案一：本地部署（推荐入门）

> 适合人群：编程新手、个人日常使用  
> 难度：★☆☆☆☆  
> 耗时：5 分钟

### 4.1 前置条件

- 已安装 Node.js 18+（[下载地址](https://nodejs.org/)）
- 已安装 Git（[下载地址](https://git-scm.com/)）

### 4.2 部署步骤

**步骤 1：获取项目代码**

```bash
# 方式一：克隆仓库
git clone <repository-url>
cd taskflow

# 方式二：直接使用本地项目目录
cd d:\workspace\task\Qoder
```

**步骤 2：安装依赖**

```bash
# 安装根目录依赖
npm install

# 安装后端依赖
cd server && npm install && cd ..

# 安装前端依赖
cd client && npm install && cd ..
```

**步骤 3：启动服务**

```bash
# 一键启动前后端（开发模式）
npm run dev
```

**步骤 4：访问系统**

打开浏览器访问：`http://localhost:5173`

### 4.3 后台运行（可选）

开发模式 `npm run dev` 会在终端前台运行，关闭终端即停止。如需后台运行：

**Windows 方案**：

```powershell
# 使用 PM2 管理（需全局安装）
npm install -g pm2

# 启动后端
cd server; pm2 start "npx tsx src/index.ts" --name taskflow-server

# 启动前端（生产模式需先构建）
cd ../client; npm run build
pm2 serve dist 5173 --name taskflow-client --spa
```

**Linux/macOS 方案**：

```bash
# 使用 nohup 后台运行
nohup npm run dev > taskflow.log 2>&1 &
```

### 4.4 停止服务

```bash
# Ctrl+C 终止（开发模式）
# 或
pm2 stop all        # PM2 方案
pm2 delete all      # 完全移除
```

### 4.5 验证清单

| 检查项 | 验证方法 | 预期结果 |
|--------|----------|----------|
| 后端启动 | 查看终端输出 | `Server running on http://localhost:3001` |
| 前端启动 | 查看终端输出 | `Local: http://localhost:5173` |
| 页面访问 | 浏览器打开 `localhost:5173` | 显示 TaskFlow 首页 |
| API 可用 | 浏览器打开 `localhost:3001/api/categories` | 返回 JSON 数据 |
| 数据库初始化 | 检查 `server/data/taskflow.db` | 文件存在 |

---

## 5. 方案二：Docker 容器部署（推荐生产）

> 适合人群：有一定 Docker 基础、需要环境隔离和便捷迁移  
> 难度：★★★☆☆  
> 耗时：15 分钟

### 5.1 前置条件

- 已安装 Docker（[下载地址](https://www.docker.com/products/docker-desktop/)）
- 已安装 Docker Compose（Docker Desktop 自带）

### 5.2 文件准备

**Dockerfile**：

```dockerfile
# ============ 构建阶段 ============
FROM node:20-alpine AS builder

WORKDIR /app

# 复制根配置
COPY package*.json ./

# 构建前端
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# 安装后端依赖
COPY server/package*.json ./server/
RUN cd server && npm install --production

# ============ 运行阶段 ============
FROM node:20-alpine

WORKDIR /app

# 安装 tsx 用于运行 TypeScript
RUN npm install -g tsx

# 复制后端代码和依赖
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY server/ ./server/

# 复制前端构建产物（由 Express 静态服务提供）
COPY --from=builder /app/client/dist ./client/dist

# 创建数据目录
RUN mkdir -p /app/data

# 环境变量
ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/app/data/taskflow.db

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/categories || exit 1

# 启动命令
CMD ["npx", "tsx", "server/src/index.ts"]
```

**docker-compose.yml**：

```yaml
version: '3.8'

services:
  taskflow:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: taskflow-app
    restart: unless-stopped
    ports:
      - "3001:3001"
    volumes:
      # 持久化数据库文件
      - taskflow-data:/app/data
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DB_PATH=/app/data/taskflow.db
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3001/api/categories"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

volumes:
  taskflow-data:
    driver: local
```

**.dockerignore**：

```
node_modules
*/node_modules
client/dist
server/data/*.db
.git
.gitignore
*.md
docs/
.vscode/
```

### 5.3 部署步骤

**步骤 1：构建并启动**

```bash
# 构建镜像并启动容器（后台运行）
docker compose up -d --build
```

**步骤 2：查看运行状态**

```bash
# 查看容器状态
docker compose ps

# 查看日志
docker compose logs -f taskflow
```

**步骤 3：访问系统**

打开浏览器访问：`http://localhost:3001`

> Docker 方案中 Express 同时提供 API 和前端静态文件服务，无需 Nginx。

### 5.4 常用运维命令

```bash
# 停止服务
docker compose stop

# 重启服务
docker compose restart

# 更新部署（重新构建镜像）
docker compose up -d --build

# 查看实时日志
docker compose logs -f

# 进入容器内部
docker compose exec taskflow sh

# 完全移除（保留数据卷）
docker compose down

# 完全移除（包括数据卷 — 会删除数据库！）
docker compose down -v
```

### 5.5 数据备份

```bash
# 备份数据库文件
docker compose exec taskflow cp /app/data/taskflow.db /app/data/backup-$(date +%Y%m%d).db

# 将备份文件复制到宿主机
docker cp taskflow-app:/app/data/backup-20260707.db ./backups/

# 恢复数据库（先停止服务）
docker compose stop
docker cp ./backups/taskflow.db taskflow-app:/app/data/taskflow.db
docker compose start
```

### 5.6 验证清单

| 检查项 | 验证方法 | 预期结果 |
|--------|----------|----------|
| 容器运行 | `docker compose ps` | 状态为 `Up (healthy)` |
| 页面访问 | 浏览器打开 `localhost:3001` | 显示 TaskFlow 首页 |
| API 可用 | `curl localhost:3001/api/categories` | 返回 JSON 数据 |
| 数据持久化 | 重启容器后检查数据 | 数据仍在 |
| 健康检查 | `docker inspect --format='{{.State.Health.Status}}' taskflow-app` | 输出 `healthy` |

---

## 6. 方案三：云平台分离部署

> 适合人群：需要公网访问、希望前端享受 CDN 加速  
> 难度：★★★★☆  
> 耗时：30 分钟

### 6.1 架构设计

```
用户浏览器
    │
    ├──→ Vercel (前端)          https://taskflow-xxx.vercel.app
    │        │
    │        └── 静态文件托管 + CDN + 自动 HTTPS
    │
    └──→ Railway (后端)         https://taskflow-xxx.up.railway.app
             │
             ├── Express API 服务
             └── SQLite 数据库（Volume 持久化）
```

### 6.2 后端部署到 Railway

**步骤 1：准备 Railway 项目**

1. 注册 [Railway](https://railway.app/) 账号
2. 创建新项目 → Deploy from GitHub repo（或 CLI 部署）

**步骤 2：配置后端**

在 `server/` 目录添加 `Procfile`：

```procfile
web: npx tsx src/index.ts
```

修改后端代码以支持生产环境：

```typescript
// server/src/index.ts 关键修改
import app from './app';
import path from 'path';

const PORT = Number(process.env.PORT) || 3001;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/taskflow.db');

// 生产环境：提供前端静态文件
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));

  // 所有非 /api 的请求返回 index.html（支持前端路由）
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**步骤 3：配置环境变量**

在 Railway 项目设置中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 生产模式 |
| `PORT` | `3001` | 服务端口（Railway 会自动分配） |
| `DB_PATH` | `/data/taskflow.db` | 数据库路径（Volume 挂载点） |

**步骤 4：添加 Volume 持久化**

```bash
# Railway CLI 创建 Volume
railway volume mount /data

# 部署
railway up
```

**步骤 5：获取后端地址**

部署成功后，Railway 会分配一个域名，如：`https://taskflow-api.up.railway.app`

### 6.3 前端部署到 Vercel

**步骤 1：修改 API 基础地址**

```typescript
// client/src/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});
```

创建 `.env.production`：

```env
VITE_API_BASE_URL=https://taskflow-api.up.railway.app/api
```

**步骤 2：部署到 Vercel**

```bash
# 安装 Vercel CLI
npm install -g vercel

# 在 client/ 目录部署
cd client
vercel --prod
```

**步骤 3：配置 CORS**

在 Railway 后端配置 CORS 允许 Vercel 域名：

```typescript
// server/src/app.ts
app.use(cors({
  origin: [
    'https://taskflow-xxx.vercel.app',  // Vercel 域名
    'http://localhost:5173',             // 本地开发
  ],
}));
```

### 6.4 验证清单

| 检查项 | 验证方法 | 预期结果 |
|--------|----------|----------|
| 后端 API | 访问 Railway 域名 `/api/categories` | 返回 JSON |
| 前端页面 | 访问 Vercel 域名 | 显示 TaskFlow 首页 |
| 前后端联通 | 在 Vercel 前端创建任务 | 任务创建成功 |
| 数据持久化 | 重启 Railway 服务 | 数据仍在 |
| HTTPS | 访问两个域名 | 均为 HTTPS 连接 |

---

## 7. 方案四：云服务器单机部署

> 适合人群：有云服务器（阿里云/腾讯云/AWS 等）、希望完全控制  
> 难度：★★★☆☆  
> 耗时：30 分钟

### 7.1 架构设计

```
用户浏览器
    │
    │  https://your-domain.com
    ▼
┌──────────────────────────────────────────┐
│              云服务器 (Ubuntu)             │
│                                          │
│  ┌─────────┐    ┌─────────────────────┐  │
│  │  Nginx  │───→│  PM2 + Express 服务  │  │
│  │ :80/443 │    │  :3001              │  │
│  │         │    │  ├─ API (/api/*)    │  │
│  │ 静态文件 │    │  └─ 静态文件兜底     │  │
│  └─────────┘    └────────┬────────────┘  │
│                          │               │
│                 ┌────────┴────────────┐  │
│                 │  SQLite taskflow.db │  │
│                 └─────────────────────┘  │
└──────────────────────────────────────────┘
```

### 7.2 服务器初始化

**步骤 1：安装 Node.js**

```bash
# 使用 NodeSource 安装 Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证
node -v   # v20.x.x
npm -v    # 10.x.x
```

**步骤 2：安装 PM2 和 Nginx**

```bash
sudo npm install -g pm2
sudo apt-get install -y nginx
```

**步骤 3：创建应用目录**

```bash
sudo mkdir -p /opt/taskflow
sudo chown $USER:$USER /opt/taskflow
```

### 7.3 部署应用

**步骤 1：上传代码**

```bash
# 方式一：Git 克隆
cd /opt/taskflow
git clone <repository-url> .

# 方式二：SCP 上传（在本地执行）
scp -r ./taskflow/* user@server-ip:/opt/taskflow/
```

**步骤 2：安装依赖并构建**

```bash
cd /opt/taskflow

# 安装后端依赖
cd server && npm install --production && cd ..

# 安装并构建前端
cd client && npm install && npm run build && cd ..

# 创建数据目录
mkdir -p /opt/taskflow/data
```

**步骤 3：配置环境变量**

```bash
# 创建 .env 文件
cat > /opt/taskflow/server/.env << 'EOF'
NODE_ENV=production
PORT=3001
DB_PATH=/opt/taskflow/data/taskflow.db
EOF
```

**步骤 4：修改后端支持静态文件服务**

确保 `server/src/index.ts` 在生产模式下提供前端静态文件（参见方案三 6.2 节中的代码修改）。

**步骤 5：使用 PM2 启动**

```bash
cd /opt/taskflow/server

# 启动服务
pm2 start "npx tsx src/index.ts" --name taskflow

# 设置开机自启
pm2 startup
pm2 save
```

### 7.4 配置 Nginx

```nginx
# /etc/nginx/sites-available/taskflow

server {
    listen 80;
    server_name your-domain.com;  # 替换为实际域名或 IP

    # 前端静态文件
    location / {
        root /opt/taskflow/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;  # 支持前端路由

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }

    # API 反向代理
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
```

**启用配置**：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/taskflow /etc/nginx/sites-enabled/

# 删除默认站点
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 7.5 配置 HTTPS（可选）

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 自动配置 SSL 证书（需要域名已解析到服务器 IP）
sudo certbot --nginx -d your-domain.com

# 自动续期测试
sudo certbot renew --dry-run
```

### 7.6 防火墙配置

```bash
# 开放 HTTP 和 HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp   # SSH
sudo ufw enable

# 注意：不要开放 3001 端口，API 只通过 Nginx 代理访问
```

### 7.7 验证清单

| 检查项 | 验证方法 | 预期结果 |
|--------|----------|----------|
| PM2 进程 | `pm2 status` | taskflow 状态为 `online` |
| Nginx 运行 | `sudo systemctl status nginx` | `active (running)` |
| 页面访问 | 浏览器打开 `http://server-ip` | 显示 TaskFlow 首页 |
| API 可用 | `curl http://server-ip/api/categories` | 返回 JSON |
| 前端路由 | 访问 `/stats` 页面 | 正确显示统计面板（非 404） |
| HTTPS | 访问 `https://your-domain.com` | 证书有效，HTTPS 连接 |

---

## 8. 生产环境配置

### 8.1 环境变量清单

| 变量名 | 默认值 | 说明 | 必须 |
|--------|--------|------|------|
| `NODE_ENV` | `development` | 运行环境 | 生产设为 `production` |
| `PORT` | `3001` | Express 服务端口 | 否 |
| `DB_PATH` | `server/data/taskflow.db` | SQLite 数据库文件路径 | 否（建议生产显式指定） |

### 8.2 后端生产模式调整

```typescript
// server/src/index.ts
import app from './app';
import path from 'path';
import './config/database';

const PORT = Number(process.env.PORT) || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 生产环境：提供前端静态文件
if (NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[${NODE_ENV}] TaskFlow Server running on port ${PORT}`);
});
```

### 8.3 前端生产构建优化

```typescript
// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          utils: ['axios', 'dayjs'],
        },
      },
    },
    // 静态资源目录
    outDir: 'dist',
    assetsDir: 'assets',
    // 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // 移除 console
        drop_debugger: true,
      },
    },
  },
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

### 8.4 构建命令

```bash
# 前端生产构建
cd client && npm run build
# 产出：client/dist/
#   ├── index.html
#   ├── assets/
#   │   ├── index-[hash].js      # 主 bundle
#   │   ├── vendor-[hash].js     # 第三方库
#   │   ├── charts-[hash].js     # 图表库（按需加载）
#   │   └── index-[hash].css     # 样式
```

---

## 9. Nginx 反向代理配置

### 9.1 完整配置模板

```nginx
# /etc/nginx/sites-available/taskflow
# TaskFlow Nginx 配置模板

# ---- 上游服务 ----
upstream taskflow_backend {
    server 127.0.0.1:3001;
    keepalive 32;
}

# ---- HTTP → HTTPS 重定向（启用 HTTPS 后取消注释）----
# server {
#     listen 80;
#     server_name your-domain.com;
#     return 301 https://$host$request_uri;
# }

# ---- 主配置 ----
server {
    listen 80;
    # listen 443 ssl http2;                          # 启用 HTTPS 后取消注释
    # ssl_certificate     /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    server_name your-domain.com;

    # ---- 安全头 ----
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # ---- 前端静态文件 ----
    root /opt/taskflow/client/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # 前端路由：所有非文件请求返回 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # ---- API 反向代理 ----
    location /api/ {
        proxy_pass http://taskflow_backend;
        proxy_http_version 1.1;

        # 保持连接
        proxy_set_header Connection "";

        # 传递真实信息
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时配置
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;

        # 缓冲配置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }

    # ---- 禁止访问敏感路径 ----
    location ~ /\.(git|env|db) {
        deny all;
        return 404;
    }

    location ~ /server/ {
        deny all;
        return 404;
    }

    location ~ /data/ {
        deny all;
        return 404;
    }

    # ---- 日志 ----
    access_log /opt/taskflow/logs/nginx/access.log;
    error_log  /opt/taskflow/logs/nginx/error.log;
}
```

### 9.2 配置说明

| 配置项 | 说明 |
|--------|------|
| `try_files $uri $uri/ /index.html` | 支持 React Router 的前端路由，所有非文件请求回退到 index.html |
| `gzip on` | 启用 Gzip 压缩，减少传输体积 |
| `expires 1y` + `immutable` | Vite 构建的带 hash 文件名资源可永久缓存 |
| `proxy_pass` | 将 `/api/` 请求转发到 Express 后端 |
| `deny all` | 禁止外部访问 `.git`、`server/`、`data/` 等敏感目录 |

---

## 10. 数据管理策略

### 10.1 数据库文件说明

| 项目 | 说明 |
|------|------|
| 文件位置 | 由 `DB_PATH` 环境变量指定，默认 `server/data/taskflow.db` |
| 文件格式 | SQLite 3 二进制文件 |
| 大小预估 | 空库约 20KB；1000 条任务约 100KB ~ 500KB |
| 增长特点 | 随数据增长缓慢增加，删除操作可能不会立即减小文件体积 |

### 10.2 备份策略

#### 手动备份

```bash
# 简单复制数据库文件（需在无写入操作时执行）
cp /opt/taskflow/data/taskflow.db /opt/taskflow/backups/taskflow-$(date +%Y%m%d-%H%M%S).db
```

#### 定时自动备份（Linux）

```bash
# 创建备份脚本
cat > /opt/taskflow/scripts/backup.sh << 'SCRIPT'
#!/bin/bash
BACKUP_DIR="/opt/taskflow/backups"
DB_PATH="/opt/taskflow/data/taskflow.db"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/taskflow-${TIMESTAMP}.db"

# 确保备份目录存在
mkdir -p ${BACKUP_DIR}

# 使用 SQLite 的 .backup 命令安全备份（不锁库）
sqlite3 ${DB_PATH} ".backup '${BACKUP_FILE}'"

# 压缩备份
gzip ${BACKUP_FILE}

# 只保留最近 7 天的备份
find ${BACKUP_DIR} -name "taskflow-*.db.gz" -mtime +7 -delete

echo "[$(date)] Backup completed: ${BACKUP_FILE}.gz"
SCRIPT

chmod +x /opt/taskflow/scripts/backup.sh
```

```bash
# 添加定时任务（每天凌晨 2 点备份）
crontab -e
# 添加以下行：
0 2 * * * /opt/taskflow/scripts/backup.sh >> /opt/taskflow/logs/backup.log 2>&1
```

### 10.3 数据恢复

```bash
# 停止服务
pm2 stop taskflow

# 解压备份
gunzip -c /opt/taskflow/backups/taskflow-20260707-020000.db.gz > /opt/taskflow/data/taskflow.db

# 重启服务
pm2 start taskflow
```

### 10.4 数据导出（可选增强）

后续版本可增加数据导出功能：

```bash
# 导出为 JSON
sqlite3 -json taskflow.db "SELECT * FROM tasks" > tasks-export.json

# 导出为 CSV
sqlite3 -csv taskflow.db "SELECT * FROM tasks" > tasks-export.csv
```

---

## 11. 进程管理与守护

### 11.1 PM2 配置

**ecosystem.config.js**（推荐）：

```javascript
// /opt/taskflow/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'taskflow',
      script: 'npx',
      args: 'tsx server/src/index.ts',
      cwd: '/opt/taskflow',
      instances: 1,                    // SQLite 不支持多实例
      autorestart: true,               // 崩溃自动重启
      watch: false,                    // 生产环境不监听文件变化
      max_memory_restart: '256M',      // 内存超限重启
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        DB_PATH: '/opt/taskflow/data/taskflow.db',
      },
      // 日志配置
      error_file: '/opt/taskflow/logs/pm2-error.log',
      out_file: '/opt/taskflow/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
```

**使用方式**：

```bash
# 使用配置文件启动
pm2 start /opt/taskflow/ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save

# 常用命令
pm2 status              # 查看状态
pm2 logs taskflow       # 查看日志
pm2 restart taskflow    # 重启
pm2 stop taskflow       # 停止
pm2 reload taskflow     # 零停机重载
pm2 monit               # 实时监控面板
```

### 11.2 Systemd 服务（替代 PM2）

```ini
# /etc/systemd/system/taskflow.service
[Unit]
Description=TaskFlow Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/taskflow
ExecStart=/usr/bin/npx tsx server/src/index.ts
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3001
Environment=DB_PATH=/opt/taskflow/data/taskflow.db

# 安全加固
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=/opt/taskflow/data
PrivateTmp=true

# 日志
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**使用方式**：

```bash
# 启用并启动
sudo systemctl daemon-reload
sudo systemctl enable taskflow
sudo systemctl start taskflow

# 常用命令
sudo systemctl status taskflow    # 查看状态
sudo systemctl restart taskflow   # 重启
sudo systemctl stop taskflow      # 停止
journalctl -u taskflow -f         # 查看日志
```

---

## 12. CI/CD 自动化部署

### 12.1 GitHub Actions 配置

```yaml
# .github/workflows/deploy.yml
name: Deploy TaskFlow

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd server && npm install && cd ..
          cd client && npm install && cd ..

      - name: Run backend tests
        run: cd server && npx vitest run

      - name: Build frontend
        run: cd client && npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/taskflow
            git pull origin main
            cd server && npm install --production && cd ..
            cd client && npm install && npm run build && cd ..
            pm2 restart taskflow
            echo "Deployment completed at $(date)"
```

### 12.2 部署流程

```
代码推送 → GitHub Actions 触发
    │
    ├── Job 1: 测试
    │   ├── 安装依赖
    │   ├── 运行后端单元测试
    │   └── 构建前端
    │
    └── Job 2: 部署（测试通过后）
        ├── SSH 连接服务器
        ├── 拉取最新代码
        ├── 安装后端依赖
        ├── 构建前端
        └── PM2 重启服务
```

### 12.3 密钥配置

在 GitHub 仓库 Settings → Secrets 中添加：

| Secret 名称 | 说明 |
|-------------|------|
| `SERVER_HOST` | 服务器 IP 或域名 |
| `SERVER_USER` | SSH 用户名 |
| `SSH_PRIVATE_KEY` | SSH 私钥 |

---

## 13. 监控与日志

### 13.1 应用日志

**日志级别约定**：

| 级别 | 使用场景 | 示例 |
|------|----------|------|
| INFO | 服务启动、关键操作 | `[INFO] Server started on port 3001` |
| WARN | 可恢复异常 | `[WARN] Database file approaching size limit` |
| ERROR | 不可恢复错误 | `[ERROR] Failed to write to database: disk full` |

**日志查看**：

```bash
# PM2 日志
pm2 logs taskflow              # 实时查看
pm2 logs taskflow --lines 100  # 最近 100 行

# Systemd 日志
journalctl -u taskflow -f                  # 实时
journalctl -u taskflow --since today       # 今天
journalctl -u taskflow --since "1 hour ago" # 最近 1 小时

# Nginx 日志
tail -f /opt/taskflow/logs/nginx/access.log
tail -f /opt/taskflow/logs/nginx/error.log
```

### 13.2 健康检查

```bash
# 简单健康检查
curl -f http://localhost:3001/api/categories || echo "UNHEALTHY"

# 详细健康检查脚本
cat > /opt/taskflow/scripts/healthcheck.sh << 'SCRIPT'
#!/bin/bash
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/categories)
if [ "$RESPONSE" = "200" ]; then
    echo "[OK] TaskFlow is healthy"
    exit 0
else
    echo "[FAIL] TaskFlow returned HTTP $RESPONSE"
    pm2 restart taskflow
    exit 1
fi
SCRIPT
chmod +x /opt/taskflow/scripts/healthcheck.sh
```

```bash
# 添加定时健康检查（每 5 分钟）
crontab -e
# 添加以下行：
*/5 * * * * /opt/taskflow/scripts/healthcheck.sh >> /opt/taskflow/logs/healthcheck.log 2>&1
```

### 13.3 资源监控

```bash
# PM2 内置监控
pm2 monit

# 查看系统资源
top -p $(pgrep -f "tsx server") -b -n 1

# 查看磁盘使用
du -sh /opt/taskflow/data/taskflow.db
df -h /opt/taskflow
```

---

## 14. 安全加固

### 14.1 网络安全

| 措施 | 说明 | 实施方式 |
|------|------|----------|
| **防火墙** | 只开放必要端口 | `ufw allow 80; ufw allow 443; ufw allow 22` |
| **端口不暴露** | 3001 端口不对外开放 | API 只通过 Nginx 代理访问 |
| **HTTPS** | 加密传输 | Let's Encrypt 免费证书 |
| **CORS** | 限制跨域来源 | 只允许指定域名 |

### 14.2 应用安全

| 措施 | 说明 | 实施方式 |
|------|------|----------|
| **输入校验** | 防止 SQL 注入和 XSS | zod Schema 校验 + 参数化 SQL |
| **安全头** | HTTP 安全响应头 | Nginx 配置 X-Frame-Options 等 |
| **隐藏敏感路径** | 禁止访问 .git、data 等 | Nginx deny 规则 |
| **环境变量** | 不硬编码敏感信息 | 使用 .env 文件，加入 .gitignore |

### 14.3 系统安全

| 措施 | 说明 | 实施方式 |
|------|------|----------|
| **非 root 运行** | 降低权限风险 | PM2/Systemd 使用专用用户 |
| **最小权限** | 只给必要的文件权限 | 数据目录可写，代码目录只读 |
| **自动更新** | 修复安全漏洞 | `unattended-upgrades`（Ubuntu） |
| **SSH 密钥** | 禁用密码登录 | `sshd_config: PasswordAuthentication no` |

### 14.4 安全检查清单

- [ ] 防火墙已配置，只开放 80/443/22 端口
- [ ] 3001 端口未对外暴露
- [ ] HTTPS 已启用（如有域名）
- [ ] `.git`、`data/`、`server/` 目录不可通过 URL 访问
- [ ] `.env` 文件不在 Git 仓库中
- [ ] 应用以非 root 用户运行
- [ ] SSH 禁用密码登录
- [ ] 数据库备份已配置

---

## 15. 部署验证清单

### 15.1 部署后完整验证

部署完成后，按以下清单逐项验证：

| 序号 | 检查项 | 验证方法 | 通过标准 | 结果 |
|------|--------|----------|----------|------|
| 1 | 服务进程运行 | `pm2 status` 或 `docker ps` | 进程状态正常 | ☐ |
| 2 | 前端页面加载 | 浏览器打开首页 | 页面正常显示，无白屏 | ☐ |
| 3 | API 接口可用 | `curl <url>/api/categories` | 返回 4 个预置分类 | ☐ |
| 4 | 创建任务 | 在前端创建一条任务 | 任务出现在列表中 | ☐ |
| 5 | 编辑任务 | 编辑刚才的任务 | 修改生效 | ☐ |
| 6 | 删除任务 | 删除该任务 | 任务从列表消失 | ☐ |
| 7 | 状态切换 | 切换任务状态 | 状态标签颜色变化 | ☐ |
| 8 | 筛选功能 | 按状态筛选 | 列表正确过滤 | ☐ |
| 9 | 统计面板 | 打开统计页面 | 数据与实际一致 | ☐ |
| 10 | 数据库持久化 | 重启服务后检查 | 数据仍在 | ☐ |
| 11 | 前端路由 | 直接访问 `/stats` | 正确显示（非 404） | ☐ |
| 12 | 安全头 | DevTools → Network 查看响应头 | 包含 X-Frame-Options 等 | ☐ |

### 15.2 冒烟测试脚本

```bash
#!/bin/bash
# /opt/taskflow/scripts/smoke-test.sh
# 部署后快速验证核心功能

BASE_URL="${1:-http://localhost:3001}"
PASS=0
FAIL=0

echo "=== TaskFlow Smoke Test ==="
echo "Target: ${BASE_URL}"
echo ""

# 1. 健康检查
STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/categories)
if [ "$STATUS" = "200" ]; then
    echo "[PASS] API health check"
    ((PASS++))
else
    echo "[FAIL] API health check (HTTP ${STATUS})"
    ((FAIL++))
fi

# 2. 创建任务
RESPONSE=$(curl -s -X POST ${BASE_URL}/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"Smoke Test Task"}')
TASK_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
if [ -n "$TASK_ID" ]; then
    echo "[PASS] Create task (id=${TASK_ID})"
    ((PASS++))
else
    echo "[FAIL] Create task"
    ((FAIL++))
fi

# 3. 查询任务
STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/tasks/${TASK_ID})
if [ "$STATUS" = "200" ]; then
    echo "[PASS] Get task by id"
    ((PASS++))
else
    echo "[FAIL] Get task by id (HTTP ${STATUS})"
    ((FAIL++))
fi

# 4. 更新状态
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH ${BASE_URL}/api/tasks/${TASK_ID}/status \
    -H "Content-Type: application/json" \
    -d '{"status":"IN_PROGRESS"}')
if [ "$STATUS" = "200" ]; then
    echo "[PASS] Update task status"
    ((PASS++))
else
    echo "[FAIL] Update task status (HTTP ${STATUS})"
    ((FAIL++))
fi

# 5. 删除任务
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE ${BASE_URL}/api/tasks/${TASK_ID})
if [ "$STATUS" = "200" ]; then
    echo "[PASS] Delete task"
    ((PASS++))
else
    echo "[FAIL] Delete task (HTTP ${STATUS})"
    ((FAIL++))
fi

# 6. 统计接口
STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/api/stats)
if [ "$STATUS" = "200" ]; then
    echo "[PASS] Stats API"
    ((PASS++))
else
    echo "[FAIL] Stats API (HTTP ${STATUS})"
    ((FAIL++))
fi

echo ""
echo "=== Results: ${PASS} passed, ${FAIL} failed ==="
exit $FAIL
```

```bash
chmod +x /opt/taskflow/scripts/smoke-test.sh

# 执行冒烟测试
/opt/taskflow/scripts/smoke-test.sh http://localhost:3001
```

---

## 16. 回滚方案

### 16.1 回滚触发条件

| 情况 | 操作 |
|------|------|
| 新版本核心功能不可用 | 立即回滚 |
| 数据异常 | 回滚代码 + 恢复数据库备份 |
| 性能严重下降 | 评估后决定是否回滚 |

### 16.2 回滚步骤

**代码回滚**：

```bash
# 查看最近的 Git 提交
cd /opt/taskflow
git log --oneline -10

# 回滚到指定版本
git checkout <commit-hash>

# 重新安装依赖并构建
cd server && npm install --production && cd ..
cd client && npm install && npm run build && cd ..

# 重启服务
pm2 restart taskflow
```

**数据回滚**（如需要）：

```bash
# 停止服务
pm2 stop taskflow

# 恢复备份
gunzip -c /opt/taskflow/backups/taskflow-XXXXXXXX.db.gz > /opt/taskflow/data/taskflow.db

# 重启服务
pm2 start taskflow
```

### 16.3 Docker 回滚

```bash
# 查看镜像历史
docker images | grep taskflow

# 回滚到上一个镜像
docker tag taskflow-app:previous taskflow-app:latest
docker compose up -d

# 或直接指定镜像版本
docker compose down
docker tag <image-id> taskflow-app:latest
docker compose up -d
```

---

## 17. 运维手册

### 17.1 日常运维命令速查

| 操作 | PM2 方案 | Docker 方案 | Systemd 方案 |
|------|----------|-------------|--------------|
| 启动 | `pm2 start ecosystem.config.js` | `docker compose up -d` | `systemctl start taskflow` |
| 停止 | `pm2 stop taskflow` | `docker compose stop` | `systemctl stop taskflow` |
| 重启 | `pm2 restart taskflow` | `docker compose restart` | `systemctl restart taskflow` |
| 状态 | `pm2 status` | `docker compose ps` | `systemctl status taskflow` |
| 日志 | `pm2 logs taskflow` | `docker compose logs -f` | `journalctl -u taskflow -f` |
| 监控 | `pm2 monit` | `docker stats` | `systemd-cgtop` |

### 17.2 常见问题排查

| 问题 | 可能原因 | 排查方法 | 解决方案 |
|------|----------|----------|----------|
| 页面白屏 | 前端构建失败 / Nginx 配置错误 | 检查 Nginx 错误日志 | `nginx -t` 检查配置；重新构建前端 |
| API 返回 502 | Express 服务未启动 / 端口错误 | `pm2 status` 查看进程 | 重启服务；检查端口配置 |
| 数据丢失 | 数据库路径配置错误 / Volume 未挂载 | 检查 `DB_PATH` 环境变量 | 确认数据目录挂载正确 |
| 无法访问（外网） | 防火墙 / 安全组未开放 | 检查云控制台安全组规则 | 开放 80/443 端口 |
| 数据库锁定 | 多进程并发写入 | 检查 PM2 实例数 | 确保 `instances: 1` |
| 磁盘空间不足 | 日志/备份文件积累 | `df -h` 查看磁盘 | 清理旧日志和旧备份 |
| 内存溢出 | Node.js 内存泄漏 | `pm2 monit` 查看内存 | 设置 `max_memory_restart` |

### 17.3 版本更新流程

```
1. 本地开发完成 + 测试通过
       ↓
2. 推送代码到 Git 仓库
       ↓
3. 服务器拉取最新代码
       ↓
4. 安装新依赖（如有）
       ↓
5. 重新构建前端
       ↓
6. 执行冒烟测试
       ↓
7. 重启服务
       ↓
8. 验证功能正常
```

```bash
# 一键更新脚本
cat > /opt/taskflow/scripts/update.sh << 'SCRIPT'
#!/bin/bash
set -e

echo "=== TaskFlow Update ==="
echo "[$(date)] Starting update..."

cd /opt/taskflow

# 1. 备份当前数据库
bash scripts/backup.sh

# 2. 拉取最新代码
git pull origin main

# 3. 安装依赖
cd server && npm install --production && cd ..
cd client && npm install && npm run build && cd ..

# 4. 重启服务
pm2 restart taskflow

# 5. 等待服务启动
sleep 3

# 6. 冒烟测试
bash scripts/smoke-test.sh http://localhost:3001

echo "[$(date)] Update completed!"
SCRIPT
chmod +x /opt/taskflow/scripts/update.sh
```

---

## 18. 部署方案对比与选择指南

### 18.1 方案对比

| 维度 | 方案一：本地 | 方案二：Docker | 方案三：云平台 | 方案四：云服务器 |
|------|-------------|---------------|---------------|----------------|
| **上手难度** | ★☆☆☆☆ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ |
| **部署耗时** | 5 分钟 | 15 分钟 | 30 分钟 | 30 分钟 |
| **公网访问** | 否（需内网穿透） | 否（需端口映射） | 是 | 是 |
| **环境隔离** | 无 | 完全隔离 | 完全隔离 | 无 |
| **数据持久化** | 本地文件 | Docker Volume | Railway Volume | 服务器磁盘 |
| **迁移便捷** | 中 | 高（docker compose 一键） | 高 | 低 |
| **运维成本** | 低 | 低 | 低（托管） | 中 |
| **月成本** | 0 | 0 | 免费额度 / ~$5 | ~¥50-200 |
| **适合阶段** | 开发/个人使用 | 测试/生产 | 生产 | 生产 |

### 18.2 选择建议

```
你是谁？                        → 推荐方案
──────────────────────────────────────────────
编程新手，只想自己用              → 方案一（本地部署）
想学习 Docker                    → 方案二（Docker 部署）
需要手机/其他设备访问             → 方案三 或 方案四
想要最省心的生产部署              → 方案二（Docker）
想要前端 CDN 加速                → 方案三（云平台分离）
有云服务器，想完全控制             → 方案四（云服务器）
```

### 18.3 推荐路径

**新手学习路径**：

```
方案一（本地部署）
    │ 先跑起来，熟悉功能
    ↓
方案二（Docker 部署）
    │ 学习容器化，理解生产部署
    ↓
方案三 或 方案四（公网部署）
    │ 实现随时随地访问
    ↓
CI/CD 自动化
    实现代码推送自动部署
```

---

> 📌 **部署说明**：建议新手从方案一（本地部署）开始，确保项目能正常运行后再逐步尝试其他方案。所有方案的核心步骤一致：安装依赖 → 构建前端 → 启动后端 → 配置代理。数据库文件 `taskflow.db` 的持久化是部署中最需要关注的点。
