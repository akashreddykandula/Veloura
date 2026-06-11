import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { dashboard, deleteCoupon, listBanners, listCoupons, reviewModeration, saveBanner, saveCoupon } from '../controllers/adminController.js';

const router = express.Router();
router.use(protect, authorize('admin'));
router.get('/dashboard', dashboard);
router.get('/coupons', listCoupons);
router.post('/coupons', saveCoupon);
router.put('/coupons/:id', saveCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.get('/banners', listBanners);
router.post('/banners', saveBanner);
router.put('/banners/:id', saveBanner);
router.patch('/products/:productId/reviews/:reviewId', reviewModeration);
export default router;
