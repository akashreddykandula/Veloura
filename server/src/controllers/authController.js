import crypto from 'crypto';
import { body } from 'express-validator';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import { sendEmail } from '../utils/email.js';

const authResponse = (user, token) => ({
  token,
  user: { id: user._id, name: user.name, email: user.email, role: user.role, wishlist: user.wishlist }
});

export const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

export const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export async function register(req, res) {
  const { name, email, password, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('Email is already registered');
  }
  const user = await User.create({ name, email, password, phone });
  const token = signToken(user._id);
  res.status(201).json(authResponse(user, token));
}

export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  user.lastLoginAt = new Date();
  await user.save();
  res.json(authResponse(user, signToken(user._id)));
}

export async function me(req, res) {
  res.json(req.user);
}

export async function forgotPassword(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ message: 'If that email exists, a reset link has been sent' });
  const raw = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(raw).digest('hex');
  user.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  await user.save();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${raw}`;
  await sendEmail({ to: user.email, subject: 'Reset your Veloura password', html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>` });
  res.json({ message: 'If that email exists, a reset link has been sent' });
}

export async function resetPassword(req, res) {
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
  if (!user) {
    res.status(400);
    throw new Error('Reset link is invalid or expired');
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(authResponse(user, signToken(user._id)));
}
