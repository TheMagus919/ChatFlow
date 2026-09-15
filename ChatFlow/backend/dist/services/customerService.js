"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const database_1 = __importDefault(require("../config/database"));
class CustomerService {
    async getCustomers(userId, search, status) {
        let query = `
      SELECT
        id,
        name,
        phone,
        email,
        status,
        last_message_at,
        created_at,
        updated_at

      FROM customers

      WHERE user_id = ?
    `;
        const params = [userId];
        if (status && status !== 'all') {
            query += `
        AND status = ?
      `;
            params.push(status);
        }
        if (search) {
            query += `
        AND (
          name LIKE ?
          OR phone LIKE ?
        )
      `;
            params.push(`%${search}%`);
            params.push(`%${search}%`);
        }
        query += `
      ORDER BY name ASC
    `;
        const [rows] = await database_1.default.query(query, params);
        return rows;
    }
    ;
    async findAllByUser(userId) {
        const [rows] = await database_1.default.execute(`SELECT id, user_id, name, phone, email, tags, status, last_message_at, 
              created_at, updated_at 
       FROM customers 
       WHERE user_id = ? 
       ORDER BY created_at DESC`, [userId]);
        return rows.map((row) => ({
            ...row,
            tags: JSON.parse(row.tags || '[]')
        }));
    }
    async create(userId, data) {
        const [result] = await database_1.default.execute(`INSERT INTO customers (user_id, name, phone, email, tags, status) 
       VALUES (?, ?, ?, ?, ?, ?)`, [
            userId,
            data.name,
            data.phone,
            data.email || null,
            JSON.stringify(data.tags || []),
            data.status || 'new'
        ]);
        const [rows] = await database_1.default.execute('SELECT * FROM customers WHERE id = ?', [result.insertId]);
        const customer = rows[0];
        return {
            ...customer,
            tags: JSON.parse(customer.tags)
        };
    }
    async findById(userId, id) {
        const [rows] = await database_1.default.execute('SELECT * FROM customers WHERE id = ? AND user_id = ?', [id, userId]);
        if (!rows[0])
            return null;
        const customer = rows[0];
        return { ...customer };
    }
    async update(userId, id, data) {
        const fields = [];
        const values = [];
        if (data.name !== undefined) {
            fields.push('name = ?');
            values.push(data.name);
        }
        if (data.phone !== undefined) {
            fields.push('phone = ?');
            values.push(data.phone);
        }
        if (data.email !== undefined) {
            fields.push('email = ?');
            values.push(data.email);
        }
        if (data.tags !== undefined) {
            fields.push('tags = ?');
            values.push(JSON.stringify(data.tags));
        }
        if (data.status !== undefined) {
            fields.push('status = ?');
            values.push(data.status);
        }
        if (fields.length === 0) {
            return null;
        }
        // WHERE al final
        values.push(id);
        values.push(userId);
        console.log('SQL:', `
    UPDATE customers
    SET ${fields.join(', ')},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `);
        console.log('VALUES:', values);
        const [result] = await database_1.default.execute(`
    UPDATE customers
    SET ${fields.join(', ')},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
    `, values);
        if (result.affectedRows === 0) {
            return null;
        }
        return this.findById(userId, id);
    }
    async delete(userId, id) {
        const [result] = await database_1.default.execute('DELETE FROM customers WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows > 0;
    }
}
exports.CustomerService = CustomerService;
