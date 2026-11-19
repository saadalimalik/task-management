import { describe, expect, it } from 'vitest';
import {
    taskFormSchema,
    taskIdSchema,
    tasksSearchSchema,
    updateTaskSchema,
} from './tasks.validator';

const validForm = {
    title: '  Write docs  ',
    description: ' details ',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-12-01',
};

describe('taskFormSchema', () => {
    it('accepts a full form and trims text', () => {
        expect(taskFormSchema.parse(validForm)).toEqual({
            title: 'Write docs',
            description: 'details',
            status: 'todo',
            priority: 'high',
            dueDate: '2026-12-01',
        });
    });

    it('allows an empty description and due date', () => {
        const result = taskFormSchema.parse({ ...validForm, description: '', dueDate: '' });
        expect(result.description).toBe('');
        expect(result.dueDate).toBe('');
    });

    it.each([
        ['blank title', { title: '   ' }, 'Enter a title'],
        ['long title', { title: 'x'.repeat(201) }, 'Keep the title to 200 characters or fewer'],
        [
            'long description',
            { description: 'x'.repeat(2001) },
            'Keep the description to 2000 characters or fewer',
        ],
        ['impossible date', { dueDate: '2026-02-31' }, 'Enter a valid date'],
    ])('rejects a %s with a readable message', (_name, patch, message) => {
        const result = taskFormSchema.safeParse({ ...validForm, ...patch });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toBe(message);
    });

    it('rejects unknown status and priority values', () => {
        expect(taskFormSchema.safeParse({ ...validForm, status: 'blocked' }).success).toBe(false);
        expect(taskFormSchema.safeParse({ ...validForm, priority: 'urgent' }).success).toBe(false);
    });
});

describe('tasksSearchSchema', () => {
    it('keeps valid filters and coerces the page', () => {
        expect(tasksSearchSchema.parse({ status: 'done', priority: 'low', page: '3' })).toEqual({
            status: 'done',
            priority: 'low',
            page: 3,
        });
    });

    it('drops tampered values instead of failing', () => {
        expect(
            tasksSearchSchema.parse({ status: '<script>', priority: ['low', 'high'], page: '-4' }),
        ).toEqual({ status: undefined, priority: undefined, page: undefined });
    });

    it('accepts an empty search', () => {
        expect(tasksSearchSchema.parse({})).toEqual({});
    });
});

describe('taskIdSchema', () => {
    it('accepts only a uuid', () => {
        expect(taskIdSchema.safeParse('3f2b8c1e-9d4a-4c6b-8f1e-2a7d5b9c0e11').success).toBe(true);
        expect(taskIdSchema.safeParse('../admin').success).toBe(false);
    });
});

describe('updateTaskSchema', () => {
    const id = '3f2b8c1e-9d4a-4c6b-8f1e-2a7d5b9c0e11';

    it('accepts a single changed field', () => {
        expect(updateTaskSchema.parse({ id, values: { status: 'done' } })).toEqual({
            id,
            values: { status: 'done' },
        });
    });

    it('rejects an update with no fields or a bad id', () => {
        expect(updateTaskSchema.safeParse({ id, values: {} }).success).toBe(false);
        expect(updateTaskSchema.safeParse({ id: '42', values: { status: 'done' } }).success).toBe(
            false,
        );
    });
});
