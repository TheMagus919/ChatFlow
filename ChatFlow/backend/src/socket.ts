import { Server } from 'socket.io';
import pool from './config/database';

let io: Server;

export const initSocket = (server: any) => {

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      credentials: true
    }
  });

  console.log('🔌 Socket iniciado');

  io.on('connection', (socket) => {

    console.log('🟢 Cliente conectado:', socket.id);

    // ==========================
    // CONVERSACIONES
    // ==========================

    socket.on(
      'join_conversation',
      (conversationId: number) => {

        socket.join(
          `conversation_${conversationId}`
        );

      }
    );

    socket.on(
      'leave_conversation',
      (conversationId: number) => {

        socket.leave(
          `conversation_${conversationId}`
        );

      }
    );

    // ==========================
    // USUARIO
    // ==========================

    socket.on("joinUserRoom", (userId: number) => {

      console.log(
        `📊 Socket ${socket.id} unido a user_${userId}`
      );

      socket.join(`user_${userId}`);

    });

    // ==========================
    // ESCRIBIENDO...
    // ==========================

    socket.on(
      'typing',
      (conversationId: number) => {

        socket.to(
          `conversation_${conversationId}`
        ).emit(
          'typing',
          {
            conversationId
          }
        );

      }
    );

    socket.on(
      'stop_typing',
      (conversationId: number) => {

        socket.to(
          `conversation_${conversationId}`
        ).emit(
          'stop_typing',
          {
            conversationId
          }
        );

      }
    );

    // ==========================
    // WHATSAPP
    // ==========================

    socket.on(
      'whatsapp_message',
      (message) => {

        io.emit(
          'whatsapp_message',
          message
        );

      }
    );

    // ==========================
    // INSTAGRAM
    // ==========================

    socket.on(
      'instagram_message',
      (message) => {

        io.emit(
          'instagram_message',
          message
        );

      }
    );

    // ==========================
    // FACEBOOK
    // ==========================

    socket.on(
      'facebook_message',
      (message) => {

        io.emit(
          'facebook_message',
          message
        );

      }
    );

    socket.on(
      'disconnect',
      () => {

        console.log(
          '🔴 Cliente desconectado:',
          socket.id
        );

      }
    );

  });

  setInterval(
    broadcastStats,
    30000
  );

};

export const getIO = () => {

  if (!io) {

    throw new Error(
      'Socket no inicializado'
    );

  }

  return io;

};

const broadcastStats = async () => {

  try {

    const [users]: any =
      await pool.query(
        'SELECT id FROM users'
      );

    for (const user of users) {

      const [metrics]: any =
        await pool.query(
          `
          SELECT
            COUNT(*) totalCustomers,
            COUNT(
              CASE
                WHEN status = 'won'
                THEN 1
              END
            ) wonDeals
          FROM customers
          WHERE user_id = ?
          `,
          [user.id]
        );

      io.to(
        `user_${user.id}`
      ).emit(
        'stats_update',
        metrics[0]
      );

    }

  } catch (error) {

    console.error(
      'Stats error:',
      error
    );

  }

};