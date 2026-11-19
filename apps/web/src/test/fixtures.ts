import type { Task } from '~/types/tasks.type';

export const buildTask = (overrides: Partial<Task> = {}): Task => ({
    id: '3f2b8c1e-9d4a-4c6b-8f1e-2a7d5b9c0e11',
    title: 'Write docs',
    description: null,
    status: 'todo',
    priority: 'medium',
    dueDate: null,
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
    ...overrides,
});
