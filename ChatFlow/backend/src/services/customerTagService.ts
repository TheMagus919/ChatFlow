import pool from '../config/database';

const VALID_TAG_ID = /^\d+$/;

export class CustomerTagService {
  async assignTagsToCustomer(
    customerId: string,
    userId: string,
    tagIds: string[]
  ): Promise<any> {
    const customerIdNumber = Number(customerId);
    const userIdNumber = Number(userId);

    if (
      !Number.isInteger(customerIdNumber) ||
      customerIdNumber <= 0 ||
      !Number.isInteger(userIdNumber) ||
      userIdNumber <= 0
    ) {
      throw new Error('Invalid customer or user ID');
    }

    const normalizedTagIds = [
      ...new Set(
        (Array.isArray(tagIds) ? tagIds : [])
          .map(String)
          .map(id => id.trim())
          .filter(id => VALID_TAG_ID.test(id))
          .map(Number)
          .filter(id => Number.isInteger(id) && id > 0)
      )
    ];

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Verificar que el cliente pertenece al usuario
      const [customerRows]: any = await connection.execute(
        `
        SELECT id
        FROM customers
        WHERE id = ?
          AND user_id = ?
        LIMIT 1
        `,
        [customerIdNumber, userIdNumber]
      );

      if (!customerRows.length) {
        throw new Error('Customer not found');
      }

      // Verificar que todos los tags existen
      // Los tags son globales y pueden ser utilizados por cualquier usuario.
      if (normalizedTagIds.length > 0) {
        const placeholders = normalizedTagIds
          .map(() => '?')
          .join(', ');

        const [tagRows]: any = await connection.execute(
          `
          SELECT id
          FROM tags
          WHERE id IN (${placeholders})
          `,
          normalizedTagIds
        );

        const existingTagIds = new Set(
          tagRows.map((tag: any) => Number(tag.id))
        );

        const invalidTagIds = normalizedTagIds.filter(
          tagId => !existingTagIds.has(tagId)
        );

        if (invalidTagIds.length > 0) {
          throw new Error('One or more tags are invalid');
        }
      }

      // Reemplazar todas las asociaciones dentro de la misma transacción
      await connection.execute(
        `
        DELETE FROM customer_tags
        WHERE customer_id = ?
        `,
        [customerIdNumber]
      );

      // Agregar los nuevos tags
      if (normalizedTagIds.length > 0) {
        const values = normalizedTagIds
          .map(() => '(?, ?)')
          .join(', ');

        const params = normalizedTagIds.flatMap(tagId => [
          customerIdNumber,
          tagId
        ]);

        await connection.execute(
          `
          INSERT INTO customer_tags
            (customer_id, tag_id)
          VALUES ${values}
          `,
          params
        );
      }

      // Obtener el cliente actualizado
      const [updatedCustomers]: any = await connection.execute(
        `
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
        `,
        [customerIdNumber, userIdNumber]
      );

      await connection.commit();

      return updatedCustomers[0] ?? null;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findTagsByCustomer(
    customerId: string,
    userId: string
  ): Promise<any[]> {
    const customerIdNumber = Number(customerId);
    const userIdNumber = Number(userId);

    if (
      !Number.isInteger(customerIdNumber) ||
      customerIdNumber <= 0 ||
      !Number.isInteger(userIdNumber) ||
      userIdNumber <= 0
    ) {
      throw new Error('Invalid customer or user ID');
    }

    return new Promise(async (resolve, reject) => {
      try {
        const [rows]: any = await pool.execute(
          `
          SELECT
            t.id,
            t.name,
            t.color,
            t.description
          FROM tags t
          INNER JOIN customer_tags ct
            ON t.id = ct.tag_id
          INNER JOIN customers c
            ON ct.customer_id = c.id
          WHERE c.id = ?
            AND c.user_id = ?
          ORDER BY t.name ASC
          `,
          [customerIdNumber, userIdNumber]
        );

        resolve(Array.isArray(rows) ? rows : []);
      } catch (error) {
        reject(error);
      }
    });
  }
}

/*import { executeQuery, executeUpdate } from '../utils/dbHelper';

export class CustomerTagService {
  async assignTagsToCustomer(
    customerId: string,
    userId: string,
    tagIds: string[]
  ): Promise<any> {

    // Verificar que el cliente pertenece al usuario
    const customers = await executeQuery(
      `SELECT id
      FROM customers
      WHERE id = ? AND user_id = ?`,
      [customerId, userId]
    );

    if (customers.length === 0) {
      throw new Error('Customer not found');
    }

    // Normalizar y eliminar IDs duplicados
    const normalizedTagIds = [
      ...new Set(
        (Array.isArray(tagIds) ? tagIds : [])
          .map(String)
          .map(id => id.trim())
          .filter(Boolean)
      )
    ];

    // Verificar que los tags realmente existen.
    // Los tags son globales y pueden ser utilizados por cualquier usuario.
    if (normalizedTagIds.length > 0) {

      const placeholders = normalizedTagIds
        .map(() => '?')
        .join(', ');

      const existingTags = await executeQuery(
        `SELECT id
        FROM tags
        WHERE id IN (${placeholders})`,
        normalizedTagIds
      );

      const existingTagIds = new Set(
        existingTags.map((tag: any) => String(tag.id))
      );

      const invalidTagIds = normalizedTagIds.filter(
        id => !existingTagIds.has(id)
      );

      if (invalidTagIds.length > 0) {
        throw new Error('One or more tags are invalid');
      }
    }

    // Reemplazar las asociaciones actuales
    await executeUpdate(
      `DELETE FROM customer_tags
      WHERE customer_id = ?`,
      [customerId]
    );

    // Agregar los nuevos tags
    if (normalizedTagIds.length > 0) {

      const values = normalizedTagIds
        .map(() => '(?, ?)')
        .join(', ');

      const params = normalizedTagIds.flatMap(tagId => [
        customerId,
        tagId
      ]);

      await executeQuery(
        `INSERT INTO customer_tags (customer_id, tag_id)
        VALUES ${values}`,
        params
      );
    }

    // Devolver el cliente actualizado
    const updatedCustomers = await executeQuery(
      `SELECT
        c.*,
        GROUP_CONCAT(t.name SEPARATOR ',') AS tag_names,
        GROUP_CONCAT(t.color SEPARATOR ',') AS tag_colors
      FROM customers c
      LEFT JOIN customer_tags ct
        ON c.id = ct.customer_id
      LEFT JOIN tags t
        ON t.id = ct.tag_id
      WHERE c.id = ?
        AND c.user_id = ?
      GROUP BY c.id`,
      [customerId, userId]
    );

    return updatedCustomers[0] ?? null;
  }

  async findTagsByCustomer(
  customerId: string,
  userId: string
): Promise<any[]> {
  return executeQuery(
    `SELECT
       t.id,
       t.name,
       t.color,
       t.description
     FROM tags t
     JOIN customer_tags ct
       ON t.id = ct.tag_id
     JOIN customers c
       ON ct.customer_id = c.id
     WHERE c.id = ?
       AND c.user_id = ?
     ORDER BY t.name ASC`,
    [customerId, userId]
  );
}
}
*/