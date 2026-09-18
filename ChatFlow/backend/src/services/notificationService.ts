import pool from '../config/database';
import { Notification } from '../models/Notification';
import { getIO } from '../socket';

export class NotificationService {

  async getByUser(
    userId: number
  ): Promise<Notification[]> {

    const [rows] = await pool.execute(
      `
      SELECT *
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return rows as Notification[];
  }

  async create(
    userId: number,
    title: string,
    message: string,
    type: string,
    referenceId?: number
  ) {

    const [result]: any = await pool.query(
      `
      INSERT INTO notifications
      (
        user_id,
        title,
        message,
        type,
        reference_id
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        userId,
        title,
        message,
        type,
        referenceId ?? null
      ]
    );

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

    getIO()
      .to(`user_${userId}`)
      .emit(
        'new_notification',
        notification
      );

    return notification;
  }

  async markAsRead(
    id: number,
    userId: number
  ): Promise<void> {

    await pool.execute(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id = ?
        AND user_id = ?
      `,
      [
        id,
        userId
      ]
    );
  }

  async markAllAsRead(
    userId: number
  ): Promise<void> {

    await pool.execute(
      `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = ?
      `,
      [userId]
    );
  }

  async countUnread(
    userId: number
  ): Promise<number> {

    const [rows]: any = await pool.execute(
      `
      SELECT COUNT(*) AS total
      FROM notifications
      WHERE user_id = ?
        AND is_read = false
      `,
      [userId]
    );

    return Number(rows[0]?.total ?? 0);
  }
}