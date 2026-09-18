import { Router } from 'express';

import { NotificationController } from '../controllers/notificationController';

import { authenticateToken } from '../middleware/auth';

const router = Router();

const controller =
  new NotificationController();


router.get(
  '/',
  authenticateToken,
  controller.getNotifications.bind(controller)
);


router.get(
  '/unread',
  authenticateToken,
  controller.countUnread.bind(controller)
);


router.patch(
  '/read-all',
  authenticateToken,
  controller.markAllAsRead.bind(controller)
);


router.patch(
  '/:id/read',
  authenticateToken,
  controller.markAsRead.bind(controller)
);


router.post(
  '/',
  authenticateToken,
  controller.create.bind(controller)
);


export default router;