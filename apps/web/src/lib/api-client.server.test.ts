import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest } from './api-client.server';

const fetchMock = vi.fn<typeof fetch>();

const jsonResponse = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
});

describe('apiRequest', () => {
    it('calls the API with query parameters and returns the body', async () => {
        fetchMock.mockResolvedValue(jsonResponse(200, { data: [] }));

        const result = await apiRequest('/api/v1/tasks', {
            query: { status: 'done', priority: undefined, limit: 20 },
        });

        expect(result).toEqual({ data: [] });
        const [url, init] = fetchMock.mock.calls[0]!;
        expect(String(url)).toBe('http://api.test/api/v1/tasks?status=done&limit=20');
        expect(init).toMatchObject({ method: 'GET', headers: { accept: 'application/json' } });
    });

    it('sends a JSON body and forwards the client address', async () => {
        fetchMock.mockResolvedValue(jsonResponse(201, { data: { id: '1' } }));

        await apiRequest('/api/v1/tasks', {
            method: 'POST',
            body: { title: 'Write docs' },
            clientIp: '203.0.113.9',
        });

        expect(fetchMock.mock.calls[0]![1]).toMatchObject({
            method: 'POST',
            body: '{"title":"Write docs"}',
            headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.9' },
        });
    });

    it('returns undefined for 204', async () => {
        fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

        await expect(apiRequest('/api/v1/tasks/1', { method: 'DELETE' })).resolves.toBeUndefined();
    });

    it('throws the API message for a client error', async () => {
        fetchMock.mockResolvedValue(
            jsonResponse(400, { error: { message: 'Invalid request body' } }),
        );

        await expect(apiRequest('/api/v1/tasks')).rejects.toMatchObject({
            status: 400,
            message: 'Invalid request body',
        });
    });

    it('hides the message of a server error', async () => {
        fetchMock.mockResolvedValue(jsonResponse(500, { error: { message: 'stack trace here' } }));

        await expect(apiRequest('/api/v1/tasks')).rejects.toMatchObject({
            status: 500,
            message: 'Something went wrong on our side. Try again in a moment.',
        });
    });

    it('copes with an error response that is not JSON', async () => {
        fetchMock.mockResolvedValue(new Response('<html>Bad gateway</html>', { status: 502 }));

        await expect(apiRequest('/api/v1/tasks')).rejects.toMatchObject({ status: 502 });
    });

    it('reports an unreachable API as 503', async () => {
        fetchMock.mockRejectedValue(new TypeError('fetch failed'));

        await expect(apiRequest('/api/v1/tasks')).rejects.toMatchObject({
            status: 503,
            message: 'The tasks service is not reachable. Try again in a moment.',
        });
    });
});
