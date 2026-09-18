"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const database_1 = __importDefault(require("../config/database"));
const socket_1 = require("../socket");
class NotificationService {
    async getByUser(userId) {
        const [rows] = await database_1.default.execute(`
      SELECT *
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      `, [userId]);
        return rows;
    }
    async create(userId, title, message, type, referenceId) {
        const [result] = await database_1.default.query(`
      INSERT INTO notifications
      (
        user_id,
        title,
        message,
        type,
        reference_id
      )
      VALUES (?, ?, ?, ?, ?)
      `, [
            userId,
            title,
            message,
            type,
            referenceId ?? null
        ]);
        const notification = {
            id: result.insertId,
            user_id: userId,
            title,
            message,
            type,
            is_read: false,
            reference_id: referenceId ?? null,
            created_at: new Date()
        };
        (0, socket_1.getIO)()
            .to(`user_${userId}`)
            .emit('new_notification', notification);
        return notification;
    }
    async markAsRead(id, userId) {
        await database_1.default.execute(`
      UPDATE notifications
      SET is_read = true
      WHERE id = ?
        AND user_id = ?
      `, [
            id,
            userId
        ]);
    }
    async markAllAsRead(userId) {
        await database_1.default.execute(`
      UPDATE notifications
      SET is_read = true
      WHERE user_id = ?
      `, [userId]);
    }
    async countUnread(userId) {
        const [rows] = await database_1.default.execute(`
      SELECT COUNT(*) AS total
      FROM notifications
      WHERE user_id = ?
        AND is_read = false
      `, [userId]);
        return Number(rows[0]?.total ?? 0);
    }
}
exports.NotificationService = NotificationService;
