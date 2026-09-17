import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const controller = new CustomerController();

router.get('/', authenticateToken, controller.getCustomers.bind(controller));
router.get('/pipeline', authenticateToken, controller.getByStatus.bind(controller));
router.get('/pipeline', authenticateToken, controller.getByStatus.bind(controller));
router.patch('/:id/status', authenticateToken, controller.updateStatus.bind(controller));
router.post('/:customerId/tags', authenticateToken,controller.assignTags.bind(controller));
router.get('/:customerId/tags', authenticateToken, controller.getCustomerTags.bind(controller));

//ABM
router.post('/', authenticateToken, controller.create.bind(controller));
router.put('/:id', authenticateToken, controller.update.bind(controller));
router.delete('/:id', authenticateToken, controller.delete.bind(controller));
export default router;