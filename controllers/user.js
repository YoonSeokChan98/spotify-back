import db from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { User } = db;
const JWT_SECRET = process.env.JWT_SECRET;

//ANCHOR - 회원가입
export const signup = async (req, res) => {
  try {
    const { userId, userPassword } = req.body;

    // 이미 만들어진 계정인지 확인인
    const find = await User.findOne({ where: userId });
    if (find) {
      return res.json({
        result: false,
        message: `이미 있는 계정입니다`,
      });
    }

    // 유저 비밀번호 암호화화
    const encryption = await bcrypt.hash(userPassword, 10);

    // 유저 모델에 유저 데이터 생성성
    const newUser = await User.create({
      userId,
      userPassword: encryption,
    });

    res.json({
      result: true,
      data: newUser,
      message: `회원가입 성공`,
    });
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};

//ANCHOR - 로그인
export const login = async (req, res) => {
  try {
    const { userId, userPassword } = req.body;

    const find = await User.findOne({
      where: {
        userId,
      },
    });
    console.log('🚀 ~ login ~ find:', find);
    if (find) {
      const decryption = await bcrypt.compare(userPassword, find.userPassword);
      if (decryption) {
        
      } else {
        
      }
    } else {
      res.json({
        result: false,
        message: `존재하지 않는 계정입니다.`,
      });
    }
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
