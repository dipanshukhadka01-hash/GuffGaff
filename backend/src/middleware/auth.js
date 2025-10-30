import createError from 'http-errors';
import User from '../models/User.js';
import { verifyAccessToken } from '../utils/token.js';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return next(createError(401, 'Authentication required.'));
    }

    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return next(createError(401, 'Invalid authentication header.'));
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub);
    if (!user) {
      return next(createError(401, 'User not found.'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError(401, 'Invalid or expired token.'));
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user.roles?.includes('admin')) {
    return next(createError(403, 'Administrator privileges required.'));
  }
  next();
};
