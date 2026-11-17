
import { Request, Response } from 'express';
import { TagService } from '../services/tagService';
import { CustomerTagService } from '../services/customerTagService';
import { Tag } from '../models/Tag';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export class TagsController {
  private tagService = new TagService();
  private customerTagService = new CustomerTagService();

  private getUserId(req: Request): string | null {
    const userId = (req as AuthRequest).user?.userId;

    if (
      !userId ||
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return null;
    }

    return String(userId);
  }

  private handleError(res: Response, error: any) {
    if (error?.message === 'PLAN_UPGRADE_REQUIRED') {
      return res.status(403).json({
        error: 'PLAN_UPGRADE_REQUIRED',
        message: 'Necesitás el plan Pro o Business para administrar etiquetas personalizadas.'
      });
    }

    if (error?.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        error: 'USER_NOT_FOUND'
      });
    }

    if (error?.message === 'INVALID_TAG_NAME') {
      return res.status(400).json({
        error: 'INVALID_TAG_NAME',
        message: 'El nombre de la etiqueta debe tener entre 1 y 100 caracteres.'
      });
    }

    if (error?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'TAG_NAME_ALREADY_EXISTS',
        message: 'Ya existe una etiqueta con ese nombre en tu cuenta.'
      });
    }

    if (error?.message?.startsWith('TAG_IN_USE:')) {
      const count = Number(error.message.split(':')[1] || 0);

      return res.status(400).json({
        error: 'TAG_IN_USE',
        message: `La etiqueta está asignada a ${count} clientes.`,
        customerCount: count
      });
    }

    console.error('Tags controller error:', error);

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR'
    });
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tags = await this.tagService.findAllByUser(userId);

      return res.json({
        success: true,
        data: tags
      });

    } catch (error: any) {
      return this.handleError(res, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, color, description } = req.body ?? {};

      if (typeof name !== 'string') {
        return res.status(400).json({
          error: 'INVALID_TAG_NAME'
        });
      }

      const tag = await this.tagService.create(
        userId,
        name,
        typeof color === 'string' ? color : '#64748B',
        typeof description === 'string' ? description : undefined
      );

      return res.status(201).json({
        success: true,
        data: tag
      });

    } catch (error: any) {
      return this.handleError(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const id = req.params.id as string;
      const updates = req.body as Partial<Tag>;

      const tag = await this.tagService.update(
        id,
        userId,
        updates
      );

      if (!tag) {
        return res.status(404).json({
          error: 'TAG_NOT_FOUND',
          message: 'La etiqueta no existe o no pertenece a tu cuenta.'
        });
      }

      return res.json({
        success: true,
        data: tag
      });

    } catch (error: any) {
      return this.handleError(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const id = req.params.id as string;

      const deleted = await this.tagService.delete(id, userId);

      if (!deleted) {
        return res.status(404).json({
          error: 'TAG_NOT_FOUND',
          message: 'La etiqueta no existe o no pertenece a tu cuenta.'
        });
      }

      return res.json({
        success: true,
        message: 'Tag deleted successfully'
      });

    } catch (error: any) {
      return this.handleError(res, error);
    }
  }

  async getCustomersByTag(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tagId = req.params.tagId as string;

      const customers = await this.tagService.findCustomersByTag(
        tagId,
        userId
      );

      return res.json({
        success: true,
        data: customers
      });

    } catch (error: any) {
      return this.handleError(res, error);
    }
  }

  async getPopularTags(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tags = await this.tagService.getPopularTags(userId);

      return res.json({
        success: true,
        data: tags
      });

    } catch (error: any) {
      return this.handleError(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const id = req.params.id as string;

      const tags = await this.customerTagService.findTagsByCustomer(
        id,
        userId
      );

      return res.json({
        success: true,
        data: tags
      });

    } catch (error: any) {
      return this.handleError(res, error);
    }
  }
}
