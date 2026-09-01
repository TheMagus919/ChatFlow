import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const controller = new CustomerController();

router.get('/', authenticateToken, controller.getCustomers.bind(controller));
router.get('/pipeline', authenticateToken, controller.getByStatus);
router.patch('/:id/status', authenticateToken, controller.updateStatus);
router.post('/:customerId/tags', authenticateToken,controller.assignTags.bind(controller));
router.get('/:customerId/tags', authenticateToken, controller.getCustomerTags);
//router.get('/phone/:phone', authenticateToken, controller.findByPhone);

//ABM
router.post('/', authenticateToken, controller.create);
router.put('/:id', authenticateToken, controller.update);
router.delete('/:id', authenticateToken, controller.delete);
export default router;