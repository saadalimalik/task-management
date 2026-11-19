import type { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { env } from '../lib/env.js';
import { httpError } from '../utils/http-error.util.js';

type RateLimiterOptions = { windowMs: number; limit: number };

export const createApiRateLimiter = ({ windowMs, limit }: RateLimiterOptions): RequestHandler =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(httpError(429, 'Too many requests, please try again later'));
    },
  });

// ponytail: in-memory store, per-process counts. Move to a shared store (Redis) when running more than one instance.
export const apiRateLimiter = createApiRateLimiter({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
});
