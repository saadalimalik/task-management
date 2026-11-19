import type { RequestHandler } from 'express';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import { env } from '../lib/env.js';
import { CLIENT_IP_HEADER, PROXY_SECRET_HEADER, resolveClientIp } from '../utils/client-ip.util.js';
import { httpError } from '../utils/http-error.util.js';

type RateLimiterOptions = {
    windowMs: number;
    limit: number;
    // Lets a trusted server (the web app) say which end user it is calling for.
    proxySecret?: string;
};

export const createApiRateLimiter = ({
    windowMs,
    limit,
    proxySecret,
}: RateLimiterOptions): RequestHandler =>
    rateLimit({
        windowMs,
        limit,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        keyGenerator: (req) =>
            ipKeyGenerator(
                resolveClientIp({
                    socketIp: req.ip ?? '',
                    forwardedIp: req.headers[CLIENT_IP_HEADER],
                    presentedSecret: req.headers[PROXY_SECRET_HEADER],
                    expectedSecret: proxySecret,
                }),
            ),
        handler: (_req, _res, next) => {
            next(httpError(429, 'Too many requests, please try again later'));
        },
    });

// ponytail: in-memory store, per-process counts. Move to a shared store (Redis) when running more than one instance.
export const apiRateLimiter = createApiRateLimiter({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX,
    proxySecret: env.INTERNAL_PROXY_SECRET,
});
