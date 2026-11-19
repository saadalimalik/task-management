import { describe, expect, it } from 'vitest';
import { resolveClientIp } from './client-ip.util.js';

const secret = 'a'.repeat(48);
const base = { socketIp: '10.0.0.5', expectedSecret: secret };

describe('resolveClientIp', () => {
    it('accepts the forwarded address from a caller that holds the secret', () => {
        expect(
            resolveClientIp({ ...base, forwardedIp: '203.0.113.9', presentedSecret: secret }),
        ).toBe('203.0.113.9');
        expect(
            resolveClientIp({ ...base, forwardedIp: '2001:db8::1', presentedSecret: secret }),
        ).toBe('2001:db8::1');
    });

    it('ignores a forwarded address sent without the secret', () => {
        expect(
            resolveClientIp({ ...base, forwardedIp: '203.0.113.9', presentedSecret: undefined }),
        ).toBe('10.0.0.5');
    });

    it('ignores a forwarded address sent with a wrong secret of any length', () => {
        for (const presentedSecret of ['b'.repeat(48), 'short', secret + 'x', '']) {
            expect(resolveClientIp({ ...base, forwardedIp: '203.0.113.9', presentedSecret })).toBe(
                '10.0.0.5',
            );
        }
    });

    it('never trusts a forwarded address when no secret is configured', () => {
        expect(
            resolveClientIp({
                socketIp: '10.0.0.5',
                forwardedIp: '203.0.113.9',
                presentedSecret: '',
                expectedSecret: undefined,
            }),
        ).toBe('10.0.0.5');
    });

    it('falls back to the connection when the forwarded value is not an IP address', () => {
        for (const forwardedIp of ['not-an-ip', '1.2.3.4, 5.6.7.8', '', undefined, ['1.2.3.4']]) {
            expect(resolveClientIp({ ...base, forwardedIp, presentedSecret: secret })).toBe(
                '10.0.0.5',
            );
        }
    });

    it('does not accept a repeated secret header', () => {
        expect(
            resolveClientIp({
                ...base,
                forwardedIp: '203.0.113.9',
                presentedSecret: [secret, secret],
            }),
        ).toBe('10.0.0.5');
    });
});
