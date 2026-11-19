import { createHash, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';

export const CLIENT_IP_HEADER = 'x-client-ip';
export const PROXY_SECRET_HEADER = 'x-proxy-secret';

// Hashing first gives both sides the same length, which timingSafeEqual needs, and the
// constant-time compare keeps the secret from leaking through response timing.
const secretsMatch = (presented: string, expected: string): boolean =>
    timingSafeEqual(
        createHash('sha256').update(presented).digest(),
        createHash('sha256').update(expected).digest(),
    );

type ClientIpInput = {
    // Address of whoever opened the connection. Cannot be forged.
    socketIp: string;
    // Address a trusted server says it is calling on behalf of.
    forwardedIp: unknown;
    presentedSecret: unknown;
    expectedSecret: string | undefined;
};

// A caller may name another address only by proving it holds the shared secret. Anyone else,
// whatever headers they send, is identified by their own connection.
export const resolveClientIp = ({
    socketIp,
    forwardedIp,
    presentedSecret,
    expectedSecret,
}: ClientIpInput): string => {
    if (!expectedSecret || typeof presentedSecret !== 'string') return socketIp;
    if (!secretsMatch(presentedSecret, expectedSecret)) return socketIp;
    if (typeof forwardedIp !== 'string' || isIP(forwardedIp) === 0) return socketIp;
    return forwardedIp;
};
