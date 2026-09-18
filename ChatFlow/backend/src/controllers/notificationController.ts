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

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        res.status(400).json({
          error: 'Usuario inválido'
        });
        return;
      }

      const notifications =
        await this.notificationService.getByUser(
          userId
        );

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
        Number((req as any).user?.userId);

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        res.status(401).json({
          error: 'Usuario no autenticado'
        });
        return;
      }

      const notifications =
        await this.notificationService.getByUser(
          userId
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

      const userId =
        Number((req as any).user?.userId);

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        res.status(401).json({
          error: 'Usuario no autenticado'
        });
        return;
      }

      const {
        title,
        message,
        type,
        reference_id
      } = req.body;


      if (
        typeof title !== 'string' ||
        !title.trim()
      ) {
        res.status(400).json({
          error: 'El título es obligatorio'
        });
        return;
      }


      if (
        typeof message !== 'string' ||
        !message.trim()
      ) {
        res.status(400).json({
          error: 'El mensaje es obligatorio'
        });
        return;
      }


      if (
        typeof type !== 'string' ||
        !type.trim()
      ) {
        res.status(400).json({
          error: 'El tipo es obligatorio'
        });
        return;
      }


      const notification =
        await this.notificationService.create(
          userId,
          title.trim(),
          message.trim(),
          type.trim(),
          reference_id
        );

      res.status(201).json(
        notification
      );

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

      const userId =
        Number((req as any).user?.userId);

      const notificationId =
        Number(req.params.id);


      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        res.status(401).json({
          error: 'Usuario no autenticado'
        });
        return;
      }


      if (
        !Number.isInteger(notificationId) ||
        notificationId <= 0
      ) {
        res.status(400).json({
          error: 'ID de notificación inválido'
        });
        return;
      }


      await this.notificationService.markAsRead(
        notificationId,
        userId
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

      const userId =
        Number((req as any).user?.userId);


      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        res.status(401).json({
          error: 'Usuario no autenticado'
        });
        return;
      }


      await this.notificationService.markAllAsRead(
        userId
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

      const userId =
        Number((req as any).user?.userId);


      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        res.status(401).json({
          error: 'Usuario no autenticado'
        });
        return;
      }


      const total =
        await this.notificationService.countUnread(
          userId
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