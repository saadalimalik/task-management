import { describe, expect, it } from 'vitest';
import {
    createTaskSchema,
    listTasksQuerySchema,
    taskIdParamsSchema,
    updateTaskSchema,
} from './tasks.validator.js';

describe('createTaskSchema', () => {
    it('accepts a full task and trims text', () => {
        expect(
            createTaskSchema.parse({
                title: '  Write docs  ',
                description: ' details ',
                status: 'in_progress',
                priority: 'high',
                dueDate: '2026-12-01T10:00:00+05:00',
            }),
        ).toEqual({
            title: 'Write docs',
            description: 'details',
            status: 'in_progress',
            priority: 'high',
            dueDate: '2026-12-01T10:00:00+05:00',
        });
    });

    it('requires only a title', () => {
        expect(createTaskSchema.parse({ title: 'Ship' })).toEqual({ title: 'Ship' });
    });

    it.each([
        ['missing title', {}],
        ['blank title', { title: '   ' }],
        ['title over 200 chars', { title: 'x'.repeat(201) }],
        ['unknown status', { title: 'a', status: 'blocked' }],
        ['unknown priority', { title: 'a', priority: 'urgent' }],
        ['non-ISO due date', { title: 'a', dueDate: 'tomorrow' }],
        ['unknown field', { title: 'a', owner: 'me' }],
    ])('rejects %s', (_name, input) => {
        expect(createTaskSchema.safeParse(input).success).toBe(false);
    });
});

describe('updateTaskSchema', () => {
    it('accepts a partial update and nulls for clearable fields', () => {
        expect(
            updateTaskSchema.parse({ status: 'done', description: null, dueDate: null }),
        ).toEqual({
            status: 'done',
            description: null,
            dueDate: null,
        });
    });

    it('rejects an empty update', () => {
        expect(updateTaskSchema.safeParse({}).success).toBe(false);
    });

    it('rejects a null title', () => {
        expect(updateTaskSchema.safeParse({ title: null }).success).toBe(false);
    });
});

describe('taskIdParamsSchema', () => {
    it('accepts a uuid and rejects anything else', () => {
        expect(
            taskIdParamsSchema.safeParse({ id: '3f2b8c1e-9d4a-4c6b-8f1e-2a7d5b9c0e11' }).success,
        ).toBe(true);
        expect(taskIdParamsSchema.safeParse({ id: '42' }).success).toBe(false);
    });
});

describe('listTasksQuerySchema', () => {
    it('applies pagination defaults', () => {
        expect(listTasksQuerySchema.parse({})).toEqual({ limit: 20, offset: 0 });
    });

    it('coerces query strings and keeps filters', () => {
        expect(
            listTasksQuerySchema.parse({
                status: 'todo',
                priority: 'low',
                limit: '5',
                offset: '10',
            }),
        ).toEqual({ status: 'todo', priority: 'low', limit: 5, offset: 10 });
    });

    it.each([{ limit: '0' }, { limit: '101' }, { offset: '-1' }, { limit: 'abc' }])(
        'rejects %o',
        (query) => {
            expect(listTasksQuerySchema.safeParse(query).success).toBe(false);
        },
    );
});
