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
      `, [userId]);
    const totalCustomers = customers.length;
    const newCustomers = customers.filter((c) => c.status === 'new').length;
    const inConversation = customers.filter((c) => c.status === 'in_conversation').length;
    const wonCustomers = customers.filter((c) => c.status === 'won').length;
    const lostCustomers = customers.filter((c) => c.status === 'lost').length;
    const closedCustomers = customers.filter((c) => c.status === 'closed').length;
    console.log(customers);
    return {
        totalCustomers,
        newCustomers,
        inConversation,
        wonCustomers,
        lostCustomers,
        closedCustomers,
        conversionRate: totalCustomers > 0
            ? (wonCustomers /
                totalCustomers) * 100
            : 0,
        customers
    };
};
exports.getDashboardStats = getDashboardStats;
