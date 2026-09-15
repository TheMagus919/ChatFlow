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