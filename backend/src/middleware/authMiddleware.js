import { firebaseAdmin } from '../config/firebaseAdmin.js';
import { User } from '../models/User.js';

export const attachUser = async (req, _res, next) => {
  const authHeader = req.headers.authorization || req.cookies.token;

  if (!authHeader || !firebaseAdmin?.apps?.length) {
    return next();
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '')
    : authHeader;

  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(token);
    req.firebaseUser = decoded;

    const dbUser = await User.findOne({ firebaseUid: decoded.uid });
    if (dbUser) {
      req.user = dbUser;
    }
  } catch (error) {
    console.error('Failed to decode token', error);
  }

  next();
};

export const requireAuth = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (roles.length && !roles.some((role) => req.user.roles.includes(role))) {
      return res.status(403).json({ message: 'Insufficient privileges' });
    }

    next();
  };
};
