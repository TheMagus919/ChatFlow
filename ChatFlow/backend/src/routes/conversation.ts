import { Router } from 'express';

import {
  getConversations,
  getConversationById,
  createConversation
} from '../controllers/conversationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getConversations);

router.get('/:id', authenticateToken, getConversationById);

router.post('/', authenticateToken, createConversation);

export default router;