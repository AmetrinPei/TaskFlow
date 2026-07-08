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
