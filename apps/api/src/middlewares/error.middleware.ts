import type { ErrorRequestHandler } from 'express';
import { logger } from '../lib/logger.js';
import { isHttpError } from '../utils/http-error.util.js';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (isHttpError(error) && error.status < 500) {
    res.status(error.status).json({
      error: {
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details }),
      },
    });
    return;
  }

  logger.error(error instanceof Error ? error.message : String(error), {
    stack: error instanceof Error ? error.stack : undefined,
    method: req.method,
    path: req.originalUrl,
  });
  res.status(500).json({ error: { message: 'Internal server error' } });
};
