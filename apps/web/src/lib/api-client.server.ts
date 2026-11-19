import { env } from '~/lib/env.server';
import { apiError, toUserMessage } from '~/utils/api-error.util';

const TIMEOUT_MS = 10_000;

type ApiRequestOptions = {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    query?: Record<string, string | number | undefined>;
    body?: unknown;
    // Socket address of the browser that made the request, so the API can rate-limit per user.
    clientIp?: string;
};

// The API believes the address only together with the shared secret, so neither header is
// sent unless both are known. Never forward a header the browser supplied.
const proxyHeaders = (clientIp: string | undefined): Record<string, string> =>
    clientIp && env.INTERNAL_PROXY_SECRET
        ? { 'x-client-ip': clientIp, 'x-proxy-secret': env.INTERNAL_PROXY_SECRET }
        : {};

export const apiRequest = async <T>(
    path: string,
    { method = 'GET', query = {}, body, clientIp }: ApiRequestOptions = {},
): Promise<T> => {
    const url = new URL(path, env.API_URL);
    for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
    }

    let response: Response;
    try {
        response = await fetch(url, {
            method,
            headers: {
                accept: 'application/json',
                ...(body === undefined ? {} : { 'content-type': 'application/json' }),
                ...proxyHeaders(clientIp),
            },
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
    } catch {
        throw apiError(503, 'The tasks service is not reachable. Try again in a moment.');
    }

    if (response.status === 204) return undefined as T;

    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
        const message = (payload as { error?: { message?: unknown } } | null)?.error?.message;
        throw apiError(response.status, toUserMessage(response.status, message));
    }
    return payload as T;
};
