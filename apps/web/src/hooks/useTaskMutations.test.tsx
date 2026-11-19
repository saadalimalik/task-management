import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import { createTaskFn, deleteTaskFn, updateTaskFn } from '~/server/tasks.functions';
import { buildTask } from '~/test/fixtures';
import type { TaskPage } from '~/types/tasks.type';
import { EMPTY_TASK_FORM } from '~/utils/task.util';
import { useCreateTask, useDeleteTask, useUpdateTask } from './useTaskMutations';

vi.mock('~/server/tasks.functions', () => ({
    createTaskFn: vi.fn(),
    updateTaskFn: vi.fn(),
    deleteTaskFn: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }));

const QUERY_KEY = ['tasks', {}];
const first = buildTask({ id: '11111111-1111-4111-8111-111111111111', title: 'First' });
const second = buildTask({ id: '22222222-2222-4222-8222-222222222222', title: 'Second' });
const page: TaskPage = { data: [first, second], meta: { total: 2, limit: 20, offset: 0 } };

const setup = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });
    queryClient.setQueryData(QUERY_KEY, page);
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const cached = () => queryClient.getQueryData<TaskPage>(QUERY_KEY);
    return { wrapper, cached, invalidate };
};

// A request that stays open until the test settles it, to observe the optimistic state.
const deferred = <T,>() => {
    let resolve!: (value: T) => void;
    let reject!: (error: Error) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('useCreateTask', () => {
    it('creates, confirms with a toast and refreshes the list', async () => {
        vi.mocked(createTaskFn).mockResolvedValue(first);
        const { wrapper, invalidate } = setup();
        const { result } = renderHook(() => useCreateTask(), { wrapper });
        const values = { ...EMPTY_TASK_FORM, title: 'First' };

        act(() => result.current.mutate(values));

        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Task created'));
        expect(createTaskFn).toHaveBeenCalledWith({ data: values });
        expect(invalidate).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    });

    it('reports a failure with the server message', async () => {
        vi.mocked(createTaskFn).mockRejectedValue(new Error('Too many requests.'));
        const { wrapper } = setup();
        const { result } = renderHook(() => useCreateTask(), { wrapper });

        act(() => result.current.mutate(EMPTY_TASK_FORM));

        await waitFor(() =>
            expect(toast.error).toHaveBeenCalledWith('Could not create the task', {
                description: 'Too many requests.',
            }),
        );
    });
});

describe('useUpdateTask', () => {
    it('shows the change before the server answers', async () => {
        const request = deferred<typeof first>();
        vi.mocked(updateTaskFn).mockReturnValue(request.promise as never);
        const { wrapper, cached } = setup();
        const { result } = renderHook(() => useUpdateTask(), { wrapper });

        act(() =>
            result.current.mutate({
                id: first.id,
                values: { status: 'done' },
                successMessage: 'Task done',
            }),
        );

        await waitFor(() => expect(cached()?.data[0]?.status).toBe('done'));
        expect(cached()?.data[1]?.status).toBe('todo');
        expect(toast.success).not.toHaveBeenCalled();

        await act(async () => request.resolve({ ...first, status: 'done' }));
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Task done'));
    });

    it('rolls the change back and reports the error when the server refuses', async () => {
        vi.mocked(updateTaskFn).mockRejectedValue(new Error('That task no longer exists.'));
        const { wrapper, cached } = setup();
        const { result } = renderHook(() => useUpdateTask(), { wrapper });

        act(() => result.current.mutate({ id: first.id, values: { status: 'done' } }));

        await waitFor(() =>
            expect(toast.error).toHaveBeenCalledWith('Could not update the task', {
                description: 'That task no longer exists.',
            }),
        );
        expect(cached()).toEqual(page);
    });
});

describe('useDeleteTask', () => {
    it('removes the task and lowers the total before the server answers', async () => {
        const request = deferred<void>();
        vi.mocked(deleteTaskFn).mockReturnValue(request.promise as never);
        const { wrapper, cached } = setup();
        const { result } = renderHook(() => useDeleteTask(), { wrapper });

        act(() => result.current.mutate(first));

        await waitFor(() => expect(cached()?.data).toEqual([second]));
        expect(cached()?.meta.total).toBe(1);

        await act(async () => request.resolve());
        await waitFor(() => expect(toast.info).toHaveBeenCalledWith('Task deleted'));
        expect(deleteTaskFn).toHaveBeenCalledWith({ data: first.id });
    });

    it('puts the task back when the delete fails', async () => {
        vi.mocked(deleteTaskFn).mockRejectedValue(new Error('Something went wrong on our side.'));
        const { wrapper, cached } = setup();
        const { result } = renderHook(() => useDeleteTask(), { wrapper });

        act(() => result.current.mutate(first));

        await waitFor(() => expect(toast.error).toHaveBeenCalled());
        expect(cached()).toEqual(page);
    });
});
