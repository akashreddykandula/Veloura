import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { deleteCategory, getCategory, listCategories, upsertCategory } from '../controllers/categoryController.js';

const router = express.Router();
router.get('/', listCategories);
router.get('/:slug', getCategory);
router.post('/', protect, authorize('admin'), upsertCategory);
router.put('/:id', protect, authorize('admin'), upsertCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);
export default router;
