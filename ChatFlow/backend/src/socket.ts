import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import pool from './config/database';

let io: Server;

interface JwtPayload {
  userId: number;
  email: string;
}

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

export const initSocket = (server: any) => {

  io = new Server(server, {
    cors: {
      origin:
        process.env.FRONTEND_URL ||
        'http://localhost:4200',
      credentials: true
    }
  });

  console.log('🔌 Socket iniciado');

  // ==========================
  // AUTENTICACIÓN DEL SOCKET
  // ==========================

  io.use((socket: AuthenticatedSocket, next) => {

    try {

      if (!process.env.JWT_SECRET) {
        return next(
          new Error('JWT_SECRET no configurado')
        );
      }

      const token =
        socket.handshake.auth?.token;

      if (!token) {
        return next(
          new Error('Token requerido')
        );
      }

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        ) as JwtPayload;

      if (
        !decoded.userId ||
        !Number.isInteger(decoded.userId) ||
        decoded.userId <= 0
      ) {
        return next(
          new Error('Token inválido')
        );
      }

      const [users]: any = await pool.query(
        `
        SELECT id
        FROM users
        WHERE id = ?
          AND is_active = 1
        LIMIT 1
        `,
        [decoded.userId]
      );

      if (!users.length) {
        return next(
          new Error('Usuario no autorizado')
        );
      }
      /*
      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        ) as JwtPayload;

      if (!decoded.userId) {
        return next(
          new Error('Token inválido')
        );
      }*/

      socket.userId = decoded.userId;

      next();

    } catch (error) {

      console.error(
        '❌ Error autenticando socket:',
        error
      );

      next(
        new Error('No autorizado')
      );
    }

  });


  io.on(
    'connection',
    (socket: AuthenticatedSocket) => {

      const userId = socket.userId!;

      console.log(
        '🟢 Cliente conectado:',
        socket.id,
        'Usuario:',
        userId
      );

      // ==========================
      // ROOM DEL USUARIO
      // ==========================

      socket.join(
        `user_${userId}`
      );

      // ==========================
      // CONVERSACIONES
      // ==========================

      socket.on(
        'join_conversation',
        async (conversationId: number) => {

          try {

            if (
              !Number.isInteger(conversationId) ||
              conversationId <= 0
            ) {
              return;
            }

            const [rows]: any =
              await pool.query(
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

            if (!rows.length) {
              console.warn(
                `⚠️ Usuario ${userId} intentó acceder a conversación ${conversationId}`
              );

              return;
            }

            socket.join(
              `conversation_${conversationId}`
            );

          } catch (error) {

            console.error(
              'Error al unirse a conversación:',
              error
            );

          }

        }
      );


      socket.on(
        'leave_conversation',
        (conversationId: number) => {

          if (
            !Number.isInteger(conversationId) ||
            conversationId <= 0
          ) {
            return;
          }

          socket.leave(
            `conversation_${conversationId}`
          );

        }
      );


      // ==========================
      // COMPATIBILIDAD
      // ==========================

      socket.on(
        'joinUserRoom',
        (requestedUserId: number | string) => {

          const parsedUserId =
            Number(requestedUserId);

          // El usuario solamente puede
          // entrar a su propia room.
          if (
            parsedUserId !== userId
          ) {

            console.warn(
              `⚠️ Usuario ${userId} intentó unirse a user_${parsedUserId}`
            );

            return;
          }

          socket.join(
            `user_${userId}`
          );

        }
      );


      socket.on(
        'leaveUserRoom',
        () => {

          socket.leave(
            `user_${userId}`
          );

        }
      );


      // ==========================
      // ESCRIBIENDO...
      // ==========================

      socket.on(
        'typing',
        async (conversationId: number) => {

          try {

            const [rows]: any =
              await pool.query(
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

            if (!rows.length) {
              return;
            }

            socket.to(
              `conversation_${conversationId}`
            ).emit(
              'typing',
              {
                conversationId
              }
            );

          } catch (error) {

            console.error(
              'Error typing:',
              error
            );

          }

        }
      );


      socket.on(
        'stop_typing',
        async (conversationId: number) => {

          try {

            const [rows]: any =
              await pool.query(
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

            if (!rows.length) {
              return;
            }

            socket.to(
              `conversation_${conversationId}`
            ).emit(
              'stop_typing',
              {
                conversationId
              }
            );

          } catch (error) {

            console.error(
              'Error stop_typing:',
              error
            );

          }

        }
      );


      // ==========================
      // WHATSAPP
      // ==========================

      socket.on(
      'whatsapp_message',
      async (message) => {

        try {
          const conversationId = Number(message?.conversationId);

          if (
            !Number.isInteger(conversationId) ||
            conversationId <= 0
          ) {
            return;
          }

          const [rows]: any = await pool.query(
            `
            SELECT id
            FROM conversations
            WHERE id = ?
              AND users_id = ?
            LIMIT 1
            `,
            [conversationId, userId]
          );

          if (!rows.length) {
            console.warn(
              `⚠️ Usuario ${userId} intentó emitir mensaje de WhatsApp en conversación ${conversationId}`
            );
            return;
          }

          socket.to(
            `conversation_${conversationId}`
          ).emit(
            'whatsapp_message',
            message
          );

        } catch (error) {
          console.error(
            'Error en whatsapp_message:',
            error
          );
        }

      }
    );


      // ==========================
      // INSTAGRAM
      // ==========================

      socket.on(
      'instagram_message',
      async (message) => {

        try {
          const conversationId = Number(message?.conversationId);

          if (
            !Number.isInteger(conversationId) ||
            conversationId <= 0
          ) {
            return;
          }

          const [rows]: any = await pool.query(
            `
            SELECT id
            FROM conversations
            WHERE id = ?
              AND users_id = ?
            LIMIT 1
            `,
            [conversationId, userId]
          );

          if (!rows.length) {
            console.warn(
              `⚠️ Usuario ${userId} intentó emitir mensaje de Instagram en conversación ${conversationId}`
            );
            return;
          }

          socket.to(
            `conversation_${conversationId}`
          ).emit(
            'instagram_message',
            message
          );

        } catch (error) {
          console.error(
            'Error en instagram_message:',
            error
          );
        }

      }
    );


      // ==========================
      // FACEBOOK
      // ==========================

      socket.on(
      'facebook_message',
      async (message) => {

        try {
          const conversationId = Number(message?.conversationId);

          if (
            !Number.isInteger(conversationId) ||
            conversationId <= 0
          ) {
            return;
          }

          const [rows]: any = await pool.query(
            `
            SELECT id
            FROM conversations
            WHERE id = ?
              AND users_id = ?
            LIMIT 1
            `,
            [conversationId, userId]
          );

          if (!rows.length) {
            console.warn(
              `⚠️ Usuario ${userId} intentó emitir mensaje de Facebook en conversación ${conversationId}`
            );
            return;
          }

          socket.to(
            `conversation_${conversationId}`
          ).emit(
            'facebook_message',
            message
          );

        } catch (error) {
          console.error(
            'Error en facebook_message:',
            error
          );
        }

      }
    );


      // ==========================
      // DESCONEXIÓN
      // ==========================

      socket.on(
        'disconnect',
        () => {

          console.log(
            '🔴 Cliente desconectado:',
            socket.id,
            'Usuario:',
            userId
          );

        }
      );

    }
  );


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
            COUNT(*) AS totalCustomers,
            COUNT(
              CASE
                WHEN status = 'won'
                THEN 1
              END
            ) AS wonDeals
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
