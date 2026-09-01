import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';

export class NotificationController {

  private notificationService =
    new NotificationService();

  async getByUser(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        Number(req.params.userId);

      const notifications =
        await this.notificationService
          .getByUser(userId);

      res.json(notifications);

    } catch (error: any) {

      res.status(500).json({
        error: error.message
      });

    }

  }

  async getNotifications(
    req: Request,
    res: Response
  ) {

    try {
      const userId =
      (req as any).user?.userId;
      console.log(
  'notificationService:',
  this.notificationService
);
      const notifications =
        await this.notificationService
          .getByUser(
            Number(userId)
          );
          console.log(
  'notificationService:',
  this.notificationService
);
      res.json(notifications);

    } catch (error: any) {

      res.status(500).json({
        error: error.message
      });

    }

  }

  async create(
    req: Request,
    res: Response
  ) {

    try {

      const {
        userId,
        title,
        message,
        type,
        referenced_id
      } = req.body;
      if(referenced_id == undefined || '' || "" || null){
        const notification =
        await this.notificationService.create(
          userId,
          title,
          message,
          type
        );

      res.status(201).json(
        notification
      );
      }else{
        const notification =
        await this.notificationService.create(
          userId,
          title,
          message,
          type,
          referenced_id
        );

      res.status(201).json(
        notification
      );
      }
      
    } catch (error: any) {

      res.status(500).json({
        error: error.message
      });

    }

  }

  async markAsRead(
    req: Request,
    res: Response
  ) {

    try {
      await this.notificationService
        .markAsRead(
          Number(req.params.id)
        );

      res.json({
        message: 'Notification updated'
      });

    } catch (error: any) {

      res.status(500).json({
        error: error.message
      });

    }

  }

  async markAllAsRead(
    req: Request,
    res: Response
  ) {

    try {
      const userId =(req as any).user?.userId;
      await this.notificationService
        .markAllAsRead(
          Number(userId)
        );

      res.json({
        message: 'All notifications updated'
      });

    } catch (error: any) {

      res.status(500).json({
        error: error.message
      });

    }

  }

  async countUnread(
    req: Request,
    res: Response
  ) {

    try {

      const total =
        await this.notificationService
          .countUnread(
            Number(req.params.userId)
          );

      res.json({
        total
      });

    } catch (error: any) {

      res.status(500).json({
        error: error.message
      });

    }

  }

}