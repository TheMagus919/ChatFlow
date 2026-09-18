import { Router, Request, Response } from 'express';

import { AuthController } from '../controllers/authController';

import { authenticateToken } from '../middleware/auth';

const router = Router();

const controller = new AuthController();

// Auth
router.post(
  '/register',
  (req: Request, res: Response) => controller.register(req, res)
);

router.post(
  '/login',
  (req: Request, res: Response) => controller.login(req, res)
);

router.post(
  '/logout',
  authenticateToken,
  (req: Request, res: Response) => controller.logout(req, res)
);

// Usuario autenticado
router.get(
  '/me',
  authenticateToken,
  (req: Request, res: Response) => controller.me(req, res)
);

// Actualizar perfil
router.put(
  '/me',
  authenticateToken,
  (req: Request, res: Response) => controller.updateProfile(req, res)
);

// Cambiar contraseña
router.put(
  '/me/password',
  authenticateToken,
  (req: Request, res: Response) => controller.changePassword(req, res)
);

export default router;