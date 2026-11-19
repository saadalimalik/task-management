import { describe, expect, it, vi } from 'vitest';
import { listTasksFn } from '~/server/tasks.functions';
import { tasksQueryOptions } from './useTasks';

vi.mock('~/server/tasks.functions', () => ({ listTasksFn: vi.fn() }));

describe('tasksQueryOptions', () => {
    it('keys the cache by the search', () => {
        expect(tasksQueryOptions({ status: 'done', page: 2 }).queryKey).toEqual([
            'tasks',
            { status: 'done', page: 2 },
        ]);
    });

    it('fetches with the same search', async () => {
        const page = { data: [], meta: { total: 0, limit: 20, offset: 0 } };
        vi.mocked(listTasksFn).mockResolvedValue(page);
        const options = tasksQueryOptions({ priority: 'high' });

        await expect(options.queryFn!({} as never)).resolves.toEqual(page);
        expect(listTasksFn).toHaveBeenCalledWith({ data: { priority: 'high' } });
    });
});
