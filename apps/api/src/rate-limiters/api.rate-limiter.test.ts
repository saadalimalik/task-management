import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { errorHandler } from '../middlewares/error.middleware.js';
import { createApiRateLimiter } from './api.rate-limiter.js';

describe('createApiRateLimiter', () => {
  it('allows requests up to the limit, then responds 429', async () => {
    const app = express()
      .use(createApiRateLimiter({ windowMs: 60_000, limit: 2 }))
      .get('/', (_req, res) => {
        res.json({ ok: true });
      })
      .use(errorHandler);

    const statuses = [];
    for (let i = 0; i < 3; i++) statuses.push((await request(app).get('/')).status);
    const blocked = await request(app).get('/');

    expect(statuses).toEqual([200, 200, 429]);
    expect(blocked.body).toEqual({
      error: { message: 'Too many requests, please try again later' },
    });
    expect(blocked.headers['ratelimit']).toBeDefined();
  });
});
