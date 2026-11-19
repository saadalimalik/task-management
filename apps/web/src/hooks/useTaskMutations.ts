import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TASKS_QUERY_KEY } from '~/hooks/useTasks';
import { createTaskFn, deleteTaskFn, updateTaskFn } from '~/server/tasks.functions';
import type { TaskFormValues } from '~/types/task-form.type';
import type { Task, TaskPage } from '~/types/tasks.type';
import { toErrorMessage } from '~/utils/api-error.util';
import { toUpdatePayload } from '~/utils/task.util';

type Snapshot = [QueryKey, TaskPage | undefined][];

type UpdateTaskVariables = {
    id: string;
    values: Partial<TaskFormValues>;
    successMessage?: string;
};

// Applies a change to every cached page right away and returns what was there, for rollback.
const applyOptimistic = async (
    queryClient: QueryClient,
    change: (page: TaskPage) => TaskPage,
): Promise<Snapshot> => {
    await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
    const snapshot = queryClient.getQueriesData<TaskPage>({ queryKey: TASKS_QUERY_KEY });
    queryClient.setQueriesData<TaskPage>({ queryKey: TASKS_QUERY_KEY }, (page) =>
        page ? change(page) : page,
    );
    return snapshot;
};

const rollBack = (queryClient: QueryClient, snapshot: Snapshot | undefined) => {
    for (const [queryKey, page] of snapshot ?? []) queryClient.setQueryData(queryKey, page);
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: TaskFormValues) => createTaskFn({ data: values }),
        onSuccess: () => toast.success('Task created'),
        onError: (error) =>
            toast.error('Could not create the task', { description: toErrorMessage(error) }),
        onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, values }: UpdateTaskVariables) => updateTaskFn({ data: { id, values } }),
        onMutate: ({ id, values }) =>
            applyOptimistic(queryClient, (page) => ({
                ...page,
                data: page.data.map((task) =>
                    task.id === id ? { ...task, ...toUpdatePayload(values) } : task,
                ),
            })),
        onSuccess: (_task, { successMessage = 'Task updated' }) => toast.success(successMessage),
        onError: (error, _variables, snapshot) => {
            rollBack(queryClient, snapshot);
            toast.error('Could not update the task', { description: toErrorMessage(error) });
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (task: Task) => deleteTaskFn({ data: task.id }),
        onMutate: (task) =>
            applyOptimistic(queryClient, (page) => {
                const data = page.data.filter((cached) => cached.id !== task.id);
                const removed = page.data.length - data.length;
                return { data, meta: { ...page.meta, total: page.meta.total - removed } };
            }),
        onSuccess: () => toast.info('Task deleted'),
        onError: (error, _task, snapshot) => {
            rollBack(queryClient, snapshot);
            toast.error('Could not delete the task', { description: toErrorMessage(error) });
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
    });
};
