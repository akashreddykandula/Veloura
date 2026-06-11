import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { subscribers, subscribe } from '../controllers/newsletterController.js';

const router = express.Router();
router.post('/subscribe', subscribe);
router.get('/subscribers', protect, authorize('admin'), subscribers);
export default router;
