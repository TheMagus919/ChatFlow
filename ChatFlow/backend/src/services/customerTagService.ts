import { executeQuery, executeUpdate } from '../utils/dbHelper';

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

    // Verificar que TODAS las etiquetas pertenecen al usuario.
    // Las etiquetas se consideran válidas si están disponibles
    // para clientes de ese usuario.
    if (normalizedTagIds.length > 0) {
      const placeholders = normalizedTagIds.map(() => '?').join(', ');

      const validTags = await executeQuery(
        `SELECT DISTINCT t.id
         FROM tags t
         JOIN customer_tags existing_ct
           ON existing_ct.tag_id = t.id
         JOIN customers existing_c
           ON existing_c.id = existing_ct.customer_id
         WHERE t.id IN (${placeholders})
           AND existing_c.user_id = ?`,
        [...normalizedTagIds, userId]
      );

      const validTagIds = new Set(
        validTags.map((tag: any) => String(tag.id))
      );

      const invalidTagIds = normalizedTagIds.filter(
        id => !validTagIds.has(id)
      );

      if (invalidTagIds.length > 0) {
        throw new Error('One or more tags are invalid');
      }
    }

    // Eliminar asociaciones anteriores
    await executeUpdate(
      `DELETE FROM customer_tags
       WHERE customer_id = ?`,
      [customerId]
    );

    // Insertar nuevas asociaciones
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

    // Retornar cliente actualizado
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
       WHERE c.id = ? AND c.user_id = ?
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

/*import { executeQuery, executeUpdate } from '../utils/dbHelper';

export class CustomerTagService {
  async assignTagsToCustomer(customerId: string, userId: string, tagIds: string[]): Promise<any> {
    // Verificar customer
    const customers = await executeQuery(
      `SELECT id FROM customers WHERE id = ? AND user_id = ?`,
      [customerId, userId]
    );

    if (customers.length === 0) {
      throw new Error('Customer not found');
    }

    // Eliminar tags existentes
    await executeUpdate(
      `DELETE FROM customer_tags WHERE customer_id = ?`,
      [customerId]
    );

    // Insertar nuevos tags
    if (tagIds && tagIds.length > 0) {
      const values = tagIds.map(() => '(?, ?)').join(', ');
      console.log('🔍 assignTags - values:', values);  // DEBUG
      const params = tagIds.flatMap(tagId => [
        customerId,
        tagId
      ]);
      
      await executeQuery(
        `INSERT INTO customer_tags (customer_id, tag_id)
        VALUES ${values}`,
        params
      );
    }

    // Retornar customer con tags
    const updatedCustomers = await executeQuery(`
      SELECT c.*, 
             GROUP_CONCAT(t.name SEPARATOR ',') as tag_names,
             GROUP_CONCAT(t.color SEPARATOR ',') as tag_colors
      FROM customers c
      LEFT JOIN customer_tags ct ON c.id = ct.customer_id
      LEFT JOIN tags t ON ct.tag_id = t.id
      WHERE c.id = ?
      GROUP BY c.id
    `, [customerId]);

    return updatedCustomers[0];
  }

  async findTagsByCustomer(customerId: string): Promise<any[]> {
    const tags = await executeQuery(
      `SELECT t.id, t.name, t.color, t.description
       FROM tags t
       JOIN customer_tags ct ON t.id = ct.tag_id
       JOIN customers c ON ct.customer_id = c.id
       WHERE c.id = ?`,
      [customerId]
    );
    return tags;
  }

}
*/