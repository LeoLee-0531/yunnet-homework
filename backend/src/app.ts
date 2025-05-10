import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
// import cors from 'cors'; // 如果前端和後端不同源，需要 CORS

dotenv.config(); // 載入 .env 檔案中的環境變數

const app = express();

// app.use(cors()); // 啟用 CORS (如果需要)
app.use(express.json()); // 解析 JSON 請求體

// 掛載路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 基本的根路由
app.get('/api', (req, res) => {
  res.send('後端 API 服務已啟動');
});

// 錯誤處理中介軟體 (可以做得更完善)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('發生了一些錯誤!');
});

export default app;