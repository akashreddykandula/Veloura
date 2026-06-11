import express from 'express';
import { verifyPayment } from '../controllers/orderController.js';

const router = express.Router();
router.post('/razorpay/verify', verifyPayment);
export default router;
