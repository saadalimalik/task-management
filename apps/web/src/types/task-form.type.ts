import type { z } from 'zod';
import type {
    taskFormSchema,
    tasksSearchSchema,
    updateTaskSchema,
} from '~/validators/tasks.validator';

export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>;
export type TasksSearch = z.infer<typeof tasksSearchSchema>;
export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;
