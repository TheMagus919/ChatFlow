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
}: SendMessageDTO) => {

  const [result]: any =
    await pool.query(
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

  await pool.query(
    `
    UPDATE conversations
    SET
      last_message = ?,
      last_message_at = NOW()
    WHERE id = ?
    `,
    [
      content,
      conversationId
    ]
  );

  const message = {

    id: result.insertId,

    content,

    customerId,

    conversationId,

    direction: 'outgoing',

    created_at: new Date()

  };

  const io = getIO();

  io.to(
    `conversation_${conversationId}`
  ).emit(
    'new_message',
    message
  );

  return message;

};

export const getMessagesByConversation =
async (
  conversationId: number
) => {

  const [rows]: any =
    await pool.query(
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

export const markAsDelivered =
async (
  messageId: number
) => {

  await pool.query(
    `
    UPDATE messages
    SET
      status = 'delivered',
      delivered_at = NOW()
    WHERE id = ?
    `,
    [messageId]
  );

  const io = getIO();

  io.emit(
    'message_delivered',
    {
      messageId
    }
  );

};

export const simulateIncoming = async ({
  content,
  customerId,
  conversationId
}: IncomingMessageDTO) => {

  const [result]: any =
    await pool.query(
      `
      INSERT INTO messages
      (
        content,
        direction,
        status,
        customer_id,
        conversation_id
        
      )
      VALUES
      (?,'incoming', 'delivered', ?, ?)
      `,
      [
        content,
        customerId,
        conversationId
      ]
    );
  const [rows]: any = await pool.query(
    `
    SELECT users_id
    FROM conversations
    WHERE id = ?
    `,
    [conversationId]
  );
  if (!rows.length) {
    throw new Error(
      `No existe la conversación ${conversationId}`
    );
  }
  const userId = rows[0]?.users_id;
  console.log("usee", userId);
  const [users]: any = await pool.query(
    `
    SELECT *
    FROM users
    WHERE id = ?
    `,
    [userId]
  );
  if (!users.length) {
    throw new Error(
      `No existen usuarios con id ${userId}`
    );
  }
  const nombre =  users[0]?.name;
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

  const io = getIO();

  // Actualiza el chat en tiempo real
  io.to(
    `conversation_${conversationId}`
  ).emit(
    'new_message',
    message
  );

  // Actualiza la conversación
  await pool.query(
    `
    UPDATE conversations
    SET
      last_message = ?,
      last_message_at = NOW()
    WHERE id = ?
    `,
    [
      content,
      conversationId
    ]
  );

  // 🔔 CREAR NOTIFICACIÓN
  const notificationService =
    new NotificationService();
  const mensaje = nombre + " te envio un mensaje."
  const notification =
    await notificationService.create(
      userId,
      'Nuevo mensaje',
      mensaje,
      'message',
      customerId
    );

  console.log(
    'Cantidad sockets en room:',
    io.sockets.adapter.rooms.get(
      `user_${userId}`
    )?.size
  );

  return message;

};