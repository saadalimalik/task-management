import type { RequestHandler } from 'express';
import * as tasksService from '../services/tasks.service.js';
import type {
  CreateTaskInput,
  ListTasksQuery,
  TaskIdParams,
  UpdateTaskInput,
} from '../types/tasks.type.js';
import { httpError } from '../utils/http-error.util.js';

const taskNotFound = () => httpError(404, 'Task not found');

export const listTasks: RequestHandler = async (_req, res) => {
  const query: ListTasksQuery = res.locals.query;
  const { tasks, total } = await tasksService.listTasks(query);
  res.json({ data: tasks, meta: { total, limit: query.limit, offset: query.offset } });
};

export const getTask: RequestHandler = async (_req, res) => {
  const { id }: TaskIdParams = res.locals.params;
  const task = await tasksService.getTaskById(id);
  if (!task) throw taskNotFound();
  res.json({ data: task });
};

export const createTask: RequestHandler = async (_req, res) => {
  const body: CreateTaskInput = res.locals.body;
  const task = await tasksService.createTask(body);
  res.status(201).json({ data: task });
};

export const updateTask: RequestHandler = async (_req, res) => {
  const { id }: TaskIdParams = res.locals.params;
  const body: UpdateTaskInput = res.locals.body;
  const task = await tasksService.updateTask(id, body);
  if (!task) throw taskNotFound();
  res.json({ data: task });
};

export const deleteTask: RequestHandler = async (_req, res) => {
  const { id }: TaskIdParams = res.locals.params;
  const task = await tasksService.deleteTask(id);
  if (!task) throw taskNotFound();
  res.status(204).end();
};
