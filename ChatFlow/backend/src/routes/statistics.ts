import { Router } from 'express';
import {getDashboardStats} from '../controllers/statisticsController';
import {authenticateToken} from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getDashboardStats);

export default router;