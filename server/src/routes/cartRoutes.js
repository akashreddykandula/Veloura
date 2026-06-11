import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addToCart, applyCoupon, getCart, removeCartItem, saveForLater, updateCartItem } from '../controllers/cartController.js';

const router = express.Router();
const optionalUser = (req, res, next) => {
  if (!req.headers.authorization) return next();
  return protect(req, res, next);
};
router.get('/', optionalUser, getCart);
router.post('/items', optionalUser, addToCart);
router.patch('/items/:itemId', optionalUser, updateCartItem);
router.delete('/items/:itemId', optionalUser, removeCartItem);
router.post('/items/:itemId/save-for-later', optionalUser, saveForLater);
router.post('/coupon', optionalUser, applyCoupon);
export default router;
