import { describe, expect, it } from 'vitest';
import { apiError, toErrorMessage, toUserMessage } from './api-error.util';

describe('apiError', () => {
    it('builds an Error carrying the status', () => {
        const error = apiError(404, 'Gone');
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(404);
        expect(error.message).toBe('Gone');
    });
});

describe('toUserMessage', () => {
    it('passes on the message of a client error', () => {
        expect(toUserMessage(400, 'Invalid request body')).toBe('Invalid request body');
    });

    it('uses fixed wording for rate limits and missing tasks', () => {
        expect(toUserMessage(429, 'whatever')).toBe(
            'Too many requests. Wait a moment and try again.',
        );
        expect(toUserMessage(404, 'Task not found')).toBe('That task no longer exists.');
    });

    it('never passes on a server error message', () => {
        expect(toUserMessage(500, 'db password is hunter2')).toBe(
            'Something went wrong on our side. Try again in a moment.',
        );
    });

    it('falls back when a client error has no usable message', () => {
        expect(toUserMessage(400, { nested: true })).toBe(
            'Something went wrong on our side. Try again in a moment.',
        );
    });
});

describe('toErrorMessage', () => {
    it('uses the message of an Error', () => {
        expect(toErrorMessage(new Error('That task no longer exists.'))).toBe(
            'That task no longer exists.',
        );
    });

    it('hides serialised validation dumps and non-errors', () => {
        expect(toErrorMessage(new Error('[{"code":"too_small"}]'))).toBe(
            'Something went wrong. Try again.',
        );
        expect(toErrorMessage('boom')).toBe('Something went wrong. Try again.');
        expect(toErrorMessage(new Error(''))).toBe('Something went wrong. Try again.');
    });
});
