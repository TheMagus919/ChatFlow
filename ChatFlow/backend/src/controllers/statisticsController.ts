import { Request, Response } from 'express';
import * as statisticsService from '../services/statisticsService';

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {

  try {

    const userId =
      (req as any).user?.userId;
    console.log(userId);
    console.log('USER ID:', (req as any).user.id);
    const data =
      await statisticsService.getDashboardStats(
        userId
      );

    return res.json(data);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Error loading statistics'
    });

  }

};