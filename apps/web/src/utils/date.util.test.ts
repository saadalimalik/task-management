import { describe, expect, it } from 'vitest';
import { formatDueDate, isOverdue, toDateInputValue, toDueDateTime } from './date.util';

describe('toDateInputValue', () => {
    it('takes the calendar day from an ISO date-time', () => {
        expect(toDateInputValue('2026-12-01T00:00:00.000Z')).toBe('2026-12-01');
    });

    it('is empty for no date', () => {
        expect(toDateInputValue(null)).toBe('');
    });
});

describe('toDueDateTime', () => {
    it('stores the day as UTC midnight', () => {
        expect(toDueDateTime('2026-12-01')).toBe('2026-12-01T00:00:00.000Z');
    });
});

describe('formatDueDate', () => {
    it('shows the stored day whatever the local time zone', () => {
        expect(formatDueDate('2026-12-01T00:00:00.000Z')).toBe('Dec 1, 2026');
        expect(formatDueDate('2026-01-31T00:00:00.000Z')).toBe('Jan 31, 2026');
    });
});

describe('isOverdue', () => {
    const now = new Date('2026-11-19T15:30:00.000Z');

    it('is true only for days before today', () => {
        expect(isOverdue('2026-11-18T00:00:00.000Z', now)).toBe(true);
        expect(isOverdue('2026-11-19T00:00:00.000Z', now)).toBe(false);
        expect(isOverdue('2026-11-20T00:00:00.000Z', now)).toBe(false);
    });

    it('is false without a due date', () => {
        expect(isOverdue(null, now)).toBe(false);
    });
});
