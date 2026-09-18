import pool from '../config/database';
import { getIO } from '../socket';
import { NotificationService } from './notificationService';
import { IncomingMessageDTO } from '../models/Message'


interface SendMessageDTO {
  content: string;
  customerId: number;
  conversationId: number;
  userId: number;
}

export const sendMessage = async ({
  content,
  customerId,
  conversationId,
  userId
}: SendMessageDTO) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Verificar que la conversación y el cliente
    // pertenezcan al usuario autenticado.
    const [conversations]: any = await connection.query(
      `
      SELECT c.id
      FROM conversations c
      INNER JOIN customers cu
        ON cu.id = c.customer_id
      WHERE c.id = ?
        AND c.users_id = ?
        AND c.customer_id = ?
        AND cu.user_id = ?
      LIMIT 1
      `,
      [
        conversationId,
        userId,
        customerId,
        userId
      ]
    );

    if (!conversations.length) {
      throw new Error('CONVERSATION_NOT_FOUND');
    }

    // Crear mensaje.
    const [result]: any = await connection.query(
      `
      INSERT INTO messages
      (
        content,
        customer_id,
        conversation_id,
        direction
      )
      VALUES (?, ?, ?, 'outgoing')
      `,
      [
        content,
        customerId,
        conversationId
      ]
    );

    // Actualizar última actividad de la conversación.
    const [updateResult]: any = await connection.query(
      `
      UPDATE conversations
      SET
        last_message = ?,
        last_message_at = NOW()
      WHERE id = ?
        AND users_id = ?
      `,
      [
        content,
        conversationId,
        userId
      ]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error('CONVERSATION_UPDATE_FAILED');
    }

    await connection.commit();

    const message = {
      id: result.insertId,
      content,
      customerId,
      conversationId,
      direction: 'outgoing',
      created_at: new Date()
    };

    // Socket.IO se ejecuta después del commit.
    const io = getIO();

    io.to(`conversation_${conversationId}`).emit(
      'new_message',
      message
    );

    return message;

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
};

export const getMessagesByConversation = async (
  conversationId: number,
  userId: number
) => {

  // Verificar propiedad de la conversación
  const [conversations]: any = await pool.query(
    `
    SELECT id
    FROM conversations
    WHERE id = ?
      AND users_id = ?
    LIMIT 1
    `,
    [
      conversationId,
      userId
    ]
  );

  if (!conversations.length) {
    throw new Error('CONVERSATION_NOT_FOUND');
  }

  const [rows]: any = await pool.query(
    `
    SELECT *
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
    `,
    [conversationId]
  );

  return rows;
};


export const markAsDelivered = async (
  messageId: number,
  userId: number
) => {

  // Solo permite modificar mensajes
  // pertenecientes a conversaciones del usuario
  const [result]: any = await pool.query(
    `
    UPDATE messages m
    INNER JOIN conversations c
      ON c.id = m.conversation_id
    SET
      m.status = 'delivered',
      m.delivered_at = NOW()
    WHERE m.id = ?
      AND c.users_id = ?
    `,
    [
      messageId,
      userId
    ]
  );

  if (result.affectedRows === 0) {
    throw new Error('MESSAGE_NOT_FOUND');
  }

  const [messages]: any = await pool.query(
    `
    SELECT conversation_id
    FROM messages
    WHERE id = ?
    LIMIT 1
    `,
    [messageId]
  );

  if (!messages.length) {
    throw new Error('MESSAGE_NOT_FOUND');
  }

  const conversationId = messages[0].conversation_id;

  const io = getIO();

  io.to(`conversation_${conversationId}`).emit(
    'message_delivered',
    {
      messageId
    }
  );
};


export const simulateIncoming = async (
  {
    content,
    customerId,
    conversationId
  }: IncomingMessageDTO,
  userId: number
) => {

  // Verificar que la conversación y el cliente
  // pertenezcan al usuario autenticado
  const [conversations]: any = await pool.query(
    `
    SELECT
      c.id,
      c.users_id,
      cu.user_id,
      cu.name
    FROM conversations c
    INNER JOIN customers cu
      ON cu.id = c.customer_id
    INNER JOIN users u
      ON u.id = c.users_id
    WHERE c.id = ?
      AND c.users_id = ?
      AND c.customer_id = ?
      AND cu.user_id = ?
    LIMIT 1
    `,
    [
      conversationId,
      userId,
      customerId,
      userId
    ]
  );

  if (!conversations.length) {
    throw new Error('CONVERSATION_NOT_FOUND');
  }

  const nombre = conversations[0].name;

  const [result]: any = await pool.query(
    `
    INSERT INTO messages
    (
      content,
      direction,
      status,
      customer_id,
      conversation_id
    )
    VALUES (?, 'incoming', 'delivered', ?, ?)
    `,
    [
      content,
      customerId,
      conversationId
    ]
  );

  const message = {
    id: result.insertId,
    content,
    customerId,
    conversationId,
    direction: 'incoming',
    status: 'delivered',
    created_at: new Date(),
    delivered_at: new Date()
  };

  await pool.query(
    `
    UPDATE conversations
    SET
      last_message = ?,
      last_message_at = NOW()
    WHERE id = ?
      AND users_id = ?
    `,
    [
      content,
      conversationId,
      userId
    ]
  );

  const io = getIO();

  io.to(`conversation_${conversationId}`).emit(
    'new_message',
    message
  );

  // Crear notificación
  const notificationService =
    new NotificationService();

  const mensaje =
    `${nombre} te envio un mensaje.`;

  await notificationService.create(
    userId,
    'Nuevo mensaje',
    mensaje,
    'message',
    customerId
  );

  return message;
};