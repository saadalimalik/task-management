import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as tasksService from '../services/tasks.service.js';
import type { Task } from '../types/tasks.type.js';
import { createTask, deleteTask, getTask, listTasks, updateTask } from './tasks.controller.js';

vi.mock('../services/tasks.service.js');

const service = vi.mocked(tasksService);
const task = { id: 'task-1', title: 'Write docs' } as Task;
const req = {} as Request;
const next: NextFunction = vi.fn();

const fakeResponse = (locals: Record<string, unknown>) => {
  const res = { locals, status: vi.fn(), json: vi.fn(), end: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
};
const asResponse = (res: ReturnType<typeof fakeResponse>) => res as unknown as Response;

beforeEach(() => {
  vi.resetAllMocks();
});

describe('listTasks', () => {
  it('responds with the page and pagination meta', async () => {
    const query = { status: 'todo' as const, limit: 5, offset: 10 };
    service.listTasks.mockResolvedValue({ tasks: [task], total: 7 });
    const res = fakeResponse({ query });

    await listTasks(req, asResponse(res), next);

    expect(service.listTasks).toHaveBeenCalledWith(query);
    expect(res.json).toHaveBeenCalledWith({
      data: [task],
      meta: { total: 7, limit: 5, offset: 10 },
    });
  });
});

describe('getTask', () => {
  it('responds with the task', async () => {
    service.getTaskById.mockResolvedValue(task);
    const res = fakeResponse({ params: { id: 'task-1' } });

    await getTask(req, asResponse(res), next);

    expect(service.getTaskById).toHaveBeenCalledWith('task-1');
    expect(res.json).toHaveBeenCalledWith({ data: task });
  });

  it('rejects with 404 when the task is missing', async () => {
    service.getTaskById.mockResolvedValue(null);
    const res = fakeResponse({ params: { id: 'missing' } });

    await expect(getTask(req, asResponse(res), next)).rejects.toMatchObject({
      status: 404,
      message: 'Task not found',
    });
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe('createTask', () => {
  it('creates the task and responds 201', async () => {
    service.createTask.mockResolvedValue(task);
    const res = fakeResponse({ body: { title: 'Write docs' } });

    await createTask(req, asResponse(res), next);

    expect(service.createTask).toHaveBeenCalledWith({ title: 'Write docs' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: task });
  });
});

describe('updateTask', () => {
  it('responds with the updated task', async () => {
    service.updateTask.mockResolvedValue(task);
    const res = fakeResponse({ params: { id: 'task-1' }, body: { status: 'done' } });

    await updateTask(req, asResponse(res), next);

    expect(service.updateTask).toHaveBeenCalledWith('task-1', { status: 'done' });
    expect(res.json).toHaveBeenCalledWith({ data: task });
  });

  it('rejects with 404 when the task is missing', async () => {
    service.updateTask.mockResolvedValue(null);
    const res = fakeResponse({ params: { id: 'missing' }, body: { status: 'done' } });

    await expect(updateTask(req, asResponse(res), next)).rejects.toMatchObject({ status: 404 });
  });
});

describe('deleteTask', () => {
  it('responds 204 with no body', async () => {
    service.deleteTask.mockResolvedValue(task);
    const res = fakeResponse({ params: { id: 'task-1' } });

    await deleteTask(req, asResponse(res), next);

    expect(service.deleteTask).toHaveBeenCalledWith('task-1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  it('rejects with 404 when the task is missing', async () => {
    service.deleteTask.mockResolvedValue(null);
    const res = fakeResponse({ params: { id: 'missing' } });

    await expect(deleteTask(req, asResponse(res), next)).rejects.toMatchObject({ status: 404 });
  });
});
