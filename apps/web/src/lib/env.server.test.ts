import { describe, expect, it } from 'vitest';
import { parseEnv } from './env.server';

describe('parseEnv', () => {
    it('applies local defaults', () => {
        expect(parseEnv({})).toEqual({
            API_URL: 'http://localhost:3000',
            SITE_URL: 'http://localhost:3001',
        });
    });

    it('reads the given URLs', () => {
        expect(parseEnv({ API_URL: 'http://api:3000', SITE_URL: 'https://tasks.example' })).toEqual(
            {
                API_URL: 'http://api:3000',
                SITE_URL: 'https://tasks.example',
            },
        );
    });

    it('throws on a value that is not a URL', () => {
        expect(() => parseEnv({ API_URL: 'not a url' })).toThrow(/API_URL/);
    });

    it('reads the proxy secret, treats an empty one as unset and rejects a short one', () => {
        const secret = 'x'.repeat(32);
        expect(parseEnv({ INTERNAL_PROXY_SECRET: secret }).INTERNAL_PROXY_SECRET).toBe(secret);
        expect(parseEnv({ INTERNAL_PROXY_SECRET: '' }).INTERNAL_PROXY_SECRET).toBeUndefined();
        expect(() => parseEnv({ INTERNAL_PROXY_SECRET: 'short' })).toThrow(/INTERNAL_PROXY_SECRET/);
    });
});
