import { isRecordNotFoundError, prisma } from '../lib/db.js';
import type {
  CreateTaskInput,
  ListTasksQuery,
  Task,
  TaskList,
  UpdateTaskInput,
} from '../types/tasks.type.js';

const nullIfNotFound = (error: unknown): null => {
  if (isRecordNotFoundError(error)) return null;
  throw error;
};

export const listTasks = async ({
  status,
  priority,
  limit,
  offset,
}: ListTasksQuery): Promise<TaskList> => {
  const where = { status, priority };
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({ where, take: limit, skip: offset, orderBy: { createdAt: 'desc' } }),
    prisma.task.count({ where }),
  ]);
  return { tasks, total };
};

export const getTaskById = (id: string): Promise<Task | null> =>
  prisma.task.findUnique({ where: { id } });

export const createTask = (data: CreateTaskInput): Promise<Task> => prisma.task.create({ data });

export const updateTask = (id: string, data: UpdateTaskInput): Promise<Task | null> =>
  prisma.task.update({ where: { id }, data }).catch(nullIfNotFound);

export const deleteTask = (id: string): Promise<Task | null> =>
  prisma.task.delete({ where: { id } }).catch(nullIfNotFound);
