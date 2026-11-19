import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { notFound } from './not-found.middleware.js';

describe('notFound', () => {
    it('forwards a 404 naming the method and path', () => {
        const next = vi.fn();

        notFound({ method: 'GET', path: '/nope' } as Request, {} as Response, next);

        expect(next.mock.calls[0]?.[0]).toMatchObject({
            status: 404,
            message: 'Route GET /nope not found',
        });
    });
});
