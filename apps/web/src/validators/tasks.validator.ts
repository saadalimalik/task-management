import { z } from 'zod';

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;

export const taskStatusSchema = z.enum(TASK_STATUSES);
export const taskPrioritySchema = z.enum(TASK_PRIORITIES);

// URL search params come from anywhere, so bad values fall back instead of failing the page.
export const tasksSearchSchema = z.object({
    status: taskStatusSchema.optional().catch(undefined),
    priority: taskPrioritySchema.optional().catch(undefined),
    page: z.coerce.number().int().min(1).max(10_000).optional().catch(undefined),
});

export const taskFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Enter a title')
        .max(200, 'Keep the title to 200 characters or fewer'),
    description: z.string().trim().max(2000, 'Keep the description to 2000 characters or fewer'),
    status: taskStatusSchema,
    priority: taskPrioritySchema,
    dueDate: z.union([z.literal(''), z.iso.date('Enter a valid date')]),
});

export const taskIdSchema = z.uuid();

export const updateTaskSchema = z.object({
    id: taskIdSchema,
    values: taskFormSchema.partial().refine((values) => Object.keys(values).length > 0, {
        message: 'Change at least one field',
    }),
});
