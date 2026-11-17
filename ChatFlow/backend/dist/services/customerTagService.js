"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerTagService = void 0;
const database_1 = __importDefault(require("../config/database"));
class CustomerTagService {
    async assignTagsToCustomer(customerId, userId, tagIds) {
        const customerIdNumber = Number(customerId);
        const userIdNumber = Number(userId);
        if (!Number.isInteger(customerIdNumber) ||
            customerIdNumber <= 0 ||
            !Number.isInteger(userIdNumber) ||
            userIdNumber <= 0) {
            throw new Error('Invalid customer or user ID');
        }
        if (!Array.isArray(tagIds)) {
            throw new Error('Invalid tag IDs');
        }
        const normalizedTagIds = [
            ...new Set(tagIds.map(id => String(id).trim()))
        ];
        if (normalizedTagIds.some(id => !id || id.length > 50)) {
            throw new Error('One or more tags are invalid');
        }
        const connection = await database_1.default.getConnection();
        try {
            await connection.beginTransaction();
            const [customerRows] = await connection.execute(`
        SELECT id
        FROM customers
        WHERE id = ?
          AND user_id = ?
        LIMIT 1
        `, [customerIdNumber, userIdNumber]);
            if (!customerRows.length) {
                throw new Error('Customer not found');
            }
            if (normalizedTagIds.length > 0) {
                const placeholders = normalizedTagIds
                    .map(() => '?')
                    .join(', ');
                const [tagRows] = await connection.execute(`
          SELECT id
          FROM tags
          WHERE id IN (${placeholders})
            AND (user_id IS NULL OR user_id = ?)
          `, [...normalizedTagIds, userIdNumber]);
                const existingTagIds = new Set(tagRows.map((tag) => String(tag.id)));
                const invalidTagIds = normalizedTagIds.filter(tagId => !existingTagIds.has(tagId));
                if (invalidTagIds.length > 0) {
                    throw new Error('One or more tags are invalid');
                }
            }
            await connection.execute(`
        DELETE FROM customer_tags
        WHERE customer_id = ?
        `, [customerIdNumber]);
            if (normalizedTagIds.length > 0) {
                const values = normalizedTagIds
                    .map(() => '(?, ?)')
                    .join(', ');
                const params = normalizedTagIds.flatMap(tagId => [
                    customerIdNumber,
                    tagId
                ]);
                await connection.execute(`
          INSERT INTO customer_tags
            (customer_id, tag_id)
          VALUES ${values}
          `, params);
            }
            const [updatedCustomers] = await connection.execute(`
        SELECT
          c.*,
          GROUP_CONCAT(
            t.name
            ORDER BY t.name
            SEPARATOR ','
          ) AS tag_names,
          GROUP_CONCAT(
            t.color
            ORDER BY t.name
            SEPARATOR ','
          ) AS tag_colors
        FROM customers c
        LEFT JOIN customer_tags ct
          ON c.id = ct.customer_id
        LEFT JOIN tags t
          ON t.id = ct.tag_id
        WHERE c.id = ?
          AND c.user_id = ?
        GROUP BY c.id
        `, [customerIdNumber, userIdNumber]);
            await connection.commit();
            return updatedCustomers[0] ?? null;
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    async findTagsByCustomer(customerId, userId) {
        const customerIdNumber = Number(customerId);
        const userIdNumber = Number(userId);
        if (!Number.isInteger(customerIdNumber) ||
            customerIdNumber <= 0 ||
            !Number.isInteger(userIdNumber) ||
            userIdNumber <= 0) {
            throw new Error('Invalid customer or user ID');
        }
        const [rows] = await database_1.default.execute(`
      SELECT
        t.id,
        t.name,
        t.color,
        t.description,
        t.user_id
      FROM tags t
      INNER JOIN customer_tags ct
        ON t.id = ct.tag_id
      INNER JOIN customers c
        ON ct.customer_id = c.id
      WHERE c.id = ?
        AND c.user_id = ?
        AND (t.user_id IS NULL OR t.user_id = ?)
      ORDER BY t.name ASC
      `, [customerIdNumber, userIdNumber, userIdNumber]);
        return Array.isArray(rows) ? rows : [];
    }
}
exports.CustomerTagService = CustomerTagService;
