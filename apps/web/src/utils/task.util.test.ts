import { describe, expect, it } from 'vitest';
import { buildTask } from '~/test/fixtures';
import {
    isFiltered,
    pageCount,
    taskCountLabel,
    toCreatePayload,
    toFormValues,
    toListParams,
    toUpdatePayload,
} from './task.util';

const values = {
    title: 'Write docs',
    description: 'Details',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-12-01',
} as const;

describe('toFormValues', () => {
    it('maps a task to form values', () => {
        expect(
            toFormValues(
                buildTask({
                    description: 'Details',
                    dueDate: '2026-12-01T00:00:00.000Z',
                    status: 'done',
                }),
            ),
        ).toEqual({
            title: 'Write docs',
            description: 'Details',
            status: 'done',
            priority: 'medium',
            dueDate: '2026-12-01',
        });
    });

    it('turns nulls into empty strings', () => {
        expect(toFormValues(buildTask())).toMatchObject({ description: '', dueDate: '' });
    });
});

describe('toCreatePayload', () => {
    it('sends every filled field', () => {
        expect(toCreatePayload(values)).toEqual({
            title: 'Write docs',
            description: 'Details',
            status: 'in_progress',
            priority: 'high',
            dueDate: '2026-12-01T00:00:00.000Z',
        });
    });

    it('leaves out an empty description and due date', () => {
        expect(toCreatePayload({ ...values, description: '', dueDate: '' })).toEqual({
            title: 'Write docs',
            status: 'in_progress',
            priority: 'high',
        });
    });
});

describe('toUpdatePayload', () => {
    it('sends only the fields given', () => {
        expect(toUpdatePayload({ status: 'done' })).toEqual({ status: 'done' });
    });

    it('clears an emptied description and due date with null', () => {
        expect(toUpdatePayload({ description: '', dueDate: '' })).toEqual({
            description: null,
            dueDate: null,
        });
    });

    it('converts a due date to a date-time', () => {
        expect(toUpdatePayload({ dueDate: '2026-12-01' })).toEqual({
            dueDate: '2026-12-01T00:00:00.000Z',
        });
    });
});

describe('toListParams', () => {
    it('defaults to the first page', () => {
        expect(toListParams({})).toEqual({
            status: undefined,
            priority: undefined,
            limit: 20,
            offset: 0,
        });
    });

    it('turns a page number into an offset and keeps filters', () => {
        expect(toListParams({ status: 'done', priority: 'low', page: 3 })).toEqual({
            status: 'done',
            priority: 'low',
            limit: 20,
            offset: 40,
        });
    });
});

describe('pageCount', () => {
    it.each([
        [0, 1],
        [20, 1],
        [21, 2],
        [100, 5],
    ])('%i tasks make %i page(s)', (total, pages) => {
        expect(pageCount(total)).toBe(pages);
    });
});

describe('taskCountLabel', () => {
    it('counts tasks with the right plural', () => {
        expect(taskCountLabel(0, false)).toBe('0 tasks');
        expect(taskCountLabel(1, false)).toBe('1 task');
        expect(taskCountLabel(12, false)).toBe('12 tasks');
    });

    it('says when filters are applied', () => {
        expect(taskCountLabel(1, true)).toBe('1 task matches these filters');
        expect(taskCountLabel(3, true)).toBe('3 tasks match these filters');
    });
});

describe('isFiltered', () => {
    it('is true when a status or priority is set, and ignores the page', () => {
        expect(isFiltered({})).toBe(false);
        expect(isFiltered({ page: 2 })).toBe(false);
        expect(isFiltered({ status: 'todo' })).toBe(true);
        expect(isFiltered({ priority: 'high' })).toBe(true);
    });
});
