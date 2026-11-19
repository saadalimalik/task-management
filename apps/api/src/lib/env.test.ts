import { describe, expect, it } from 'vitest';
import { parseEnv } from './env.js';

const DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';

describe('parseEnv', () => {
    it('applies defaults when only DATABASE_URL is set', () => {
        expect(parseEnv({ DATABASE_URL })).toEqual({
            NODE_ENV: 'development',
            PORT: 3000,
            DATABASE_URL,
            LOG_LEVEL: 'info',
            CORS_ORIGIN: '*',
            RATE_LIMIT_WINDOW_MS: 60_000,
            RATE_LIMIT_MAX: 100,
            TRUST_PROXY: 0,
        });
    });

    it('coerces numeric strings', () => {
        expect(parseEnv({ DATABASE_URL, PORT: '8080' }).PORT).toBe(8080);
    });

    it('throws when DATABASE_URL is missing', () => {
        expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
    });

    it('throws on an unknown NODE_ENV', () => {
        expect(() => parseEnv({ DATABASE_URL, NODE_ENV: 'staging' })).toThrow(/NODE_ENV/);
    });
});
