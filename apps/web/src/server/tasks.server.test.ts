import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest } from '~/lib/api-client.server';
import { buildTask } from '~/test/fixtures';
import { fetchTasks, patchTask, postTask, removeTask } from './tasks.server';

vi.mock('~/lib/api-client.server');

const request = vi.mocked(apiRequest);
const task = buildTask();
const ip = '203.0.113.9';

beforeEach(() => {
    request.mockReset();
});

describe('fetchTasks', () => {
    it('lists tasks with the given query', async () => {
        const page = { data: [task], meta: { total: 1, limit: 20, offset: 0 } };
        request.mockResolvedValue(page);

        await expect(fetchTasks({ status: 'done', limit: 20, offset: 0 }, ip)).resolves.toEqual(
            page,
        );
        expect(request).toHaveBeenCalledWith('/api/v1/tasks', {
            query: { status: 'done', limit: 20, offset: 0 },
            clientIp: ip,
        });
    });
});

describe('postTask', () => {
    it('creates a task and unwraps the response', async () => {
        request.mockResolvedValue({ data: task });

        await expect(postTask({ title: 'Write docs' }, ip)).resolves.toEqual(task);
        expect(request).toHaveBeenCalledWith('/api/v1/tasks', {
            method: 'POST',
            body: { title: 'Write docs' },
            clientIp: ip,
        });
    });
});

describe('patchTask', () => {
    it('updates a task by id and unwraps the response', async () => {
        request.mockResolvedValue({ data: task });

        await expect(patchTask(task.id, { status: 'done' }, ip)).resolves.toEqual(task);
        expect(request).toHaveBeenCalledWith(`/api/v1/tasks/${task.id}`, {
            method: 'PATCH',
            body: { status: 'done' },
            clientIp: ip,
        });
    });
});

describe('removeTask', () => {
    it('deletes a task by id', async () => {
        request.mockResolvedValue(undefined);

        await expect(removeTask(task.id, ip)).resolves.toBeUndefined();
        expect(request).toHaveBeenCalledWith(`/api/v1/tasks/${task.id}`, {
            method: 'DELETE',
            clientIp: ip,
        });
    });
});
