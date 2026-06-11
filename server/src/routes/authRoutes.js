import express from 'express';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/authMiddleware.js';
import { forgotPassword, login, loginRules, me, register, registerRules, resetPassword } from '../controllers/authController.js';

const router = express.Router();
router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', protect, me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
export default router;
