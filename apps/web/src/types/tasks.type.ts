import type { components, operations } from './api.gen';

type Schemas = components['schemas'];

export type Task = Schemas['Task'];
export type TaskStatus = Schemas['TaskStatus'];
export type TaskPriority = Schemas['TaskPriority'];
export type CreateTaskInput = Schemas['CreateTask'];
export type UpdateTaskInput = Schemas['UpdateTask'];
export type TaskPage = operations['listTasks']['responses']['200']['content']['application/json'];
export type ListTasksParams = NonNullable<operations['listTasks']['parameters']['query']>;
