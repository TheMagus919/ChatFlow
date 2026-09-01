import pool from '../config/database';

export const getDashboardStats =
async (userId: number) => {

  const [customers]: any =
    await pool.query(
      `
      SELECT
        status,
        created_at,
        updated_at
      FROM customers
      WHERE user_id = ?
      `,
      [userId]
    );

  const totalCustomers =
    customers.length;

  const newCustomers =
    customers.filter(
      (c: any) => c.status === 'new'
    ).length;

  const inConversation =
    customers.filter(
      (c: any) =>
        c.status === 'in_conversation'
    ).length;

  const wonCustomers =
    customers.filter(
      (c: any) => c.status === 'won'
    ).length;

  const lostCustomers =
    customers.filter(
      (c: any) => c.status === 'lost'
    ).length;

  const closedCustomers =
    customers.filter(
      (c: any) => c.status === 'closed'
    ).length;
  console.log(customers);
  return {

    totalCustomers,

    newCustomers,

    inConversation,

    wonCustomers,

    lostCustomers,

    closedCustomers,

    conversionRate:

      totalCustomers > 0

        ? (
            wonCustomers /
            totalCustomers
          ) * 100

        : 0,

    customers

  };

};