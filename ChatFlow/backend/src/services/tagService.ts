
import { executeQuery, executeInsert, executeUpdate } from '../utils/dbHelper';

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  customerCount?: number;
  user_id?: number | null;
  isDefault?: boolean;
}

export class TagService {

  private mapToTag(row: any): Tag {
    return {
      id: String(row.id),
      name: String(row.name),
      color: String(row.color),
      description: row.description ?? undefined,
      customerCount: Number(row.customerCount ?? 0),
      user_id: row.user_id === null ? null : Number(row.user_id),
      isDefault: row.user_id === null
    };
  }

  private async assertCanManageTags(userId: string): Promise<void> {
    const users = await executeQuery(
      `SELECT subscription FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    if (!users.length) {
      throw new Error('USER_NOT_FOUND');
    }

    const plan = String(users[0].subscription).toLowerCase();

    if (plan !== 'pro' && plan !== 'business') {
      throw new Error('PLAN_UPGRADE_REQUIRED');
    }
  }

  async findAllByUser(userId: string): Promise<Tag[]> {
    const tags = await executeQuery(
      `
      SELECT
        t.*,
        COALESCE(ct_count.customer_count, 0) AS customerCount
      FROM tags t
      LEFT JOIN (
        SELECT
          ct.tag_id,
          COUNT(DISTINCT ct.customer_id) AS customer_count
        FROM customer_tags ct
        INNER JOIN customers c
          ON c.id = ct.customer_id
        WHERE c.user_id = ?
        GROUP BY ct.tag_id
      ) ct_count
        ON ct_count.tag_id = t.id
      WHERE t.user_id IS NULL
         OR t.user_id = ?
      ORDER BY t.name ASC
      `,
      [userId, userId]
    );

    return tags.map((row: any) => this.mapToTag(row));
  }

  async create(
    userId: string,
    name: string,
    color: string,
    description?: string
  ): Promise<Tag> {
    await this.assertCanManageTags(userId);

    const normalizedName = name.trim();

    if (!normalizedName || normalizedName.length > 100) {
      throw new Error('INVALID_TAG_NAME');
    }

    const id = `tag_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    await executeInsert(
      `
      INSERT INTO tags
        (id, user_id, name, color, description)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        id,
        userId,
        normalizedName,
        color || '#64748B',
        description?.trim() || null
      ]
    );

    const newTags = await executeQuery(
      `SELECT * FROM tags WHERE id = ? AND user_id = ? LIMIT 1`,
      [id, userId]
    );

    if (!newTags.length) {
      throw new Error('TAG_CREATE_FAILED');
    }

    return this.mapToTag(newTags[0]);
  }

  async update(
    id: string,
    userId: string,
    updates: Partial<Tag>
  ): Promise<Tag | null> {
    await this.assertCanManageTags(userId);

    const existingTags = await executeQuery(
      `
      SELECT id
      FROM tags
      WHERE id = ?
        AND user_id = ?
      LIMIT 1
      `,
      [id, userId]
    );

    if (!existingTags.length) {
      return null;
    }

    const currentTags = await executeQuery(
      `SELECT * FROM tags WHERE id = ? AND user_id = ? LIMIT 1`,
      [id, userId]
    );

    const current = currentTags[0];

    const name =
      updates.name !== undefined
        ? updates.name.trim()
        : current.name;

    const color =
      updates.color !== undefined
        ? updates.color
        : current.color;

    const description =
      updates.description !== undefined
        ? updates.description?.trim() || null
        : current.description;

    if (!name || name.length > 100) {
      throw new Error('INVALID_TAG_NAME');
    }

    await executeUpdate(
      `
      UPDATE tags
      SET
        name = ?,
        color = ?,
        description = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND user_id = ?
      `,
      [name, color, description, id, userId]
    );

    const updatedTags = await executeQuery(
      `SELECT * FROM tags WHERE id = ? AND user_id = ? LIMIT 1`,
      [id, userId]
    );

    return updatedTags.length
      ? this.mapToTag(updatedTags[0])
      : null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    await this.assertCanManageTags(userId);

    const existingTags = await executeQuery(
      `
      SELECT id
      FROM tags
      WHERE id = ?
        AND user_id = ?
      LIMIT 1
      `,
      [id, userId]
    );

    if (!existingTags.length) {
      return false;
    }

    const usage = await executeQuery(
      `
      SELECT COUNT(DISTINCT ct.customer_id) AS count
      FROM customer_tags ct
      INNER JOIN customers c
        ON c.id = ct.customer_id
      WHERE ct.tag_id = ?
        AND c.user_id = ?
      `,
      [id, userId]
    );

    const count = Number(usage[0]?.count ?? 0);

    if (count > 0) {
      throw new Error(`TAG_IN_USE:${count}`);
    }

    const affectedRows = await executeUpdate(
      `
      DELETE FROM tags
      WHERE id = ?
        AND user_id = ?
      `,
      [id, userId]
    );

    return affectedRows > 0;
  }

  async findCustomersByTag(
    tagId: string,
    userId: string
  ): Promise<any[]> {
    return executeQuery(
      `
      SELECT DISTINCT c.*
      FROM customers c
      INNER JOIN customer_tags ct
        ON c.id = ct.customer_id
      INNER JOIN tags t
        ON t.id = ct.tag_id
      WHERE ct.tag_id = ?
        AND c.user_id = ?
        AND (t.user_id IS NULL OR t.user_id = ?)
      ORDER BY c.name ASC
      `,
      [tagId, userId, userId]
    );
  }

  async getPopularTags(userId: string): Promise<Tag[]> {
    const tags = await executeQuery(
      `
      SELECT
        t.*,
        COUNT(DISTINCT ct.customer_id) AS customerCount
      FROM tags t
      INNER JOIN customer_tags ct
        ON ct.tag_id = t.id
      INNER JOIN customers c
        ON c.id = ct.customer_id
      WHERE c.user_id = ?
        AND (t.user_id IS NULL OR t.user_id = ?)
      GROUP BY t.id
      ORDER BY customerCount DESC
      LIMIT 10
      `,
      [userId, userId]
    );

    return tags.map((row: any) => this.mapToTag(row));
  }
}
