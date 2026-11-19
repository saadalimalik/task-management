import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { logger } from '../lib/logger.js';
import { httpError } from '../utils/http-error.util.js';
import { errorHandler } from './error.middleware.js';

const req = { method: 'GET', originalUrl: '/api/v1/tasks' } as Request;

const run = (error: unknown, headersSent = false) => {
    const res = { headersSent, status: vi.fn(), json: vi.fn() };
    res.status.mockReturnValue(res);
    const next = vi.fn();
    errorHandler(error, req, res as unknown as Response, next);
    return { res, next };
};

const logError = vi.spyOn(logger, 'error');

beforeEach(() => {
    logError.mockClear();
});

describe('errorHandler', () => {
    it('returns client errors with their message and details, without logging', () => {
        const { res } = run(httpError(400, 'Invalid request body', [{ path: 'title' }]));

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: { message: 'Invalid request body', details: [{ path: 'title' }] },
        });
        expect(logError).not.toHaveBeenCalled();
    });

    it('hides the message of unexpected errors and logs them', () => {
        const { res } = run(new Error('password=hunter2 leaked'));

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: { message: 'Internal server error' } });
        expect(logError).toHaveBeenCalledTimes(1);
    });

    it('hides the message of 5xx http errors', () => {
        const { res } = run(httpError(503, 'db host 10.0.0.5 unreachable'));

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: { message: 'Internal server error' } });
    });

    it('delegates to express when the response already started', () => {
        const error = new Error('late');
        const { res, next } = run(error, true);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    });
});
