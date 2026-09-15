"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("./config/database"));
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL ||
                'http://localhost:4200',
            credentials: true
        }
    });
    console.log('🔌 Socket iniciado');
    // ==========================
    // AUTENTICACIÓN DEL SOCKET
    // ==========================
    io.use((socket, next) => {
        try {
            if (!process.env.JWT_SECRET) {
                return next(new Error('JWT_SECRET no configurado'));
            }
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error('Token requerido'));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!decoded.userId) {
                return next(new Error('Token inválido'));
            }
            socket.userId = decoded.userId;
            next();
        }
        catch (error) {
            console.error('❌ Error autenticando socket:', error);
            next(new Error('No autorizado'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
        console.log('🟢 Cliente conectado:', socket.id, 'Usuario:', userId);
        // ==========================
        // ROOM DEL USUARIO
        // ==========================
        socket.join(`user_${userId}`);
        // ==========================
        // CONVERSACIONES
        // ==========================
        socket.on('join_conversation', async (conversationId) => {
            try {
                if (!Number.isInteger(conversationId) ||
                    conversationId <= 0) {
                    return;
                }
                const [rows] = await database_1.default.query(`
                SELECT id
                FROM conversations
                WHERE id = ?
                  AND users_id = ?
                LIMIT 1
                `, [
                    conversationId,
                    userId
                ]);
                if (!rows.length) {
                    console.warn(`⚠️ Usuario ${userId} intentó acceder a conversación ${conversationId}`);
                    return;
                }
                socket.join(`conversation_${conversationId}`);
            }
            catch (error) {
                console.error('Error al unirse a conversación:', error);
            }
        });
        socket.on('leave_conversation', (conversationId) => {
            if (!Number.isInteger(conversationId) ||
                conversationId <= 0) {
                return;
            }
            socket.leave(`conversation_${conversationId}`);
        });
        // ==========================
        // COMPATIBILIDAD
        // ==========================
        socket.on('joinUserRoom', (requestedUserId) => {
            const parsedUserId = Number(requestedUserId);
            // El usuario solamente puede
            // entrar a su propia room.
            if (parsedUserId !== userId) {
                console.warn(`⚠️ Usuario ${userId} intentó unirse a user_${parsedUserId}`);
                return;
            }
            socket.join(`user_${userId}`);
        });
        socket.on('leaveUserRoom', () => {
            socket.leave(`user_${userId}`);
        });
        // ==========================
        // ESCRIBIENDO...
        // ==========================
        socket.on('typing', async (conversationId) => {
            try {
                const [rows] = await database_1.default.query(`
                SELECT id
                FROM conversations
                WHERE id = ?
                  AND users_id = ?
                LIMIT 1
                `, [
                    conversationId,
                    userId
                ]);
                if (!rows.length) {
                    return;
                }
                socket.to(`conversation_${conversationId}`).emit('typing', {
                    conversationId
                });
            }
            catch (error) {
                console.error('Error typing:', error);
            }
        });
        socket.on('stop_typing', async (conversationId) => {
            try {
                const [rows] = await database_1.default.query(`
                SELECT id
                FROM conversations
                WHERE id = ?
                  AND users_id = ?
                LIMIT 1
                `, [
                    conversationId,
                    userId
                ]);
                if (!rows.length) {
                    return;
                }
                socket.to(`conversation_${conversationId}`).emit('stop_typing', {
                    conversationId
                });
            }
            catch (error) {
                console.error('Error stop_typing:', error);
            }
        });
        // ==========================
        // WHATSAPP
        // ==========================
        socket.on('whatsapp_message', (message) => {
            if (message?.conversationId) {
                socket.to(`conversation_${message.conversationId}`).emit('whatsapp_message', message);
            }
        });
        // ==========================
        // INSTAGRAM
        // ==========================
        socket.on('instagram_message', (message) => {
            if (message?.conversationId) {
                socket.to(`conversation_${message.conversationId}`).emit('instagram_message', message);
            }
        });
        // ==========================
        // FACEBOOK
        // ==========================
        socket.on('facebook_message', (message) => {
            if (message?.conversationId) {
                socket.to(`conversation_${message.conversationId}`).emit('facebook_message', message);
            }
        });
        // ==========================
        // DESCONEXIÓN
        // ==========================
        socket.on('disconnect', () => {
            console.log('🔴 Cliente desconectado:', socket.id, 'Usuario:', userId);
        });
    });
    setInterval(broadcastStats, 30000);
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket no inicializado');
    }
    return io;
};
exports.getIO = getIO;
const broadcastStats = async () => {
    try {
        const [users] = await database_1.default.query('SELECT id FROM users');
        for (const user of users) {
            const [metrics] = await database_1.default.query(`
          SELECT
            COUNT(*) AS totalCustomers,
            COUNT(
              CASE
                WHEN status = 'won'
                THEN 1
              END
            ) AS wonDeals
          FROM customers
          WHERE user_id = ?
          `, [user.id]);
            io.to(`user_${user.id}`).emit('stats_update', metrics[0]);
        }
    }
    catch (error) {
        console.error('Stats error:', error);
    }
};
/*
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
*/ 
