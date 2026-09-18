import pool from '../config/database';
import { Customer, CreateCustomer } from '../models/Customer';

export class CustomerService {

  async getCustomers(
    userId: number,
    search?: string,
    status?: string
  ): Promise<Customer[]> {

    let query = `
      SELECT
        id,
        user_id,
        name,
        phone,
        email,
        status,
        last_message_at,
        created_at,
        updated_at,
        avatar
      FROM customers
      WHERE user_id = ?
    `;

    const params: any[] = [userId];

    if (status && status !== 'all') {
      query += ` AND status = ? `;
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

    query += ` ORDER BY name ASC `;

    const [rows]: any = await pool.query(
      query,
      params
    );

    return rows;
  }


  async findAllByUser(userId: number): Promise<Customer[]> {

    const [rows]: any = await pool.execute(
      `
      SELECT
        id,
        user_id,
        name,
        phone,
        email,
        status,
        last_message_at,
        created_at,
        updated_at,
        avatar
      FROM customers
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return rows;
  }


  async create(
    userId: number,
    data: CreateCustomer
  ): Promise<Customer> {

    const connection = await pool.getConnection();

    try {

      await connection.beginTransaction();

      /*
       * Bloqueamos al usuario durante la comprobación
       * para evitar que dos solicitudes simultáneas
       * superen customers_limit.
       */
      const [userRows]: any = await connection.execute(
        `
        SELECT customers_limit
        FROM users
        WHERE id = ?
        FOR UPDATE
        `,
        [userId]
      );

      if (!userRows.length) {
        throw new Error('USER_NOT_FOUND');
      }

      const customersLimit = Number(
        userRows[0].customers_limit
      );

      if (
        !Number.isFinite(customersLimit) ||
        customersLimit < 0
      ) {
        throw new Error('INVALID_CUSTOMER_LIMIT');
      }


      const [countRows]: any = await connection.execute(
        `
        SELECT COUNT(*) AS total
        FROM customers
        WHERE user_id = ?
        `,
        [userId]
      );

      const currentCustomers = Number(
        countRows[0].total
      );


      if (currentCustomers >= customersLimit) {
        throw new Error('CUSTOMER_LIMIT_REACHED');
      }


      /*
       * IMPORTANTE:
       * Los tags NO se almacenan en customers.
       *
       * Se administran mediante:
       * customer_tags
       *
       * Por eso no insertamos data.tags aquí.
       */
      const [result]: any = await connection.execute(
        `
        INSERT INTO customers
          (
            user_id,
            name,
            phone,
            email,
            status
          )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          userId,
          data.name,
          data.phone,
          data.email || null,
          data.status || 'new'
        ]
      );


      const [rows]: any = await connection.execute(
        `
        SELECT
          id,
          user_id,
          name,
          phone,
          email,
          status,
          last_message_at,
          created_at,
          updated_at,
          avatar
        FROM customers
        WHERE id = ?
          AND user_id = ?
        LIMIT 1
        `,
        [
          result.insertId,
          userId
        ]
      );


      if (!rows.length) {
        throw new Error('CUSTOMER_CREATE_FAILED');
      }


      await connection.commit();


      /*
       * Los tags se manejan por customerTagService.
       * Devolvemos [] para mantener una respuesta
       * compatible con el modelo actual.
       */
      return {
        ...rows[0],
        tags: []
      };

    } catch (error) {

      await connection.rollback();

      throw error;

    } finally {

      connection.release();

    }
  }


  async findById(
    userId: number,
    id: number
  ): Promise<Customer | null> {

    const [rows]: any = await pool.execute(
      `
      SELECT
        id,
        user_id,
        name,
        phone,
        email,
        status,
        last_message_at,
        created_at,
        updated_at,
        avatar
      FROM customers
      WHERE id = ?
        AND user_id = ?
      LIMIT 1
      `,
      [
        id,
        userId
      ]
    );

    if (!rows.length) {
      return null;
    }

    return rows[0];
  }


  async update(
    userId: number,
    id: number,
    data: Partial<Customer>
  ): Promise<Customer | null> {

    /*
     * Por regla de negocio, el usuario normal
     * solamente puede modificar el status.
     *
     * Name, phone, email y tags se manejan
     * mediante otros mecanismos.
     */

    if (data.status === undefined) {
      return null;
    }

    const validStatuses = [
      'new',
      'in_conversation',
      'closed',
      'lost',
      'won'
    ] as const;

    if (
      typeof data.status !== 'string' ||
      !validStatuses.includes(
        data.status as typeof validStatuses[number]
      )
    ) {
      throw new Error('INVALID_STATUS');
    }


    const [result]: any = await pool.execute(
      `
      UPDATE customers
      SET
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND user_id = ?
      `,
      [
        data.status,
        id,
        userId
      ]
    );


    if (result.affectedRows === 0) {
      return null;
    }


    return this.findById(
      userId,
      id
    );
  }


  async delete(
    userId: number,
    id: number
  ): Promise<boolean> {

    const [result]: any = await pool.execute(
      `
      DELETE FROM customers
      WHERE id = ?
        AND user_id = ?
      `,
      [
        id,
        userId
      ]
    );

    return result.affectedRows > 0;
  }
}
