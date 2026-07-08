import { Express } from 'express';
import taskRoutes from './taskRoutes';
import categoryRoutes from './categoryRoutes';
import statsRoutes from './statsRoutes';

export function registerRoutes(app: Express) {
  // 健康检查接口
  app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', message: 'TaskFlow API is running' } });
  });

  // 注册业务路由
  app.use('/api/tasks', taskRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/stats', statsRoutes);
}
