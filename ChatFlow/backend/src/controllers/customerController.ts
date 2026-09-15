import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';
import { CustomerTagService } from '../services/customerTagService';
import pool from '../config/database';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export class CustomerController {
  private customerService = new CustomerService();
  private customerTagService = new CustomerTagService();

  private getUserId(req: Request): number | null {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId || !Number.isInteger(userId) || userId <= 0) {
      return null;
    }

    return userId;
  }

  private parseId(value: string | string[] | undefined): number | null {
    if (!value || Array.isArray(value)) {
      return null;
    }

    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }

    return id;
  }

  async getCustomers(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }

      const search =
        typeof req.query.search === 'string'
          ? req.query.search.trim()
          : undefined;

      const status =
        typeof req.query.status === 'string'
          ? req.query.status.trim()
          : undefined;

      const customers = await this.customerService.getCustomers(
        userId,
        search,
        status
      );

      return res.json(customers);
    } catch (error) {
      console.error('Error loading customers:', error);

      return res.status(500).json({
        error: 'Error loading customers'
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }

      const { name, phone, email, tags, status } = req.body ?? {};

      if (
        typeof name !== 'string' ||
        name.trim().length < 2 ||
        name.trim().length > 100
      ) {
        return res.status(400).json({
          error: 'Invalid name'
        });
      }

      if (
        typeof phone !== 'string' ||
        phone.trim().length < 3 ||
        phone.trim().length > 30
      ) {
        return res.status(400).json({
          error: 'Invalid phone'
        });
      }

      if (
        email !== undefined &&
        email !== null &&
        typeof email !== 'string'
      ) {
        return res.status(400).json({
          error: 'Invalid email'
        });
      }

      if (
        tags !== undefined &&
        !Array.isArray(tags)
      ) {
        return res.status(400).json({
          error: 'Invalid tags'
        });
      }
      const validStatuses = [
        'new',
        'in_conversation',
        'closed',
        'lost',
        'won'
      ] as const;
      if (
        typeof status !== 'string' ||
        !validStatuses.includes(status as typeof validStatuses[number])
      ) {
        return res.status(400).json({
          error: 'Invalid status'
        });
      }

      const customer = await this.customerService.create(userId, {
        name: name.trim(),
        phone: phone.trim(),
        email:
          typeof email === 'string'
            ? email.trim() || undefined
            : undefined,
        tags,
        status: status as typeof validStatuses[number]
      });

      return res.status(201).json(customer);
    } catch (error: any) {
      console.error('Create customer error:', error);

      if (error?.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          error: 'Phone already exists'
        });
      }

      return res.status(500).json({
        error: 'Error creating customer'
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }

      const customerId = this.parseId(req.params.id);

      if (!customerId) {
        return res.status(400).json({
          error: 'Invalid customer ID'
        });
      }

      const { name, phone, email, tags, status } = req.body ?? {};
      const data: any = {};

      if (name !== undefined) {
        if (
          typeof name !== 'string' ||
          name.trim().length < 2 ||
          name.trim().length > 100
        ) {
          return res.status(400).json({
            error: 'Invalid name'
          });
        }

        data.name = name.trim();
      }

      if (phone !== undefined) {
        if (
          typeof phone !== 'string' ||
          phone.trim().length < 3 ||
          phone.trim().length > 30
        ) {
          return res.status(400).json({
            error: 'Invalid phone'
          });
        }

        data.phone = phone.trim();
      }

      if (email !== undefined) {
        if (
          email !== null &&
          typeof email !== 'string'
        ) {
          return res.status(400).json({
            error: 'Invalid email'
          });
        }

        data.email =
          typeof email === 'string'
            ? email.trim() || null
            : null;
      }

      if (tags !== undefined) {
        if (!Array.isArray(tags)) {
          return res.status(400).json({
            error: 'Invalid tags'
          });
        }

        data.tags = tags;
      }
      const validStatuses = [
        'new',
        'in_conversation',
        'closed',
        'lost',
        'won'
      ] as const;

      if (
        typeof status !== 'string' ||
        !validStatuses.includes(status as typeof validStatuses[number])
      ) {
        return res.status(400).json({
          error: 'Invalid status'
        });
      }

      if (Object.keys(data).length === 0) {
        return res.status(400).json({
          error: 'No fields to update'
        });
      }

      const customer = await this.customerService.update(
        userId,
        customerId,
        {
          status: status as typeof validStatuses[number]
        }
      );

      if (!customer) {
        return res.status(404).json({
          error: 'Customer not found'
        });
      }

      return res.json(customer);
    } catch (error: any) {
      console.error('Update customer error:', error);

      if (error?.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          error: 'Phone already exists'
        });
      }

      return res.status(500).json({
        error: 'Error updating customer'
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }

      const customerId = this.parseId(req.params.id);

      if (!customerId) {
        return res.status(400).json({
          error: 'Invalid customer ID'
        });
      }

      const customer = await this.customerService.findById(
        userId,
        customerId
      );

      if (!customer) {
        return res.status(404).json({
          error: 'Customer not found'
        });
      }

      return res.json(customer);
    } catch (error) {
      console.error('Get customer error:', error);

      return res.status(500).json({
        error: 'Error loading customer'
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }

      const customerId = this.parseId(req.params.id);

      if (!customerId) {
        return res.status(400).json({
          error: 'Invalid customer ID'
        });
      }

      const deleted = await this.customerService.delete(
        userId,
        customerId
      );

      if (!deleted) {
        return res.status(404).json({
          error: 'Customer not found'
        });
      }

      return res.json({
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      console.error('Delete customer error:', error);

      return res.status(500).json({
        error: 'Error deleting customer'
      });
    }
  }

  async getByStatus(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }

      const [rows] = await pool.execute(
        `
        SELECT
          c.id,
          c.name,
          c.phone,
          c.email,
          c.status,
          c.created_at,
          t.id AS tag_id,
          t.name AS tag_name,
          t.color AS tag_color
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

      const customersMap = new Map<number, any>();

      for (const row of rows) {
        if (!customersMap.has(row.id)) {
          customersMap.set(row.id, {
            id: row.id,
            name: row.name,
            phone: row.phone,
            email: row.email,
            status: row.status,
            created_at: row.created_at,
            tags: []
          });
        }

        if (row.tag_id) {
          customersMap.get(row.id).tags.push({
            id: row.tag_id,
            name: row.tag_name,
            color: row.tag_color
          });
        }
      }

      return res.json(
        Array.from(customersMap.values())
      );
    } catch (error) {
      console.error('Pipeline error:', error);

      return res.status(500).json({
        error: 'Pipeline load failed'
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }

      const customerId = this.parseId(req.params.id);
      const { status } = req.body ?? {};

      if (!customerId) {
        return res.status(400).json({
          error: 'Invalid ID'
        });
      }

      if (
        typeof status !== 'string' ||
        !['new', 'in_conversation', 'closed'].includes(status)
      ) {
        return res.status(400).json({
          error: 'Invalid status'
        });
      }

      const customer = await this.customerService.update(
        userId,
        customerId,
        { status: status as 'new' | 'in_conversation' | 'closed' | 'lost' | 'won' }
      );

      if (!customer) {
        return res.status(404).json({
          error: 'Customer not found'
        });
      }

      return res.json(customer);
    } catch (error) {
      console.error('Update status error:', error);

      return res.status(500).json({
        error: 'Error updating customer status'
      });
    }
  }

  async assignTags(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }

      const customerId =
        Array.isArray(req.params.customerId)
          ? null
          : req.params.customerId;

      if (!customerId) {
        return res.status(400).json({
          error: 'Invalid customer ID'
        });
      }

      const { tagIds } = req.body ?? {};

      if (!Array.isArray(tagIds)) {
        return res.status(400).json({
          error: 'tagIds must be an array'
        });
      }

      const customer =
        await this.customerTagService.assignTagsToCustomer(
          customerId,
          String(userId),
          tagIds.map(String)
        );

      return res.json(customer);
    } catch (error: any) {
      console.error('Assign tags error:', error);

      if (error?.message === 'Customer not found') {
        return res.status(404).json({
          error: 'Customer not found'
        });
      }

      if (error?.message === 'One or more tags are invalid') {
        return res.status(400).json({
          error: 'One or more tags are invalid'
        });
      }

      return res.status(500).json({
        error: 'Error assigning tags'
      });
    }
  }

  async getCustomerTags(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }

      const customerId =
        Array.isArray(req.params.customerId)
          ? null
          : req.params.customerId;

      if (!customerId) {
        return res.status(400).json({
          error: 'Invalid customer ID'
        });
      }

      const tags =
        await this.customerTagService.findTagsByCustomer(
          customerId,
          String(userId)
        );

      return res.json(tags);
    } catch (error) {
      console.error('Get customer tags error:', error);

      return res.status(500).json({
        error: 'Error loading customer tags'
      });
    }
  }
}

/*import { Request, Response } from 'express';
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
*/