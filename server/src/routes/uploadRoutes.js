import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { upload, uploadImage } from '../controllers/uploadController.js';

const router = express.Router();
router.post('/image', protect, authorize('admin'), upload.single('image'), uploadImage);
export default router;
