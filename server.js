import express from 'express';
import db from './models/index.js';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './router/user.js';

dotenv.config();

const app = express();

const HOST = 'localhost';
const PORT = 4000;

app.use(
  cors({
    origin: 'http://localhost:3000', // Next.js 실행 주소
  })
);
app.use(express.json());

// 서버 연결 테스트
app.get('/', (req, res) => {
  res.send('서버연결 확인');
});

// API 라우터
app.use('/api/user', userRouter);

// 404
app.get('*', (req, res) => {
  res.send('404 Error!!!');
});

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('DB & 모델 동기화 완료');
    app.listen(PORT, () => {
      console.log(`서버연결 성공 http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`DB 연결 실패`, err);
  });
