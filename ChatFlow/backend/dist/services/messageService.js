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
    const connection = await database_1.default.getConnection();
    try {
        await connection.beginTransaction();
        // Verificar que la conversación y el cliente
        // pertenezcan al usuario autenticado.
        const [conversations] = await connection.query(`
      SELECT c.id
      FROM conversations c
      INNER JOIN customers cu
        ON cu.id = c.customer_id
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
        // Crear mensaje.
        const [result] = await connection.query(`
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
        // Actualizar última actividad de la conversación.
        const [updateResult] = await connection.query(`
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
        const io = (0, socket_1.getIO)();
        io.to(`conversation_${conversationId}`).emit('new_message', message);
        return message;
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
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
    // Buscar conversación existente.
    let conversations;
    if (conversationId) {
        const [rows] = await database_1.default.query(`
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
        conversations = rows;
    }
    else {
        const [rows] = await database_1.default.query(`
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
      WHERE c.users_id = ?
        AND c.customer_id = ?
        AND cu.user_id = ?
      LIMIT 1
      `, [
            userId,
            customerId,
            userId
        ]);
        conversations = rows;
    }
    // Si no existe conversación, crearla.
    if (!conversations.length) {
        // Verificar que el cliente pertenezca al usuario.
        const [customers] = await database_1.default.query(`
      SELECT id, name
      FROM customers
      WHERE id = ?
        AND user_id = ?
      LIMIT 1
      `, [
            customerId,
            userId
        ]);
        if (!customers.length) {
            throw new Error('CUSTOMER_NOT_FOUND');
        }
        const [conversationResult] = await database_1.default.query(`
      INSERT INTO conversations
      (
        customer_id,
        users_id,
        last_message,
        last_message_at
      )
      VALUES (?, ?, ?, NOW())
      `, [
            customerId,
            userId,
            content
        ]);
        conversations = [
            {
                id: conversationResult.insertId,
                users_id: userId,
                user_id: userId,
                name: customers[0].name
            }
        ];
    }
    const conversation = conversations[0];
    const nombre = conversation.name;
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
        conversation.id
    ]);
    const message = {
        id: result.insertId,
        content,
        customerId,
        conversationId: conversation.id,
        direction: 'incoming',
        status: 'delivered',
        created_at: new Date(),
        delivered_at: new Date()
    };
    // Actualizar última actividad de la conversación.
    await database_1.default.query(`
    UPDATE conversations
    SET
      last_message = ?,
      last_message_at = NOW()
    WHERE id = ?
      AND users_id = ?
    `, [
        content,
        conversation.id,
        userId
    ]);
    // Enviar mensaje por Socket.IO.
    const io = (0, socket_1.getIO)();
    io.to(`conversation_${conversation.id}`).emit('new_message', message);
    // Crear notificación.
    const notificationService = new notificationService_1.NotificationService();
    const mensaje = `${nombre} te envio un mensaje.`;
    await notificationService.create(userId, 'Nuevo mensaje', mensaje, 'message', customerId);
    return message;
};
exports.simulateIncoming = simulateIncoming;
