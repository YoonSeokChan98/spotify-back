import express from 'express';
import { login, signup } from '../controllers/user.js';

const router = express.Router();

//ANCHOR - 회원가입
router.post('/signup', signup);
//ANCHOR - 로그인
router.post('/login', login);

export default router;
