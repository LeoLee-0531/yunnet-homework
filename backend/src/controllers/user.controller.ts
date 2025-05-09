import { Response } from 'express';
import prisma from '../prismaClient';
import { AuthenticatedRequest } from '../middlewares/auth.middleware'; // 引入擴展後的 Request 類型

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: '未授權' });
      return;
    }

    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { // 只選擇需要的欄位，避免洩漏密碼等敏感資訊
        id: true,
        name: true,
        studentId: true,
        department: true,
        bed: true,
        userTags: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: '找不到使用者' });
      return;
    }

    res.status(200).json(user);

  } catch (error) {
    console.error('取得使用者資訊錯誤:', error);
    res.status(500).json({ message: '伺服器內部錯誤' });
  }
};