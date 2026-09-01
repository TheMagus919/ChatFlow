import Stripe from 'stripe';

// Inicializar cliente de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test', {
  apiVersion: '2026-04-22.dahlia',
});

// ==================== EXPORTAR CLIENTE ====================

export { stripe };

// ==================== INTERFACES LOCALES ====================

export interface CreateCheckoutParams {
  priceId: string;
  userId: number;
  userEmail: string;
  origin: string;
  plannedLimit: number;
}

export interface CreatePortalParams {
  customerId: string;
  returnUrl: string;
}

export interface PlanInfo {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  description: string;
}

// ==================== OBTENER PLANES ====================

export async function getActivePlans() {
  const prices = await stripe.prices.list({
    active: true,
    expand: ['data.product'],
    type: 'recurring',
  });

  return prices.data;
}

export async function getPriceById(priceId: string) {
  try {
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });
    return price;
  } catch {
    return null;
  }
}

// ==================== CHECKOUT ====================

export async function createCheckoutSession(params: CreateCheckoutParams) {
  const { priceId, userId, userEmail, origin, plannedLimit } = params;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?cancelled=true`,
    metadata: {
      userId: userId.toString(),
      plannedLimit: plannedLimit.toString(),
    },
    customer_email: userEmail,
    subscription_data: {
      metadata: {
        userId: userId.toString(),
      },
    },
  });

  return session;
}

// ==================== WEBHOOK ====================

export function verifyWebhookSignature(
  body: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}

// ==================== SUSCRIPCIONES ====================

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function getSubscription(subscriptionId: string) {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch {
    return null;
  }
}

export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
}

// ==================== BILLING PORTAL ====================

export async function createBillingPortalSession(params: CreatePortalParams) {
  const { customerId, returnUrl } = params;

  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

// ==================== CLIENTES ====================

export async function createCustomer(email: string, userId: number) {
  return await stripe.customers.create({
    email,
    metadata: {
      userId: userId.toString(),
    },
  });
}

export async function getCustomer(customerId: string) {
  try {
    return await stripe.customers.retrieve(customerId);
  } catch {
    return null;
  }
}

export async function updateCustomer(customerId: string, data: any) {
  return await stripe.customers.update(customerId, data);
}

// ==================== MÉTODOS DE PAGO ====================

export async function getPaymentMethods(customerId: string) {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  return paymentMethods.data;
}

export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
) {
  return await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
}