import { RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
// ==================== INTERFACES ====================

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  description?: string;
}

export interface UserSubscription extends RowDataPacket {
  id: number;
  subscription_plan: string | null;
  subscription_status: string | null;
  subscription_id: string | null;
  stripe_customer_id: string | null;
  customers_limit: number;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionResponse {
  success: boolean;
  plan?: string;
  status?: string;
  customersLimit?: number;
  isFree?: boolean;
  renewalDate?: Date;
  error?: string;
}

// ==================== PLAN LIMITS ====================

export const PLAN_LIMITS: Record<string, number> = {
  business: 1000,
  pro: 100,
  free: 10,
};

export const PLAN_NAMES: Record<string, string> = {};

if (process.env.STRIPE_PRICE_PRO) {
  PLAN_NAMES[process.env.STRIPE_PRICE_PRO] = 'pro';
}

if (process.env.STRIPE_PRICE_BUSINESS) {
  PLAN_NAMES[process.env.STRIPE_PRICE_BUSINESS] = 'business';
}

// ==================== WEBHOOK EVENTS ====================

export enum WebhookEventType {
  CHECKOUT_COMPLETED = 'checkout.session.completed',
  SUBSCRIPTION_UPDATED = 'customer.subscription.updated',
  SUBSCRIPTION_DELETED = 'customer.subscription.deleted',
  INVOICE_PAYMENT_FAILED = 'invoice.payment_failed',
}