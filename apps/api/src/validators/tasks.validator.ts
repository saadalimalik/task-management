import { z } from 'zod';
import { validateRequest } from './request.validator.js';

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'done']);
export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);

const titleSchema = z.string().trim().min(1).max(200);
const descriptionSchema = z.string().trim().max(2000);
const dueDateSchema = z.iso.datetime({ offset: true });

export const createTaskSchema = z.strictObject({
    title: titleSchema,
    description: descriptionSchema.optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    dueDate: dueDateSchema.optional(),
});

export const updateTaskSchema = z
    .strictObject({
        title: titleSchema,
        description: descriptionSchema.nullable(),
        status: taskStatusSchema,
        priority: taskPrioritySchema,
        dueDate: dueDateSchema.nullable(),
    })
    .partial()
    .refine((fields) => Object.keys(fields).length > 0, {
        message: 'At least one field is required',
    });

export const taskIdParamsSchema = z.strictObject({
    id: z.uuid(),
});

export const listTasksQuerySchema = z.strictObject({
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
});

export const validateListTasks = validateRequest({ query: listTasksQuerySchema });
export const validateCreateTask = validateRequest({ body: createTaskSchema });
export const validateGetTask = validateRequest({ params: taskIdParamsSchema });
export const validateUpdateTask = validateRequest({
    params: taskIdParamsSchema,
    body: updateTaskSchema,
});
export const validateDeleteTask = validateRequest({ params: taskIdParamsSchema });
