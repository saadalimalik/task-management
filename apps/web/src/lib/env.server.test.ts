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
});
