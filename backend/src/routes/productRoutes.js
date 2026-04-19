import { Router } from 'express';
import multer from 'multer';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from '../controllers/productController.js';
import { requireAdmin } from '../middleware/auth.js';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', requireAdmin, upload.array('images', 6), createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
