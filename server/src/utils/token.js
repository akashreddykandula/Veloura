import jwt from 'jsonwebtoken';

export function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}
