import pool from '../config/database';

interface DashboardStats {
  totalCustomers: number;
  newCustomers: number;
  inConversation: number;
  wonCustomers: number;
  lostCustomers: number;
  closedCustomers: number;
  conversionRate: number;
  customers: Array<{
    status: string;
    created_at: Date;
    updated_at: Date;
  }>;
}

export const getDashboardStats = async (
  userId: number
): Promise<DashboardStats> => {

  const [customers] = await pool.query(
    `
    SELECT
      status,
      created_at,
      updated_at
    FROM customers
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId]
  ) as [
    Array<{
      status: string;
      created_at: Date;
      updated_at: Date;
    }>,
    unknown
  ];

  const totalCustomers = customers.length;

  const newCustomers = customers.filter(
    customer => customer.status === 'new'
  ).length;

  const inConversation = customers.filter(
    customer => customer.status === 'in_conversation'
  ).length;

  const wonCustomers = customers.filter(
    customer => customer.status === 'won'
  ).length;

  const lostCustomers = customers.filter(
    customer => customer.status === 'lost'
  ).length;

  const closedCustomers = customers.filter(
    customer => customer.status === 'closed'
  ).length;

  const conversionRate =
    totalCustomers > 0
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
