import { logger } from '../utils/logger.js';

export const errorHandler = (err, _req, res, _next) => {
  logger.error(err.message, err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Unexpected server error',
    details: err.details || undefined,
  });
};
