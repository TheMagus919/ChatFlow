"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const dbHelper_1 = require("../utils/dbHelper");
class TagService {
    mapToTag(row) {
        return {
            id: String(row.id),
            name: String(row.name),
            color: String(row.color),
            description: row.description ? String(row.description) : undefined,
            customerCount: row.customerCount ? Number(row.customerCount) : 0
        };
    }
    async findAllByUser(userId) {
        const tags = await (0, dbHelper_1.executeQuery)(`
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
        return tags.map((row) => this.mapToTag(row));
    }
    async create(name, color, description) {
        const id = `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await (0, dbHelper_1.executeInsert)(`INSERT INTO tags (id, name, color, description) VALUES (?, ?, ?, ?)`, [id, name.trim(), color || '#64748B', description?.trim()]);
        const newTags = await (0, dbHelper_1.executeQuery)(`SELECT * FROM tags WHERE id = ?`, [id]);
        return this.mapToTag(newTags[0]);
    }
    async update(id, updates) {
        const { name, color, description } = updates;
        const affectedRows = await (0, dbHelper_1.executeUpdate)(`UPDATE tags SET name = ?, color = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [name?.trim(), color, description?.trim(), id]);
        if (affectedRows === 0)
            return null;
        const updatedTags = await (0, dbHelper_1.executeQuery)(`SELECT * FROM tags WHERE id = ?`, [id]);
        return this.mapToTag(updatedTags[0]);
    }
    async delete(id, userId) {
        // Verificar uso
        const usage = await (0, dbHelper_1.executeQuery)(`
      SELECT COUNT(*) as count 
      FROM customer_tags ct
      JOIN customers c ON ct.customer_id = c.id
      WHERE ct.tag_id = ? AND c.user_id = ?
    `, [id, userId]);
        const count = Number(usage[0]?.count || 0);
        if (count > 0) {
            throw new Error(`Tag used by ${count} customers`);
        }
        const affectedRows = await (0, dbHelper_1.executeUpdate)(`DELETE FROM tags WHERE id = ?`, [id]);
        return affectedRows > 0;
    }
    async findCustomersByTag(tagId, userId) {
        const customers = await (0, dbHelper_1.executeQuery)(`
      SELECT DISTINCT c.*
      FROM customers c
      JOIN customer_tags ct ON c.id = ct.customer_id
      WHERE ct.tag_id = ? AND c.user_id = ?
      ORDER BY c.name ASC
    `, [tagId, userId]);
        return customers;
    }
    async getPopularTags(userId) {
        const tags = await (0, dbHelper_1.executeQuery)(`
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
        return tags.map((row) => this.mapToTag(row));
    }
    async findAll() {
        const tags = await (0, dbHelper_1.executeQuery)(`SELECT * FROM tags`);
        return tags.map((row) => this.mapToTag(row));
    }
}
exports.TagService = TagService;
