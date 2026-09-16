"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const database_1 = __importDefault(require("../config/database"));
const getDashboardStats = async (userId) => {
    const [customers] = await database_1.default.query(`
    SELECT
      status,
      created_at,
      updated_at
    FROM customers
    WHERE user_id = ?
    ORDER BY created_at DESC
    `, [userId]);
    const totalCustomers = customers.length;
    const newCustomers = customers.filter(customer => customer.status === 'new').length;
    const inConversation = customers.filter(customer => customer.status === 'in_conversation').length;
    const wonCustomers = customers.filter(customer => customer.status === 'won').length;
    const lostCustomers = customers.filter(customer => customer.status === 'lost').length;
    const closedCustomers = customers.filter(customer => customer.status === 'closed').length;
    const conversionRate = totalCustomers > 0
        ? Number(((wonCustomers / totalCustomers) * 100).toFixed(2))
        : 0;
    return {
        totalCustomers,
        newCustomers,
        inConversation,
        wonCustomers,
        lostCustomers,
        closedCustomers,
        conversionRate,
        customers
    };
};
exports.getDashboardStats = getDashboardStats;
