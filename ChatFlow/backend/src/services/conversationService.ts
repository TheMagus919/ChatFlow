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

      cu.id as customerIdData,
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

    userId: row.user_id,

    last_message:
      row.last_message,

    last_message_at:
      row.last_message_at,

    customer: {

      id: row.customerIdData,

      name: row.name,

      phone: row.phone,

      status: row.status,

      avatar: row.avatar

    }

  }));

};

export const getConversationById = async (
  conversationId: number
) => {

  const [rows]: any = await pool.query(

    `
    SELECT
      c.id,
      c.customer_id,
      c.users_id,
      c.last_message,
      c.last_message_at,

      cu.id as customerIdData,
      cu.name,
      cu.phone,
      cu.status,
      cu.avatar

    FROM conversations c

    INNER JOIN customers cu
      ON c.customer_id = cu.id

    WHERE c.id = ?
    `,
    [conversationId]

  );

  if (!rows.length) {
    return null;
  }

  const row = rows[0];

  return {

    id: row.id,

    customerId: row.customer_id,

    userId: row.user_id,

    last_message:
      row.last_message,

    last_message_at:
      row.last_message_at,

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

  // 1. buscar existente
  const [existingRows]: any =
    await pool.query(

      `
      SELECT
        c.id,
        c.customer_id,
        c.users_id,
        c.last_message,
        c.last_message_at,

        cu.id as customerIdData,
        cu.name,
        cu.phone,
        cu.status

      FROM conversations c

      INNER JOIN customers cu
        ON c.customer_id = cu.id

      WHERE
        c.customer_id = ?
        AND c.users_id = ?

      LIMIT 1
      `,
      [customerId, userId]

    );

  // YA EXISTE
  if (existingRows.length > 0) {

    const row = existingRows[0];

    return {

      id: row.id,

      customerId: row.customer_id,

      userId: row.user_id,

      last_message:
        row.last_message,

      last_message_at:
        row.last_message_at,

      customer: {

        id: row.customerIdData,

        name: row.name,

        phone: row.phone,

        status: row.status

      }

    };

  }

  // 2. crear nueva conversación
  const [result]: any = await pool.query(

    `
    INSERT INTO conversations
    (
      customer_id,
      users_id
    )
    VALUES (?, ?)
    `,
    [customerId, userId]

  );

  // 3. devolver conversación completa
  return await getConversationById(
    result.insertId
  );

};