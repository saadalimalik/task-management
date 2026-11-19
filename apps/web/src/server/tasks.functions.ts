import { createServerFn } from '@tanstack/react-start';
import { getRequestIP } from '@tanstack/react-start/server';
import { fetchTasks, patchTask, postTask, removeTask } from '~/server/tasks.server';
import { toCreatePayload, toListParams, toUpdatePayload } from '~/utils/task.util';
import {
    taskFormSchema,
    taskIdSchema,
    tasksSearchSchema,
    updateTaskSchema,
} from '~/validators/tasks.validator';

// The socket address, never the X-Forwarded-For header: the browser controls that header and
// could forge an address per request to dodge the API's rate limiter.
// ponytail: behind a reverse proxy every user shares the proxy's address. Read the address
// from the proxy's own header then, and only when the request comes from that proxy.
const clientIp = () => getRequestIP();

export const listTasksFn = createServerFn({ method: 'GET' })
    .validator(tasksSearchSchema)
    .handler(({ data }) => fetchTasks(toListParams(data), clientIp()));

export const createTaskFn = createServerFn({ method: 'POST' })
    .validator(taskFormSchema)
    .handler(({ data }) => postTask(toCreatePayload(data), clientIp()));

export const updateTaskFn = createServerFn({ method: 'POST' })
    .validator(updateTaskSchema)
    .handler(({ data }) => patchTask(data.id, toUpdatePayload(data.values), clientIp()));

export const deleteTaskFn = createServerFn({ method: 'POST' })
    .validator(taskIdSchema)
    .handler(({ data }) => removeTask(data, clientIp()));
