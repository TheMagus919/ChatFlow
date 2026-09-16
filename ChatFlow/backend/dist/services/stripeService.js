"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
exports.getActivePlans = getActivePlans;
exports.getPriceById = getPriceById;
exports.createCheckoutSession = createCheckoutSession;
exports.verifyWebhookSignature = verifyWebhookSignature;
exports.cancelSubscription = cancelSubscription;
exports.getSubscription = getSubscription;
exports.updateSubscription = updateSubscription;
exports.createBillingPortalSession = createBillingPortalSession;
exports.createCustomer = createCustomer;
exports.getCustomer = getCustomer;
exports.updateCustomer = updateCustomer;
exports.getPaymentMethods = getPaymentMethods;
exports.setDefaultPaymentMethod = setDefaultPaymentMethod;
const stripe_1 = __importDefault(require("stripe"));
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY no está configurado');
}
const stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: '2026-04-22.dahlia'
});
exports.stripe = stripe;
// ==================== OBTENER PLANES ====================
async function getActivePlans() {
    const prices = await stripe.prices.list({
        active: true,
        expand: ['data.product'],
        type: 'recurring',
    });
    return prices.data;
}
async function getPriceById(priceId) {
    try {
        const price = await stripe.prices.retrieve(priceId, {
            expand: ['product'],
        });
        return price;
    }
    catch {
        return null;
    }
}
// ==================== CHECKOUT ====================
async function createCheckoutSession(params) {
    const { priceId, userId, userEmail, origin } = params;
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
function verifyWebhookSignature(body, signature, webhookSecret) {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}
// ==================== SUSCRIPCIONES ====================
async function cancelSubscription(subscriptionId) {
    return await stripe.subscriptions.cancel(subscriptionId);
}
async function getSubscription(subscriptionId) {
    try {
        return await stripe.subscriptions.retrieve(subscriptionId);
    }
    catch {
        return null;
    }
}
async function updateSubscription(subscriptionId, newPriceId) {
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
async function createBillingPortalSession(params) {
    const { customerId, returnUrl } = params;
    return await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });
}
// ==================== CLIENTES ====================
async function createCustomer(email, userId) {
    return await stripe.customers.create({
        email,
        metadata: {
            userId: userId.toString(),
        },
    });
}
async function getCustomer(customerId) {
    try {
        return await stripe.customers.retrieve(customerId);
    }
    catch {
        return null;
    }
}
async function updateCustomer(customerId, data) {
    return await stripe.customers.update(customerId, data);
}
// ==================== MÉTODOS DE PAGO ====================
async function getPaymentMethods(customerId) {
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
    });
    return paymentMethods.data;
}
async function setDefaultPaymentMethod(customerId, paymentMethodId) {
    return await stripe.customers.update(customerId, {
        invoice_settings: {
            default_payment_method: paymentMethodId,
        },
    });
}
