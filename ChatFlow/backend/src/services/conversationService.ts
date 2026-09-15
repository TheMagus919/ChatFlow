import pool from '../config/database';

export const getConversations = async (
  userId: number
) => {

  const [rows]: any = await pool.query(
    `
    SELECT
      c.id,
      c.customer_id,
      c.users_id,
      c.last_message,
      c.last_message_at,

      cu.id AS customerIdData,
      cu.name,
      cu.phone,
      cu.status,
      cu.avatar

    FROM conversations c

    INNER JOIN customers cu
      ON c.customer_id = cu.id

    WHERE c.users_id = ?

    ORDER BY
      c.last_message_at DESC,
      c.id DESC
    `,
    [userId]
  );

  return rows.map((row: any) => ({
    id: row.id,
    customerId: row.customer_id,
    userId: row.users_id,

    last_message: row.last_message,
    last_message_at: row.last_message_at,

    customer: {
      id: row.customerIdData,
      name: row.name,
      phone: row.phone,
      status: row.status,
      avatar: row.avatar
    }
  }));
};


/**
 * Obtiene una conversación únicamente
 * si pertenece al usuario autenticado.
 */
export const getConversationById = async (
  conversationId: number,
  userId: number
) => {

  const [rows]: any = await pool.query(
    `
    SELECT
      c.id,
      c.customer_id,
      c.users_id,
      c.last_message,
      c.last_message_at,

      cu.id AS customerIdData,
      cu.name,
      cu.phone,
      cu.status,
      cu.avatar

    FROM conversations c

    INNER JOIN customers cu
      ON c.customer_id = cu.id

    WHERE
      c.id = ?
      AND c.users_id = ?

    LIMIT 1
    `,
    [
      conversationId,
      userId
    ]
  );

  if (!rows.length) {
    return null;
  }

  const row = rows[0];

  return {
    id: row.id,
    customerId: row.customer_id,
    userId: row.users_id,

    last_message: row.last_message,
    last_message_at: row.last_message_at,

    customer: {
      id: row.customerIdData,
      name: row.name,
      phone: row.phone,
      status: row.status,
      avatar: row.avatar
    }
  };
};


export const createConversation = async ({
  customerId,
  userId
}: {
  customerId: number;
  userId: number;
}) => {

  /*
   * Primero verificamos que el cliente
   * pertenezca al usuario autenticado.
   */
  const [customerRows]: any = await pool.query(
    `
    SELECT id
    FROM customers
    WHERE
      id = ?
      AND user_id = ?
    LIMIT 1
    `,
    [
      customerId,
      userId
    ]
  );

  if (!customerRows.length) {
    throw new Error(
      'El cliente no pertenece al usuario autenticado'
    );
  }

  /*
   * Buscamos si ya existe la conversación.
   */
  const [existingRows]: any = await pool.query(
    `
    SELECT
      c.id,
      c.customer_id,
      c.users_id,
      c.last_message,
      c.last_message_at,

      cu.id AS customerIdData,
      cu.name,
      cu.phone,
      cu.status,
      cu.avatar

    FROM conversations c

    INNER JOIN customers cu
      ON c.customer_id = cu.id

    WHERE
      c.customer_id = ?
      AND c.users_id = ?

    LIMIT 1
    `,
    [
      customerId,
      userId
    ]
  );

  if (existingRows.length > 0) {

    const row = existingRows[0];

    return {
      id: row.id,
      customerId: row.customer_id,
      userId: row.users_id,

      last_message: row.last_message,
      last_message_at: row.last_message_at,

      customer: {
        id: row.customerIdData,
        name: row.name,
        phone: row.phone,
        status: row.status,
        avatar: row.avatar
      }
    };
  }

  /*
   * Creamos la conversación.
   */
  const [result]: any = await pool.query(
    `
    INSERT INTO conversations
    (
      customer_id,
      users_id
    )
    VALUES (?, ?)
    `,
    [
      customerId,
      userId
    ]
  );

  return await getConversationById(
    result.insertId,
    userId
  );
};
