import { Router } from 'express';

import * as subscriptionsController
  from '../controllers/subscriptionController';

import { authenticateToken }
  from '../middleware/auth';

const router = Router();


// ====================
// RUTAS PÚBLICAS
// ====================

router.get(
  '/plans',
  subscriptionsController.getPlans
);


// ====================
// RUTAS PROTEGIDAS
// ====================

router.post(
  '/create-checkout',
  authenticateToken,
  subscriptionsController.createCheckout
);

router.get(
  '/current',
  authenticateToken,
  subscriptionsController.getCurrentSubscription
);

router.post(
  '/cancel',
  authenticateToken,
  subscriptionsController.cancelSubscription
);

router.post(
  '/portal',
  authenticateToken,
  subscriptionsController.createPortalSession
);


// ====================
// WEBHOOK STRIPE
// ====================

router.post(
  '/webhook',
  subscriptionsController.handleWebhook
);


export default router;

/*
  import { Router, Request, Response } from 'express';
  import * as subscriptionsController from '../controllers/subscriptionController';
  import { authenticateToken } from '../middleware/auth';

  const router = Router();

  router.get('/plans', subscriptionsController.getPlans);

  router.post(
    '/create-checkout',
    authenticateToken,
    subscriptionsController.createCheckout
  );

  router.get(
    '/current',
    authenticateToken,
    subscriptionsController.getCurrentSubscription
  );

  router.post(
    '/cancel',
    authenticateToken,
    subscriptionsController.cancelSubscription
  );
  router.post(
    '/portal',
    authenticateToken,
    subscriptionsController.createPortalSession
  );
  router.post('/webhook', subscriptionsController.handleWebhook);

  export default router;
*/