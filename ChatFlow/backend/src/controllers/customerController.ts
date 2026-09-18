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

    const userId =
      (req as AuthenticatedRequest).user?.userId;

    if (
      !userId ||
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return null;
    }

    return userId;
  }


  private parseId(
    value: string | string[] | undefined
  ): number | null {

    if (!value || Array.isArray(value)) {
      return null;
    }

    const id = Number(value);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return null;
    }

    return id;
  }


  async getCustomers(
    req: Request,
    res: Response
  ) {

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


      const customers =
        await this.customerService.getCustomers(
          userId,
          search,
          status
        );


      return res.json(customers);

    } catch (error) {

      console.error(
        'Error loading customers:',
        error
      );

      return res.status(500).json({
        error: 'Error loading customers'
      });
    }
  }


  async create(
    req: Request,
    res: Response
  ) {

    try {

      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }


      const {
        name,
        phone,
        email,
        status
      } = req.body ?? {};


      /*
       * Validación del nombre
       */

      if (
        typeof name !== 'string' ||
        name.trim().length < 2 ||
        name.trim().length > 100
      ) {

        return res.status(400).json({
          error: 'Invalid name'
        });
      }


      /*
       * Validación del teléfono
       */

      if (
        typeof phone !== 'string' ||
        phone.trim().length < 3 ||
        phone.trim().length > 20
      ) {

        return res.status(400).json({
          error: 'Invalid phone'
        });
      }


      /*
       * Validación del email
       */

      if (
        email !== undefined &&
        email !== null &&
        typeof email !== 'string'
      ) {

        return res.status(400).json({
          error: 'Invalid email'
        });
      }


      /*
       * Los tags NO se reciben para guardarlos
       * directamente en customers.
       *
       * Se asignan posteriormente mediante
       * customerTagService.
       */


      const validStatuses = [
        'new',
        'in_conversation',
        'closed',
        'lost',
        'won'
      ] as const;


      /*
       * Si no se envía status usamos "new".
       */

      const customerStatus =
        status === undefined
          ? 'new'
          : status;


      if (
        typeof customerStatus !== 'string' ||
        !validStatuses.includes(
          customerStatus as typeof validStatuses[number]
        )
      ) {

        return res.status(400).json({
          error: 'Invalid status'
        });
      }


      const customer =
        await this.customerService.create(
          userId,
          {
            name: name.trim(),

            phone: phone.trim(),

            email:
              typeof email === 'string'
                ? email.trim() || undefined
                : undefined,

            status:
              customerStatus as
                typeof validStatuses[number]
          }
        );


      return res.status(201).json(customer);

    } catch (error: any) {

      console.error(
        'Create customer error:',
        error
      );


      if (
        error?.message ===
        'CUSTOMER_LIMIT_REACHED'
      ) {

        return res.status(403).json({
          error: 'Customer limit reached',
          message:
            'Has alcanzado el límite de clientes de tu plan.'
        });
      }


      if (
        error?.message ===
        'USER_NOT_FOUND'
      ) {

        return res.status(404).json({
          error: 'User not found'
        });
      }


      if (
        error?.message ===
        'INVALID_CUSTOMER_LIMIT'
      ) {

        return res.status(500).json({
          error:
            'Invalid customer limit configuration'
        });
      }


      if (
        error?.message ===
        'CUSTOMER_CREATE_FAILED'
      ) {

        return res.status(500).json({
          error: 'Error creating customer'
        });
      }


      if (
        error?.code === 'ER_DUP_ENTRY'
      ) {

        return res.status(409).json({
          error: 'Phone already exists'
        });
      }


      return res.status(500).json({
        error: 'Error creating customer'
      });
    }
  }


  async update(
    req: Request,
    res: Response
  ) {

    try {

      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }


      const customerId =
        this.parseId(req.params.id);


      if (!customerId) {
        return res.status(400).json({
          error: 'Invalid customer ID'
        });
      }


      /*
       * Mantenemos la regla actual:
       * el usuario solamente puede modificar status.
       */

      const {
        status
      } = req.body ?? {};


      const validStatuses = [
        'new',
        'in_conversation',
        'closed',
        'lost',
        'won'
      ] as const;


      if (
        typeof status !== 'string' ||
        !validStatuses.includes(
          status as typeof validStatuses[number]
        )
      ) {

        return res.status(400).json({
          error: 'Invalid status'
        });
      }


      const customer =
        await this.customerService.update(
          userId,
          customerId,
          {
            status:
              status as
                typeof validStatuses[number]
          }
        );


      if (!customer) {

        return res.status(404).json({
          error: 'Customer not found'
        });
      }


      return res.json(customer);

    } catch (error: any) {

      console.error(
        'Update customer error:',
        error
      );


      if (
        error?.message ===
        'INVALID_STATUS'
      ) {

        return res.status(400).json({
          error: 'Invalid status'
        });
      }


      return res.status(500).json({
        error: 'Error updating customer'
      });
    }
  }


  async getOne(
    req: Request,
    res: Response
  ) {

    try {

      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }


      const customerId =
        this.parseId(req.params.id);


      if (!customerId) {
        return res.status(400).json({
          error: 'Invalid customer ID'
        });
      }


      const customer =
        await this.customerService.findById(
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

      console.error(
        'Get customer error:',
        error
      );

      return res.status(500).json({
        error: 'Error loading customer'
      });
    }
  }


  async delete(
    req: Request,
    res: Response
  ) {

    try {

      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }


      const customerId =
        this.parseId(req.params.id);


      if (!customerId) {
        return res.status(400).json({
          error: 'Invalid customer ID'
        });
      }


      const deleted =
        await this.customerService.delete(
          userId,
          customerId
        );


      if (!deleted) {

        return res.status(404).json({
          error: 'Customer not found'
        });
      }


      return res.json({
        message:
          'Customer deleted successfully'
      });

    } catch (error) {

      console.error(
        'Delete customer error:',
        error
      );

      return res.status(500).json({
        error: 'Error deleting customer'
      });
    }
  }


  async getByStatus(
    req: Request,
    res: Response
  ) {

    try {

      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }


      const [rows]: any =
        await pool.execute(
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
        );


      const customersMap =
        new Map<number, any>();


      for (const row of rows) {

        if (!customersMap.has(row.id)) {

          customersMap.set(
            row.id,
            {
              id: row.id,
              name: row.name,
              phone: row.phone,
              email: row.email,
              status: row.status,
              created_at: row.created_at,
              tags: []
            }
          );
        }


        if (row.tag_id) {

          customersMap
            .get(row.id)
            .tags
            .push({
              id: row.tag_id,
              name: row.tag_name,
              color: row.tag_color
            });
        }
      }


      return res.json(
        Array.from(
          customersMap.values()
        )
      );

    } catch (error) {

      console.error(
        'Pipeline error:',
        error
      );

      return res.status(500).json({
        error: 'Pipeline load failed'
      });
    }
  }


  async updateStatus(
    req: Request,
    res: Response
  ) {

    try {

      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }


      const customerId =
        this.parseId(req.params.id);


      const { status } =
        req.body ?? {};


      if (!customerId) {

        return res.status(400).json({
          error: 'Invalid ID'
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
        !validStatuses.includes(
          status as typeof validStatuses[number]
        )
      ) {

        return res.status(400).json({
          error: 'Invalid status'
        });
      }


      const customer =
        await this.customerService.update(
          userId,
          customerId,
          {
            status:
              status as
                typeof validStatuses[number]
          }
        );


      if (!customer) {

        return res.status(404).json({
          error: 'Customer not found'
        });
      }


      return res.json(customer);

    } catch (error: any) {

      console.error(
        'Update status error:',
        error
      );


      if (
        error?.message ===
        'INVALID_STATUS'
      ) {

        return res.status(400).json({
          error: 'Invalid status'
        });
      }


      return res.status(500).json({
        error:
          'Error updating customer status'
      });
    }
  }


  async assignTags(
    req: Request,
    res: Response
  ) {

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


      const { tagIds } =
        req.body ?? {};


      if (!Array.isArray(tagIds)) {

        return res.status(400).json({
          error: 'tagIds must be an array'
        });
      }


      const customer =
        await this.customerTagService
          .assignTagsToCustomer(
            customerId,
            String(userId),
            tagIds.map(String)
          );


      return res.json(customer);

    } catch (error: any) {

      console.error(
        'Assign tags error:',
        error
      );


      if (
        error?.message ===
        'Customer not found'
      ) {

        return res.status(404).json({
          error: 'Customer not found'
        });
      }


      if (
        error?.message ===
        'One or more tags are invalid'
      ) {

        return res.status(400).json({
          error:
            'One or more tags are invalid'
        });
      }


      return res.status(500).json({
        error: 'Error assigning tags'
      });
    }
  }


  async getCustomerTags(
    req: Request,
    res: Response
  ) {

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
        await this.customerTagService
          .findTagsByCustomer(
            customerId,
            String(userId)
          );


      return res.json(tags);

    } catch (error) {

      console.error(
        'Get customer tags error:',
        error
      );

      return res.status(500).json({
        error:
          'Error loading customer tags'
      });
    }
  }
}
