import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';
const router = Router();

const controller =
  new NotificationController();

router.get('/',authenticateToken, controller.getNotifications.bind(controller));
router.patch('/read-all', authenticateToken, controller.markAllAsRead.bind(controller));
router.patch('/:id/read', authenticateToken, controller.markAsRead.bind(controller));
router.get('/user/:userId', authenticateToken, controller.getByUser.bind(controller));

router.get(
  '/unread/:userId',
  controller.countUnread.bind(controller)
);

router.post('/', authenticateToken, controller.create.bind(controller));




export default router;