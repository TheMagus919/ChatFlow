import { Router } from 'express';

import {
  sendMessage,
  getMessagesByConversation,
  markDelivered,
  simulateIncoming 
} from '../controllers/messagesController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, sendMessage);
router.get('/conversation/:conversationId', authenticateToken, getMessagesByConversation);
router.patch('/delivered', authenticateToken, markDelivered);
router.post('/simulate', simulateIncoming);

export default router;