import express from 'express';
import db from './models/index.js';
import dotenv from 'dotenv';
import config from './config/config.js';

dotenv.config();

const app = express();

const PORT = 3001;
const HOST = 'localhost';

app.use(express.json());

// 서버 연결 테스트
app.get('/', (req, res) => {
  res.send('서버연결 확인');
});

// api 라우트
// app.use('/api/user');

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
