import { Request, Response } from 'express';
import db from '../config/database';
import * as stripeService from '../services/stripeService';
import { PLAN_LIMITS, PLAN_NAMES, WebhookEventType } from '../models/Subscription';

interface AuthRequest extends Request {
  user?: { userId: number; email: string };

}

// ==================== GET PLANS ====================

/**
 * GET /api/subscriptions/plans
 * Obtiene todos los planes disponibles de Stripe
 */
export async function getPlans(req: AuthRequest, res: Response): Promise<void> {
  try {
    const prices = await stripeService.getActivePlans();

    const plans = prices
      .filter((price: any) => price.recurring !== null)
      .map((price: any) => {
        const product = price.product;
        return {
          id: price.id,
          name: product?.name || 'Plan',
          price: (price.unit_amount || 0) / 100,
          currency: price.currency?.toUpperCase() || 'USD',
          interval: price.recurring?.interval || 'month',
          description: product?.description || '',
        };
      });

    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error fetching plans',
    });
  }
}

// ==================== CREATE CHECKOUT ====================

/**
 * POST /api/subscriptions/create-checkout
 * Crea una sesión de checkout de Stripe
 */
export async function createCheckout(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { priceId } = req.body;
    const userId = req.user?.userId;
    const userEmail = req.user?.email;

    // Validación de entrada
    if (!priceId) {
      res.status(400).json({
        success: false,
        error: 'priceId es requerido',
      });
      return;
    }

    if (!userId || !userEmail) {
      res.status(401).json({
        success: false,
        error: 'No autorizado',
      });
      return;
    }

    // Verificar que el precio existe y está activo
    const price = await stripeService.getPriceById(priceId);

    if (!price || !price.active) {
      res.status(400).json({
        success: false,
        error: 'El plan seleccionado no está disponible',
      });
      return;
    }

    // Determinar el límite según el plan
    let plannedLimit = 10;
    let planKey = 'free';

    for (const [key, limit] of Object.entries(PLAN_LIMITS)) {
      if (priceId.includes(key)) {
        plannedLimit = limit;
        planKey = key;
        break;
      }
    }

    const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:4200';

    const session = await stripeService.createCheckoutSession({
      priceId,
      userId,
      userEmail,
      origin,
      plannedLimit,
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error creating checkout',
    });
  }
}

// ==================== GET CURRENT SUBSCRIPTION ====================

/**
 * GET /api/subscriptions/current
 * Obtiene el estado de suscripción del usuario
 */
export async function getCurrentSubscription(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'No autorizado',
      });
      return;
    }

    const [rows] = await db.query(
      `SELECT 
        subscription_plan, 
        subscription_status, 
        customers_limit,
        created_at,
        updated_at
      FROM users 
      WHERE id = ?`,
      [userId]
    );

    if (!rows || (rows as any[]).length === 0) {
      res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
      return;
    }

    const user = (rows as any[])[0];
    const isFree = !user.subscription_plan || user.subscription_plan === 'free';

    res.json({
      success: true,
      plan: user.subscription_plan || 'free',
      status: user.subscription_status || 'inactive',
      customersLimit: user.customers_limit || 10,
      isFree,
      renewalDate: user.updated_at || user.created_at,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error fetching subscription',
    });
  }
}

// ==================== CANCEL SUBSCRIPTION ====================

/**
 * POST /api/subscriptions/cancel
 * Cancela la suscripción del usuario
 */
export async function cancelSubscription(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'No autorizado',
      });
      return;
    }

    const [users] = await db.query(
      'SELECT subscription_id FROM users WHERE id = ?',
      [userId]
    );

    const userData = (users as any[])[0];

    if (!userData || !userData.subscription_id) {
      res.status(400).json({
        success: false,
        error: 'No tienes una suscripción activa',
      });
      return;
    }

    // Cancelar en Stripe
    await stripeService.cancelSubscription(userData.subscription_id);

    // Actualizar en DB
    await db.query(
      `UPDATE users SET 
        subscription_plan = 'free',
        subscription_status = 'cancelled',
        subscription_id = NULL,
        customers_limit = 10,
        updated_at = NOW()
      WHERE id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Suscripción cancelada correctamente',
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error canceling subscription',
    });
  }
}

// ==================== CREATE PORTAL SESSION ====================

/**
 * POST /api/subscriptions/portal
 * Crea una sesión del portal de facturación
 */
export async function createPortalSession(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user?.userId;
    const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:4200';

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'No autorizado',
      });
      return;
    }

    const [users] = await db.query(
      'SELECT stripe_customer_id FROM users WHERE id = ?',
      [userId]
    );

    const userData = (users as any[])[0];

    if (!userData || !userData.stripe_customer_id) {
      res.status(400).json({
        success: false,
        error: 'No tienes un cliente asociado',
      });
      return;
    }

    const session = await stripeService.createBillingPortalSession({
      customerId: userData.stripe_customer_id,
      returnUrl: `${origin}/dashboard`,
    });

    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Error creating portal session',
    });
  }
}

// ==================== WEBHOOK HANDLER ====================

/**
 * POST /api/subscriptions/webhook
 * Maneja los eventos de Stripe
 */
export async function handleWebhook(req: AuthRequest, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: any;

  try {
    // En desarrollo, omitir verificación si no hay secret
    if (!webhookSecret || webhookSecret.startsWith('whsec_')) {
      console.warn('⚠️ Webhook secret no configurado, saltando verificación');
      event = JSON.parse(req.body.toString());
    } else {
      event = stripeService.verifyWebhookSignature(
        req.body,
        sig,
        webhookSecret
      );
    }
  } catch (err) {
    console.error('❌ Error verificando webhook:', err);
    res.status(400).send(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`
    );
    return;
  }

  console.log(`📥 Evento recibido: ${event.type}`);

  try {
    switch (event.type) {
      case WebhookEventType.CHECKOUT_COMPLETED: {
        const session = event.data.object;
        await handleCheckoutCompleted(session);
        break;
      }

      case WebhookEventType.SUBSCRIPTION_UPDATED: {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case WebhookEventType.SUBSCRIPTION_DELETED: {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case WebhookEventType.INVOICE_PAYMENT_FAILED: {
        const invoice = event.data.object;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`ℹ️ Evento no manejado: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    res.status(500).json({ error: 'Error processing webhook' });
  }
}

// ==================== PRIVATE HANDLERS ====================

async function handleCheckoutCompleted(session: any): Promise<void> {
  const userId = parseInt(session.metadata?.userId || '0', 10);
  const plannedLimit = parseInt(session.metadata?.plannedLimit || '10', 10);

  if (!userId) {
    console.error('❌ No se encontró userId en metadata');
    return;
  }

  // Determinar nombre del plan
  let planName = 'free';
  const subscriptionId = session.subscription;

  if (subscriptionId) {
    const subscription = await stripeService.getSubscription(subscriptionId);
    if (subscription) {
      const priceId = subscription.items?.data[0]?.price?.id;
      if (priceId) {
        for (const [key, name] of Object.entries(PLAN_NAMES)) {
          if (priceId.includes(key)) {
            planName = name;
            break;
          }
        }
      }
    }
  }

  await db.query(
    `UPDATE users SET 
      subscription_plan = ?, 
      subscription_status = 'active',
      subscription_id = ?,
      customers_limit = ?,
      updated_at = NOW()
    WHERE id = ?`,
    [planName, subscriptionId, plannedLimit, userId]
  );

  console.log(`✅ Suscripción activada para usuario ${userId}: ${planName}`);
}

async function handleSubscriptionUpdated(subscription: any): Promise<void> {
  const customerId = subscription.customer;
  if (!customerId) return;

  const [users] = await db.query(
    'SELECT id FROM users WHERE stripe_customer_id = ?',
    [customerId]
  );

  if (!users || (users as any[]).length === 0) return;

  const userId = (users as any[])[0].id;
  const status = subscription.status === 'active' ? 'active' : subscription.status;

  await db.query(
    'UPDATE users SET subscription_status = ?, updated_at = NOW() WHERE id = ?',
    [status, userId]
  );

  console.log(`✅ Suscripción actualizada para usuario ${userId}: ${status}`);
}

async function handleSubscriptionDeleted(subscription: any): Promise<void> {
  const customerId = subscription.customer;
  if (!customerId) return;

  const [users] = await db.query(
    'SELECT id FROM users WHERE stripe_customer_id = ?',
    [customerId]
  );

  if (!users || (users as any[]).length === 0) return;

  const userId = (users as any[])[0].id;

  await db.query(
    `UPDATE users SET 
      subscription_plan = 'free',
      subscription_status = 'cancelled',
      subscription_id = NULL,
      customers_limit = 10,
      updated_at = NOW()
    WHERE id = ?`,
    [userId]
  );

  console.log(`❌ Suscripción cancelada para usuario ${userId}`);
}

async function handlePaymentFailed(invoice: any): Promise<void> {
  const customerId = invoice.customer;
  if (!customerId) return;

  const [users] = await db.query(
    'SELECT id FROM users WHERE stripe_customer_id = ?',
    [customerId]
  );

  if (!users || (users as any[]).length === 0) return;

  const userId = (users as any[])[0].id;

  await db.query(
    'UPDATE users SET subscription_status = ? WHERE id = ?',
    ['past_due', userId]
  );

  console.log(`⚠️ Payment failed para usuario ${userId}`);
}