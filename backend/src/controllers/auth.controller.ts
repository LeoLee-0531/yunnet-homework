import { Request, Response } from 'express';
import prisma from '../prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10; // 密碼雜湊的強度

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, studentId, department, bed, password } = req.body;

    // TODO: 基本的輸入驗證 (建議使用 zod 或 express-validator 等套件進行更完善的驗證)
    if (!name || !studentId || !department || !password) {
      res.status(400).json({ message: '姓名、學號、系級和密碼為必填欄位' });
      return;
    }

    // 檢查學號是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { studentId },
    });

    if (existingUser) {
      res.status(409).json({ message: '此學號已被註冊' });
      return;
    }

    // 雜湊密碼
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 建立使用者
    const newUser = await prisma.user.create({
      data: {
        name,
        studentId,
        department,
        bed,
        password: hashedPassword // 如果 tags 未提供，預設為空陣列
      },
    });

    // 不要在回應中返回密碼
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: '使用者註冊成功', user: userWithoutPassword });

  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({ message: '伺服器內部錯誤' });
  }
};

// TODO: 確保您在 .env 檔案中設定了 JWT_SECRET
// JWT_SECRET=your_very_secret_key_for_jwt
const JWT_SECRET = process.env.JWT_SECRET || 'DEFAULT_SECRET_KEY'; // 務必使用環境變數

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      res.status(400).json({ message: '學號和密碼為必填欄位' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { studentId },
    });

    if (!user) {
      res.status(401).json({ message: '學號或密碼錯誤' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: '學號或密碼錯誤' });
      return;
    }

    // 產生 JWT Token
    const token = jwt.sign(
      { userId: user.id, studentId: user.studentId },
      JWT_SECRET,
      { expiresIn: '1h' } // Token 有效期，例如 1 小時
    );

    // 不要在回應中返回密碼
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ message: '登入成功', token, user: userWithoutPassword });

  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({ message: '伺服器內部錯誤' });
  }
};