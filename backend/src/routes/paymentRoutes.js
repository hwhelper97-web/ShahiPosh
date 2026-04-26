import { Router } from 'express';
import { handleWebhook } from '../controllers/paymentController.js';

const router = Router();

// Secure webhook endpoint
router.post('/webhook', handleWebhook);

export default router;
