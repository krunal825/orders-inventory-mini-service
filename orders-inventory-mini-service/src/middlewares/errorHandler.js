import { logger } from '../utils/logger.js';


// Error Handling Middleware
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Something went wrong';

  logger.error({
    msg: 'Request failed',
    code,
    status,
    path: req.path,
    method: req.method,
    error: message
  });

  res.status(status).json({ code, message, details: err.details });
}
