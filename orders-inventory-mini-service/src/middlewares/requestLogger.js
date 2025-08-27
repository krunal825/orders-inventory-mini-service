import { logger } from '../utils/logger.js';


// Logging Middelware
export function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const latencyMs = Number(end - start) / 1e6;

    logger.info({
      msg: 'Request',
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      latency_ms: Math.round(latencyMs)
    });
  });

  next();
}
