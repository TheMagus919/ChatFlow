"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEventType = exports.PLAN_NAMES = exports.PLAN_LIMITS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ==================== PLAN LIMITS ====================
exports.PLAN_LIMITS = {
    business: 1000,
    pro: 100,
    free: 10,
};
exports.PLAN_NAMES = {};
if (process.env.STRIPE_PRICE_PRO) {
    exports.PLAN_NAMES[process.env.STRIPE_PRICE_PRO] = 'pro';
}
if (process.env.STRIPE_PRICE_BUSINESS) {
    exports.PLAN_NAMES[process.env.STRIPE_PRICE_BUSINESS] = 'business';
}
// ==================== WEBHOOK EVENTS ====================
var WebhookEventType;
(function (WebhookEventType) {
    WebhookEventType["CHECKOUT_COMPLETED"] = "checkout.session.completed";
    WebhookEventType["SUBSCRIPTION_UPDATED"] = "customer.subscription.updated";
    WebhookEventType["SUBSCRIPTION_DELETED"] = "customer.subscription.deleted";
    WebhookEventType["INVOICE_PAYMENT_FAILED"] = "invoice.payment_failed";
})(WebhookEventType || (exports.WebhookEventType = WebhookEventType = {}));
