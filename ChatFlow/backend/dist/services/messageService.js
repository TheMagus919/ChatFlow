"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateIncoming = exports.markAsDelivered = exports.getMessagesByConversation = exports.sendMessage = void 0;
const database_1 = __importDefault(require("../config/database"));
const socket_1 = require("../socket");
const notificationService_1 = require("./notificationService");
const sendMessage = async ({ content, customerId, conversationId, userId }) => {
    // Verificar que la conversación y el cliente
    // pertenezcan al usuario autenticado
    const [conversations] = await database_1.default.query(`
    SELECT c.id
    FROM conversations c
    INNER JOIN customers cu ON cu.id = c.customer_id
    WHERE c.id = ?
      AND c.users_id = ?
      AND c.customer_id = ?
      AND cu.user_id = ?
    LIMIT 1
    `, [
        conversationId,
        userId,
        customerId,
        userId
    ]);
    if (!conversations.length) {
        throw new Error('CONVERSATION_NOT_FOUND');
    }
    const [result] = await database_1.default.query(`
    INSERT INTO messages
    (
      content,
      customer_id,
      conversation_id,
      direction
    )
    VALUES (?, ?, ?, 'outgoing')
    `, [
        content,
        customerId,
        conversationId
    ]);
    await database_1.default.query(`
    UPDATE conversations
    SET
      last_message = ?,
      last_message_at = NOW()
    WHERE id = ?
      AND users_id = ?
    `, [
        content,
        conversationId,
        userId
    ]);
    const message = {
        id: result.insertId,
        content,
        customerId,
        conversationId,
        direction: 'outgoing',
        created_at: new Date()
    };
    const io = (0, socket_1.getIO)();
    io.to(`conversation_${conversationId}`).emit('new_message', message);
    return message;
};
exports.sendMessage = sendMessage;
const getMessagesByConversation = async (conversationId, userId) => {
    // Verificar propiedad de la conversación
    const [conversations] = await database_1.default.query(`
    SELECT id
    FROM conversations
    WHERE id = ?
      AND users_id = ?
    LIMIT 1
    `, [
        conversationId,
        userId
    ]);
    if (!conversations.length) {
        throw new Error('CONVERSATION_NOT_FOUND');
    }
    const [rows] = await database_1.default.query(`
    SELECT *
    FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
    `, [conversationId]);
    return rows;
};
exports.getMessagesByConversation = getMessagesByConversation;
const markAsDelivered = async (messageId, userId) => {
    // Solo permite modificar mensajes
    // pertenecientes a conversaciones del usuario
    const [result] = await database_1.default.query(`
    UPDATE messages m
    INNER JOIN conversations c
      ON c.id = m.conversation_id
    SET
      m.status = 'delivered',
      m.delivered_at = NOW()
    WHERE m.id = ?
      AND c.users_id = ?
    `, [
        messageId,
        userId
    ]);
    if (result.affectedRows === 0) {
        throw new Error('MESSAGE_NOT_FOUND');
    }
    const [messages] = await database_1.default.query(`
    SELECT conversation_id
    FROM messages
    WHERE id = ?
    LIMIT 1
    `, [messageId]);
    if (!messages.length) {
        throw new Error('MESSAGE_NOT_FOUND');
    }
    const conversationId = messages[0].conversation_id;
    const io = (0, socket_1.getIO)();
    io.to(`conversation_${conversationId}`).emit('message_delivered', {
        messageId
    });
};
exports.markAsDelivered = markAsDelivered;
const simulateIncoming = async ({ content, customerId, conversationId }, userId) => {
    // Verificar que la conversación y el cliente
    // pertenezcan al usuario autenticado
    const [conversations] = await database_1.default.query(`
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
    `, [
        conversationId,
        userId,
        customerId,
        userId
    ]);
    if (!conversations.length) {
        throw new Error('CONVERSATION_NOT_FOUND');
    }
    const nombre = conversations[0].name;
    const [result] = await database_1.default.query(`
    INSERT INTO messages
    (
      content,
      direction,
      status,
      customer_id,
      conversation_id
    )
    VALUES (?, 'incoming', 'delivered', ?, ?)
    `, [
        content,
        customerId,
        conversationId
    ]);
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
    await database_1.default.query(`
    UPDATE conversations
    SET
      last_message = ?,
      last_message_at = NOW()
    WHERE id = ?
      AND users_id = ?
    `, [
        content,
        conversationId,
        userId
    ]);
    const io = (0, socket_1.getIO)();
    io.to(`conversation_${conversationId}`).emit('new_message', message);
    // Crear notificación
    const notificationService = new notificationService_1.NotificationService();
    const mensaje = `${nombre} te envio un mensaje.`;
    await notificationService.create(userId, 'Nuevo mensaje', mensaje, 'message', customerId);
    return message;
};
exports.simulateIncoming = simulateIncoming;
/*
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
*/ 
