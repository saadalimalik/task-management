import { env } from '~/lib/env.server';
import { apiError, toUserMessage } from '~/utils/api-error.util';

const TIMEOUT_MS = 10_000;

type ApiRequestOptions = {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    query?: Record<string, string | number | undefined>;
    body?: unknown;
    // Address of the browser that made the request, so the API can rate-limit per user.
    clientIp?: string;
};

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
                ...(clientIp ? { 'x-forwarded-for': clientIp } : {}),
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
