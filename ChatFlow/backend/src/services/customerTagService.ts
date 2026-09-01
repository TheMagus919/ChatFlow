import { executeQuery, executeUpdate } from '../utils/dbHelper';

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