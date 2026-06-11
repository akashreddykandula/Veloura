import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { adminOrders, cancelOrder, createOrder, getOrder, inventoryReport, invoice, myOrders, requestReturn, updateOrderStatus, verifyPayment } from '../controllers/orderController.js';

const router = express.Router();
router.post('/', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/mine', protect, myOrders);
router.get('/inventory-report', protect, authorize('admin'), inventoryReport);
router.get('/admin', protect, authorize('admin'), adminOrders);
router.get('/:id', protect, getOrder);
router.post('/:id/cancel', protect, cancelOrder);
router.post('/:id/return', protect, requestReturn);
router.get('/:id/invoice', protect, invoice);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);
export default router;
