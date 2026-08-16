import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
export function protect(req, _res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7);
  if (!token) return next(new AppError('Authentication required', 401));
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); } catch { next(new AppError('Invalid or expired token', 401)); }
}
export const authorize = (...roles) => (req, _res, next) => roles.includes(req.user.role) ? next() : next(new AppError('Insufficient permissions', 403));
