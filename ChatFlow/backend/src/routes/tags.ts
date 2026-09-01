import { Router } from 'express';
import { TagsController } from '../controllers/tagsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const tagsController = new TagsController();

router.get('/',authenticateToken,tagsController.getAll.bind(tagsController));
router.post('/', authenticateToken, tagsController.create.bind(tagsController));
router.put('/:id', authenticateToken, tagsController.update.bind(tagsController));
router.delete('/:id', authenticateToken, tagsController.delete.bind(tagsController));
router.get('/:tagId/customers', authenticateToken, tagsController.getCustomersByTag.bind(tagsController));
router.get('/popular', authenticateToken, tagsController.getPopularTags.bind(tagsController));
router.get('/:id', authenticateToken, tagsController.getById.bind(tagsController));


export default router;