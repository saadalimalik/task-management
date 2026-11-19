import { apiRequest } from '~/lib/api-client.server';
import type {
    CreateTaskInput,
    ListTasksParams,
    Task,
    TaskPage,
    UpdateTaskInput,
} from '~/types/tasks.type';

const TASKS_PATH = '/api/v1/tasks';

export const fetchTasks = (query: ListTasksParams, clientIp?: string): Promise<TaskPage> =>
    apiRequest<TaskPage>(TASKS_PATH, { query, clientIp });

export const postTask = async (body: CreateTaskInput, clientIp?: string): Promise<Task> =>
    (await apiRequest<{ data: Task }>(TASKS_PATH, { method: 'POST', body, clientIp })).data;

export const patchTask = async (
    id: string,
    body: UpdateTaskInput,
    clientIp?: string,
): Promise<Task> =>
    (await apiRequest<{ data: Task }>(`${TASKS_PATH}/${id}`, { method: 'PATCH', body, clientIp }))
        .data;

export const removeTask = (id: string, clientIp?: string): Promise<void> =>
    apiRequest<void>(`${TASKS_PATH}/${id}`, { method: 'DELETE', clientIp });
