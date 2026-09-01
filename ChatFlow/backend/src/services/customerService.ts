import pool from '../config/database';
import { Customer, CreateCustomer } from '../models/Customer';

export class CustomerService {
  async getCustomers(
    userId: number,
    search?: string,
    status?: string
  ): Promise<Customer[]>{

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

    const params: any[] = [userId];

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

    const [rows]: any =
      await pool.query(
        query,
        params
      );

    return rows;

  };

  async findAllByUser(userId: number): Promise<Customer[]> {
    const [rows] = await pool.execute(
      `SELECT id, user_id, name, phone, email, tags, status, last_message_at, 
              created_at, updated_at 
       FROM customers 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    ) as any;
    return rows.map((row: any) => ({
      ...row,
      tags: JSON.parse(row.tags || '[]')
    }));
  }

  async create(userId: number, data: CreateCustomer): Promise<Customer> {
    const [result] = await pool.execute(
      `INSERT INTO customers (user_id, name, phone, email, tags, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        data.name,
        data.phone,
        data.email || null,
        JSON.stringify(data.tags || []),
        data.status || 'new'
      ]
    ) as any;

    const [rows] = await pool.execute(
      'SELECT * FROM customers WHERE id = ?',
      [result.insertId]
    ) as any;

    const customer = rows[0];
    return {
      ...customer,
      tags: JSON.parse(customer.tags)
    };
  }

  async findById(userId: number, id: number): Promise<Customer | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM customers WHERE id = ? AND user_id = ?',
      [id, userId]
    ) as any;

    if (!rows[0]) return null;
    const customer = rows[0];
    return { ...customer};
  }

  async update(
  userId: number,
  id: number,
  data: Partial<Customer>
): Promise<Customer | null> {

  const fields: string[] = [];
  const values: any[] = [];

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

  const [result] = await pool.execute(
    `
    UPDATE customers
    SET ${fields.join(', ')},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
    `,
    values
  ) as any;


  if (result.affectedRows === 0) {
    return null;
  }

  return this.findById(userId, id);
}

  async delete(userId: number, id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM customers WHERE id = ? AND user_id = ?',
      [id, userId]
    ) as any;
    return result.affectedRows > 0;
  }
}