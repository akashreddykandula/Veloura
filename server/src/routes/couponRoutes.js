import express from 'express';
import { applyCoupon } from '../controllers/cartController.js';

const router = express.Router();
router.post('/validate', applyCoupon);
export default router;
