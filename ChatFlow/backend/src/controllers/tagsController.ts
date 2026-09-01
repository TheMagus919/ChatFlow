import { Request, Response } from 'express';
import { TagService } from '../services/tagService';
import { CustomerTagService } from '../services/customerTagService';
import { authenticateToken } from '../middleware/auth';
import { Tag } from '../models/Tag';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    id: number;     // keep original id if needed
    email: string;
  };
}

export class TagsController {
  private tagService = new TagService();
  private customerTagService = new CustomerTagService();
  // ✅ HELPER: Extraer userId SAFE
  private getUserId(req: AuthRequest): number {
    console.log('🔍 getUserId - req.user:', req.user);  // DEBUG
    if (!req.user?.id) {
      throw new Error('Unauthorized');
    }
    return req.user.id;
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const tags = await this.tagService.findAll();
      console.log('Fetched tags for userId', userId, ':', tags);  // DEBUG
      res.json({ success: true, data: tags });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { name, color, description } = req.body;
      
      const tag = await this.tagService.create(name, color, description);
      res.status(201).json({ success: true, data: tag });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Tag name already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = req.params.id as string;
      const updates = req.body as Partial<Tag>;

      const tag = await this.tagService.update(id, updates);
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      
      res.json({ success: true, data: tag });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Tag name already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = req.params.id as string;

      await this.tagService.delete(id, userId);
      res.json({ success: true, message: 'Tag deleted successfully' });
    } catch (error: any) {
      if (error.message.includes('used by')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getCustomersByTag(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const tagId = req.params.tagId as string;
      const customers = await this.tagService.findCustomersByTag(tagId, userId);
      res.json({ success: true, data: customers });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPopularTags(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const tags = await this.tagService.getPopularTags(userId);
      res.json({ success: true, data: tags });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const tag = await this.customerTagService.findTagsByCustomer(id);
      res.json({ success: true, data: tag });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}