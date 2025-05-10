import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'DEFAULT_SECRET_KEY';

// 擴展 Express 的 Request 類型以包含 user 屬性
export interface AuthenticatedRequest extends Request {
  user?: { userId: number; studentId: string };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.sendStatus(401); // 未授權
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.error('JWT 驗證錯誤:', err);
      res.sendStatus(403); // 禁止訪問 (Token 無效或過期)
      return;
    }
    req.user = user as { userId: number; studentId: string };
    next();
  });
};