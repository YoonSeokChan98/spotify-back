import db from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { User } = db;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_LIFETIME = process.env.JWT_ACCESS_LIFETIME;

//ANCHOR - 회원가입
export const signup = async (req, res) => {
  try {
    const { userId, userPassword } = req.body;

    // 이미 만들어진 계정인지 확인
    const find = await User.findOne({ where: { userId } });
    if (find) {
      return res.status(409).json({
        result: false,
        message: `이미 있는 계정입니다`,
      });
    }

    // 유저 비밀번호 암호화
    const encryption = await bcrypt.hash(userPassword, 10);

    // 유저 모델에 유저 데이터 생성
    const newUser = await User.create({
      userId,
      userPassword: encryption,
    });

    res.status(201).json({
      result: true,
      data: newUser,
      message: `회원가입 성공`,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: '서버오류',
      error: error.message,
    });
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
    if (find) {
      const decryption = await bcrypt.compare(userPassword, find.userPassword);
      if (decryption) {
        // 리덕스에 넣을 유저의 정보
        const userInfo = {
          userId: find.userId,
        };
        // 토큰 발급용 유저의 정보
        const jwtToken = {
          userId: find.userId,
        };
        // 토큰 발급
        const token = jwt.sign({ user: jwtToken }, JWT_SECRET, {
          expiresIn: JWT_ACCESS_LIFETIME,
        });

        res.status(200).json({
          result: true,
          message: '로그인 성공 & 토큰 발급 되었습니다.',
          token,
          data: userInfo,
        });
      } else {
        return res.status(401).json({
          result: false,
          data: null,
          message: '비밀번호가 틀렸습니다',
        });
      }
    } else {
      res.status(404).json({
        result: false,
        message: `존재하지 않는 계정입니다.`,
      });
    }
  } catch (error) {
    res.status(500).json({
      result: false,
      message: '서버오류',
      error: error.message,
    });
  }
};
