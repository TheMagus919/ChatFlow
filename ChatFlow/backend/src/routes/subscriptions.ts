import { Router, Request, Response } from 'express';
import * as subscriptionsController from '../controllers/subscriptionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// ==================== RUTAS PÚBLICAS ====================

/**
 * GET /api/subscriptions/plans
 * Obtiene todos los planes disponibles (público)
 */
router.get('/plans', subscriptionsController.getPlans);

// ==================== RUTAS PROTEGIDAS ====================

/**
 * POST /api/subscriptions/create-checkout
 * Crea una sesión de checkout (requiere auth)
 */
router.post(
  '/create-checkout',
  authenticateToken,
  subscriptionsController.createCheckout
);

/**
 * GET /api/subscriptions/current
 * Obtiene la suscripción actual del usuario (requiere auth)
 */
router.get(
  '/current',
  authenticateToken,
  subscriptionsController.getCurrentSubscription
);

/**
 * POST /api/subscriptions/cancel
 * Cancela la suscripción del usuario (requiere auth)
 */
router.post(
  '/cancel',
  authenticateToken,
  subscriptionsController.cancelSubscription
);

/**
 * POST /api/subscriptions/portal
 * Crea una sesión del portal de facturación (requiere auth)
 */
router.post(
  '/portal',
  authenticateToken,
  subscriptionsController.createPortalSession
);

// ==================== WEBHOOK ====================

/**
 * POST /api/subscriptions/webhook
 * Webhook de Stripe (sin middleware de auth)
 * ⚠️ Esta ruta debe configurarse con express.raw() en app.ts
 */
router.post('/webhook', subscriptionsController.handleWebhook);

export default router;