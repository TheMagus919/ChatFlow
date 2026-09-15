import { Request, Response } from 'express';
import * as statisticsService from '../services/statisticsService';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {

  try {

    if (!req.user?.userId) {
      res.status(401).json({
        error: 'Usuario no autenticado'
      });
      return;
    }

    const data = await statisticsService.getDashboardStats(
      req.user.userId
    );

    res.json(data);

  } catch (error) {

    console.error('Error loading statistics:', error);

    res.status(500).json({
      error: 'Error loading statistics'
    });
  }
};
