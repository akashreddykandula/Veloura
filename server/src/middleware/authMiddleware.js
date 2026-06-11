import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : req.cookies.token;

  if (!token) {
    res.status(401);
    throw new Error('Authentication required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error('User no longer exists');
    next();
  } catch {
    res.status(401);
    throw new Error('Invalid or expired token');
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('You do not have permission for this action');
  }
  next();
};
