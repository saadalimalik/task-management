import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { errorHandler } from '../middlewares/error.middleware.js';
import { createApiRateLimiter } from './api.rate-limiter.js';

const secret = 's'.repeat(48);

const buildApp = (proxySecret?: string) =>
    express()
        .use(createApiRateLimiter({ windowMs: 60_000, limit: 2, proxySecret }))
        .get('/', (_req, res) => {
            res.json({ ok: true });
        })
        .use(errorHandler);

const statuses = async (app: express.Express, headers: Record<string, string>, count: number) => {
    const results = [];
    for (let i = 0; i < count; i++) results.push((await request(app).get('/').set(headers)).status);
    return results;
};

describe('createApiRateLimiter', () => {
    it('allows requests up to the limit, then responds 429', async () => {
        const app = buildApp();

        expect(await statuses(app, {}, 3)).toEqual([200, 200, 429]);
        const blocked = await request(app).get('/');

        expect(blocked.body).toEqual({
            error: { message: 'Too many requests, please try again later' },
        });
        expect(blocked.headers['ratelimit']).toBeDefined();
    });

    it('counts each end user separately when the caller proves the shared secret', async () => {
        const app = buildApp(secret);
        const forUser = (ip: string) => ({ 'x-client-ip': ip, 'x-proxy-secret': secret });

        expect(await statuses(app, forUser('203.0.113.1'), 3)).toEqual([200, 200, 429]);
        expect(await statuses(app, forUser('203.0.113.2'), 2)).toEqual([200, 200]);
    });

    it('cannot be dodged by forging the client address without the secret', async () => {
        const app = buildApp(secret);

        const forged = [];
        for (const ip of ['198.51.100.1', '198.51.100.2', '198.51.100.3']) {
            forged.push(...(await statuses(app, { 'x-client-ip': ip, 'x-forwarded-for': ip }, 1)));
        }

        expect(forged).toEqual([200, 200, 429]);
    });

    it('cannot be dodged with a wrong secret', async () => {
        const app = buildApp(secret);

        const forged = [];
        for (const ip of ['198.51.100.1', '198.51.100.2', '198.51.100.3']) {
            forged.push(
                ...(await statuses(app, { 'x-client-ip': ip, 'x-proxy-secret': 'guess' }, 1)),
            );
        }

        expect(forged).toEqual([200, 200, 429]);
    });
});
