import path from 'path';
import express from 'express';
import app from './app';
import './config/database'; // 初始化数据库

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 生产环境：提供前端静态文件
if (NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));

  // 所有非 /api 的请求返回 index.html（支持前端路由）
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 [${NODE_ENV}] TaskFlow Server running on http://localhost:${PORT}`);
});
