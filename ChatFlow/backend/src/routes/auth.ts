import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const controller = new AuthController();

// ✅ Arrow functions evitan el problema de 'this'
router.post('/register', (req: Request, res: Response) => controller.register(req, res));
router.post('/login', (req: Request, res: Response) => controller.login(req, res));
router.post('/logout', authenticateToken, (req: Request, res: Response) => controller.logout(req, res));
router.get('/me', authenticateToken, (req: Request, res: Response) => controller.me(req, res));

export default router;