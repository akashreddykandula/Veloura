import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { createTicket, listTickets, replyTicket } from '../controllers/supportController.js';

const router = express.Router();
router.post('/tickets', createTicket);
router.get('/tickets', protect, listTickets);
router.post('/tickets/:id/replies', protect, authorize('admin'), replyTicket);
export default router;
