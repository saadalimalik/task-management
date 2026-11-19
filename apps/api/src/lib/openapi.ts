import { z } from 'zod';
import {
  createTaskSchema,
  taskPrioritySchema,
  taskStatusSchema,
  updateTaskSchema,
} from '../validators/tasks.validator.js';

const taskSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  dueDate: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const errorSchema = z.object({
  error: z.object({
    message: z.string(),
    details: z.array(z.object({ path: z.string(), message: z.string() })).optional(),
  }),
});

const toSchema = (schema: z.ZodType) => {
  const { $schema: _dialect, ...jsonSchema } = z.toJSONSchema(schema, { io: 'input' });
  return jsonSchema;
};

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const jsonContent = (schema: object) => ({ 'application/json': { schema } });
const errorResponse = (description: string) => ({
  description,
  content: jsonContent(ref('Error')),
});
const taskResponse = (description: string) => ({
  description,
  content: jsonContent({
    type: 'object',
    required: ['data'],
    properties: { data: ref('Task') },
  }),
});

const taskIdParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string', format: 'uuid' },
};

const commonErrors = {
  '429': errorResponse('Rate limit exceeded'),
  '500': errorResponse('Unexpected server error'),
};

export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Task Management API',
    version: '1.0.0',
    description: 'REST API for managing tasks.',
  },
  servers: [{ url: '/' }],
  tags: [{ name: 'Tasks' }, { name: 'Health' }],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        operationId: 'getHealth',
        summary: 'Liveness check',
        responses: {
          '200': {
            description: 'Service is up',
            content: jsonContent({
              type: 'object',
              required: ['status', 'uptime'],
              properties: { status: { type: 'string' }, uptime: { type: 'number' } },
            }),
          },
        },
      },
    },
    '/api/v1/tasks': {
      get: {
        tags: ['Tasks'],
        operationId: 'listTasks',
        summary: 'List tasks, newest first',
        parameters: [
          { name: 'status', in: 'query', schema: ref('TaskStatus') },
          { name: 'priority', in: 'query', schema: ref('TaskPriority') },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
          { name: 'offset', in: 'query', schema: { type: 'integer', minimum: 0, default: 0 } },
        ],
        responses: {
          '200': {
            description: 'A page of tasks',
            content: jsonContent({
              type: 'object',
              required: ['data', 'meta'],
              properties: {
                data: { type: 'array', items: ref('Task') },
                meta: {
                  type: 'object',
                  required: ['total', 'limit', 'offset'],
                  properties: {
                    total: { type: 'integer' },
                    limit: { type: 'integer' },
                    offset: { type: 'integer' },
                  },
                },
              },
            }),
          },
          '400': errorResponse('Invalid query parameters'),
          ...commonErrors,
        },
      },
      post: {
        tags: ['Tasks'],
        operationId: 'createTask',
        summary: 'Create a task',
        requestBody: { required: true, content: jsonContent(ref('CreateTask')) },
        responses: {
          '201': taskResponse('The created task'),
          '400': errorResponse('Invalid request body'),
          ...commonErrors,
        },
      },
    },
    '/api/v1/tasks/{id}': {
      get: {
        tags: ['Tasks'],
        operationId: 'getTask',
        summary: 'Get a task by id',
        parameters: [taskIdParameter],
        responses: {
          '200': taskResponse('The task'),
          '400': errorResponse('Invalid task id'),
          '404': errorResponse('Task not found'),
          ...commonErrors,
        },
      },
      patch: {
        tags: ['Tasks'],
        operationId: 'updateTask',
        summary: 'Update one or more fields of a task',
        parameters: [taskIdParameter],
        requestBody: { required: true, content: jsonContent(ref('UpdateTask')) },
        responses: {
          '200': taskResponse('The updated task'),
          '400': errorResponse('Invalid task id or request body'),
          '404': errorResponse('Task not found'),
          ...commonErrors,
        },
      },
      delete: {
        tags: ['Tasks'],
        operationId: 'deleteTask',
        summary: 'Delete a task',
        parameters: [taskIdParameter],
        responses: {
          '204': { description: 'Task deleted' },
          '400': errorResponse('Invalid task id'),
          '404': errorResponse('Task not found'),
          ...commonErrors,
        },
      },
    },
  },
  components: {
    schemas: {
      Task: toSchema(taskSchema),
      TaskStatus: toSchema(taskStatusSchema),
      TaskPriority: toSchema(taskPrioritySchema),
      CreateTask: toSchema(createTaskSchema),
      UpdateTask: { ...toSchema(updateTaskSchema), minProperties: 1 },
      Error: toSchema(errorSchema),
    },
  },
};
