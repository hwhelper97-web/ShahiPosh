import { Router } from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', createOrder);
router.get('/', requireAdmin, getOrders);

export default router;
