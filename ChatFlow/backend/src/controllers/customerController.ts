import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';
import { executeQuery } from '../utils/dbHelper';
import pool from '../config/database';
import { CustomerTagService } from '../services/customerTagService';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    id: number;
    email: string;
  };
}

export class CustomerController {
  private customerService = new CustomerService();
  private customerTagService = new CustomerTagService();

  // ✅ HELPER: Extraer userId SAFE
  private getUserId(req: AuthRequest): number {
    console.log('🔍 getUserId - req.user:', req.user);  // DEBUG
    if (!req.user?.id) {
      throw new Error('Unauthorized');
    }
    return req.user.id;
  }

  async getCustomers(
  req: Request,
  res: Response
) {

  try {

    const userId =
      (req as any).user?.userId;

    const search =
      req.query.search as string;

    const status =
      req.query.status as string;

    const customers =
      await this.customerService.getCustomers(
        userId,
        search,
        status
      );
      
    return res.json(customers);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Error loading customers'
    });

  }
}

  async assignTags(
  req: Request,
  res: Response
) {

  try {

    const userId =
      (req as any).user.userId;

    const customerId =
      req.params.customerId;

    if (!customerId || Array.isArray(customerId)) {
      return res.status(400).json({
        error: 'Invalid customer id'
      });
    }
    console.log('🔍 assignTags - customerId:', customerId, 'userId:', userId);  // DEBUG
    console.log('🔍 assignTags - req.body:', req.body);  // DEBUG
    const { tagIds } = req.body;

    const customer =
    await this.customerTagService.assignTagsToCustomer(
      customerId,
      userId,
      tagIds || []
    );
    console.log('✅ Tags assigned successfully:', customer);  // DEBUG
    res.json(customer);

  } catch (error: any) {

    console.error(
      'Assign tags error:',
      error
    );

    res.status(500).json({
      error: error.message
    });

  }

}

  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const customer = await this.customerService.create(userId, req.body);
      res.status(201).json(customer);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Phone already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    
    // ✅ FIXED: Parse seguro de ID
    const idString = req.params.id;
    if (!idString || Array.isArray(idString)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }
    
    const customerId = parseInt(idString, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    const customer = await this.customerService.update(userId, customerId, req.body as any);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async getByStatus(req: Request, res: Response) {
  try {
  console.log('userId:', (req as any).user?.userId);
    const userId = (req as any).user.userId;
    
    console.log('🔍 Pipeline request - userId:', userId);  // DEBUG
    
    // ✅ SIMPLE: TODOS los customers del usuario
    const [rows] = await pool.execute(
      `
      SELECT
        c.id,
        c.name,
        c.phone,
        c.email,
        c.status,
        c.created_at,

        t.id as tag_id,
        t.name as tag_name,
        t.color as tag_color

      FROM customers c

      LEFT JOIN customer_tags ct
        ON ct.customer_id = c.id

      LEFT JOIN tags t
        ON t.id = ct.tag_id

      WHERE c.user_id = ?

      ORDER BY c.created_at DESC
      `,
      [userId]
    ) as any;

    console.log('📊 Pipeline found:', rows.length, 'customers');  // DEBUG
    const customersMap = new Map();

    rows.forEach((row: any) => {

      if (!customersMap.has(row.id)) {

        customersMap.set(row.id, {

          id: row.id,
          name: row.name,
          phone: row.phone,
          email: row.email,
          status: row.status,
          created_at: row.created_at,
          tags: rows
          .filter((r: any) => r.id === row.id && r.tag_id)
          .map((r: any) => ({
            id: r.tag_id,
            name: r.tag_name,
            color: r.tag_color
          }))

        });

      }

    });
    res.json(Array.from(customersMap.values()));
  } catch (error: any) {
    console.error('❌ Pipeline ERROR:', error.message);
    res.status(500).json({ error: 'Pipeline load failed' });
  }
}

async updateStatus(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const idString = req.params.id;
    const { status } = req.body;
    // ✅ Parse seguro
    if (!idString || Array.isArray(idString)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    if (!idString || !status) {
      return res.status(400).json({ error: 'ID and status required' });
    }
    
    const id = parseInt(idString, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const customerService = new CustomerService();
    const customer = await customerService.update(userId, id, { status });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    console.log('CUSTOMER RETURN:', customer);
    res.json(customer);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
  async getOne(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    
    // ✅ Parse seguro
    const idString = req.params.id;
    if (!idString || Array.isArray(idString)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const id = parseInt(idString, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const customer = await this.customerService.findById(userId, id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async delete(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    
    // ✅ Parse seguro
    const idString = req.params.id;
    if (!idString || Array.isArray(idString)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    const id = parseInt(idString, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deleted = await this.customerService.delete(userId, id);
    if (!deleted) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

getCustomerTags = async (
  req: Request,
  res: Response
) => {

  try {

    const customerId =
      req.params.customerId;

    if (
      !customerId ||
      Array.isArray(customerId)
    ) {

      return res.status(400).json({
        error: 'Invalid customer id'
      });

    }

    const tags =
      await this.customerTagService
        .findTagsByCustomer(customerId);
    console.log('🔍 Tags for customer', customerId, ':', tags);  // DEBUG
    return res.json(tags);

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });

  }

}

}