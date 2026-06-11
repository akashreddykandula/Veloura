import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { createProduct, deleteProduct, filters, getProduct, listProducts, reviewProduct, updateProduct } from '../controllers/productController.js';

const router = express.Router();
router.get('/', listProducts);
router.get('/filters', filters);
router.get('/:slug', getProduct);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/:id/reviews', protect, reviewProduct);
export default router;
