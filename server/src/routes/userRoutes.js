import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { addAddress, deleteAddress, getWishlist, listCustomers, toggleWishlist, updateAddress, updateProfile } from '../controllers/userController.js';

const router = express.Router();
router.get('/customers', protect, authorize('admin'), listCustomers);
router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, toggleWishlist);
export default router;
