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
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    /*
     * Verificar que el cliente pertenezca
     * al usuario autenticado.
     */
    const [customerRows]: any = await connection.query(
      `
      SELECT id
      FROM customers
      WHERE id = ?
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
        'CUSTOMER_NOT_FOUND'
      );
    }

    /*
     * Buscar una conversación existente.
     */
    const [existingRows]: any = await connection.query(
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

      WHERE c.customer_id = ?
        AND c.users_id = ?

      LIMIT 1
      `,
      [
        customerId,
        userId
      ]
    );

    /*
     * Si ya existe, no crear otra.
     */
    if (existingRows.length > 0) {
      await connection.commit();

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
     * Crear nueva conversación.
     */
    const [result]: any = await connection.query(
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

    /*
     * Obtener la conversación recién creada
     * usando la misma conexión/transacción.
     */
    const [newRows]: any = await connection.query(
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

      WHERE c.id = ?
        AND c.users_id = ?

      LIMIT 1
      `,
      [
        result.insertId,
        userId
      ]
    );

    if (!newRows.length) {
      throw new Error(
        'CONVERSATION_CREATE_FAILED'
      );
    }

    await connection.commit();

    const row = newRows[0];

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

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
};