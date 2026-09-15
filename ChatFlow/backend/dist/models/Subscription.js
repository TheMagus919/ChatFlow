"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEventType = exports.PLAN_NAMES = exports.PLAN_LIMITS = void 0;
// ==================== PLAN LIMITS ====================
exports.PLAN_LIMITS = {
    starter: 100,
    pro: 1000,
    enterprise: 10000,
    free: 10,
};
exports.PLAN_NAMES = {
    price_starter: 'starter',
    price_pro: 'pro',
    price_enterprise: 'enterprise',
};
// ==================== WEBHOOK EVENTS ====================
var WebhookEventType;
(function (WebhookEventType) {
    WebhookEventType["CHECKOUT_COMPLETED"] = "checkout.session.completed";
    WebhookEventType["SUBSCRIPTION_UPDATED"] = "customer.subscription.updated";
    WebhookEventType["SUBSCRIPTION_DELETED"] = "customer.subscription.deleted";
    WebhookEventType["INVOICE_PAYMENT_FAILED"] = "invoice.payment_failed";
})(WebhookEventType || (exports.WebhookEventType = WebhookEventType = {}));
