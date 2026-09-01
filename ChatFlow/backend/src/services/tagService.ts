import { executeQuery, executeInsert, executeUpdate } from '../utils/dbHelper';
import { generateId } from '../utils/dbHelper'; // Si existe

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  customerCount?: number;
}

export class TagService {
  private mapToTag(row: any): Tag {
    return {
      id: String(row.id),
      name: String(row.name),
      color: String(row.color),
      description: row.description ? String(row.description) : undefined,
      customerCount: row.customerCount ? Number(row.customerCount) : 0
    };
  }

  async findAllByUser(userId: string): Promise<Tag[]> {
    const tags = await executeQuery(`
      SELECT 
        t.*,
        COALESCE(ct_count.customer_count, 0) as customerCount
      FROM tags t
      LEFT JOIN (
        SELECT tag_id, COUNT(*) as customer_count
        FROM customer_tags ct
        JOIN customers c ON ct.customer_id = c.id
        WHERE c.user_id = ?
        GROUP BY tag_id
      ) ct_count ON t.id = ct_count.tag_id
      ORDER BY t.name ASC
    `, [userId]);

    return tags.map((row: any) => this.mapToTag(row));
  }

  async create(name: string, color: string, description?: string): Promise<Tag> {
    const id = `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await executeInsert(
      `INSERT INTO tags (id, name, color, description) VALUES (?, ?, ?, ?)`,
      [id, name.trim(), color || '#64748B', description?.trim()]
    );

    const newTags = await executeQuery(
      `SELECT * FROM tags WHERE id = ?`,
      [id]
    );

    return this.mapToTag(newTags[0]);
  }

  async update(id: string, updates: Partial<Tag>): Promise<Tag | null> {
    const { name, color, description } = updates;
    
    const affectedRows = await executeUpdate(
      `UPDATE tags SET name = ?, color = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name?.trim(), color, description?.trim(), id]
    );

    if (affectedRows === 0) return null;

    const updatedTags = await executeQuery(
      `SELECT * FROM tags WHERE id = ?`,
      [id]
    );

    return this.mapToTag(updatedTags[0]);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    // Verificar uso
    const usage = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM customer_tags ct
      JOIN customers c ON ct.customer_id = c.id
      WHERE ct.tag_id = ? AND c.user_id = ?
    `, [id, userId]);

    const count = Number(usage[0]?.count || 0);
    if (count > 0) {
      throw new Error(`Tag used by ${count} customers`);
    }

    const affectedRows = await executeUpdate(
      `DELETE FROM tags WHERE id = ?`,
      [id]
    );

    return affectedRows > 0;
  }

  async findCustomersByTag(tagId: string, userId: string): Promise<any[]> {
    const customers = await executeQuery(`
      SELECT DISTINCT c.*
      FROM customers c
      JOIN customer_tags ct ON c.id = ct.customer_id
      WHERE ct.tag_id = ? AND c.user_id = ?
      ORDER BY c.name ASC
    `, [tagId, userId]);

    return customers;
  }

  async getPopularTags(userId: string): Promise<Tag[]> {
    const tags = await executeQuery(`
      SELECT 
        t.*,
        COUNT(ct.customer_id) as customerCount
      FROM tags t
      LEFT JOIN customer_tags ct ON t.id = ct.tag_id
      JOIN customers c ON ct.customer_id = c.id
      WHERE c.user_id = ?
      GROUP BY t.id
      ORDER BY COUNT(ct.customer_id) DESC
      LIMIT 10
    `, [userId]);

    return tags.map((row: any) => this.mapToTag(row));
  }

  async findAll(): Promise<Tag[]> {
    const tags = await executeQuery(`SELECT * FROM tags`);
    return tags.map((row: any) => this.mapToTag(row));
  }
}