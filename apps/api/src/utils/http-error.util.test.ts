import { describe, expect, it } from 'vitest';
import { httpError, isHttpError } from './http-error.util.js';

describe('httpError', () => {
    it('builds an Error carrying status and message', () => {
        const error = httpError(404, 'Task not found');
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(404);
        expect(error.message).toBe('Task not found');
        expect('details' in error).toBe(false);
    });

    it('attaches details when given', () => {
        expect(httpError(400, 'Bad', [{ path: 'title' }]).details).toEqual([{ path: 'title' }]);
    });
});

describe('isHttpError', () => {
    it('accepts errors with a 4xx/5xx status', () => {
        expect(isHttpError(httpError(429, 'Slow down'))).toBe(true);
    });

    it('rejects plain errors, out-of-range statuses and non-errors', () => {
        expect(isHttpError(new Error('boom'))).toBe(false);
        expect(isHttpError(Object.assign(new Error('odd'), { status: 200 }))).toBe(false);
        expect(isHttpError({ status: 404 })).toBe(false);
    });
});
