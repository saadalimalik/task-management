import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { listTasksFn } from '~/server/tasks.functions';
import type { TasksSearch } from '~/types/task-form.type';

export const TASKS_QUERY_KEY = ['tasks'] as const;

export const tasksQueryOptions = (search: TasksSearch) =>
    queryOptions({
        queryKey: [...TASKS_QUERY_KEY, search] as const,
        queryFn: () => listTasksFn({ data: search }),
    });

export const useTasks = (search: TasksSearch) => useSuspenseQuery(tasksQueryOptions(search));
