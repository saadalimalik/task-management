import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { errorHandler } from '../middlewares/error.middleware.js';
import * as tasksService from '../services/tasks.service.js';
import type { Task } from '../types/tasks.type.js';
import { tasksRouter } from './tasks.route.js';

vi.mock('../services/tasks.service.js');

const service = vi.mocked(tasksService);
const id = '3f2b8c1e-9d4a-4c6b-8f1e-2a7d5b9c0e11';
const task = { id, title: 'Write docs', status: 'todo', priority: 'medium' } as Task;

const app = express().use(express.json()).use('/tasks', tasksRouter).use(errorHandler);

beforeEach(() => {
  vi.resetAllMocks();
});

describe('GET /tasks', () => {
  it('lists tasks with parsed query parameters', async () => {
    service.listTasks.mockResolvedValue({ tasks: [task], total: 1 });

    const res = await request(app).get('/tasks?status=todo&limit=5');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [task], meta: { total: 1, limit: 5, offset: 0 } });
    expect(service.listTasks).toHaveBeenCalledWith({ status: 'todo', limit: 5, offset: 0 });
  });

  it('rejects an invalid query before reaching the service', async () => {
    const res = await request(app).get('/tasks?limit=1000');

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid request query');
    expect(service.listTasks).not.toHaveBeenCalled();
  });
});

describe('POST /tasks', () => {
  it('creates a task', async () => {
    service.createTask.mockResolvedValue(task);

    const res = await request(app).post('/tasks').send({ title: ' Write docs ' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ data: task });
    expect(service.createTask).toHaveBeenCalledWith({ title: 'Write docs' });
  });

  it('rejects an invalid body before reaching the service', async () => {
    const res = await request(app).post('/tasks').send({ title: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatchObject({
      message: 'Invalid request body',
      details: [{ path: 'title' }],
    });
    expect(service.createTask).not.toHaveBeenCalled();
  });
});

describe('GET /tasks/:id', () => {
  it('returns the task', async () => {
    service.getTaskById.mockResolvedValue(task);

    const res = await request(app).get(`/tasks/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: task });
  });

  it('returns 404 for an unknown task', async () => {
    service.getTaskById.mockResolvedValue(null);

    const res = await request(app).get(`/tasks/${id}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { message: 'Task not found' } });
  });

  it('returns 400 for a malformed id', async () => {
    const res = await request(app).get('/tasks/42');

    expect(res.status).toBe(400);
    expect(service.getTaskById).not.toHaveBeenCalled();
  });
});

describe('PATCH /tasks/:id', () => {
  it('updates the task', async () => {
    service.updateTask.mockResolvedValue({ ...task, status: 'done' });

    const res = await request(app).patch(`/tasks/${id}`).send({ status: 'done' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('done');
    expect(service.updateTask).toHaveBeenCalledWith(id, { status: 'done' });
  });

  it('rejects an empty body', async () => {
    const res = await request(app).patch(`/tasks/${id}`).send({});

    expect(res.status).toBe(400);
    expect(service.updateTask).not.toHaveBeenCalled();
  });
});

describe('DELETE /tasks/:id', () => {
  it('deletes the task', async () => {
    service.deleteTask.mockResolvedValue(task);

    const res = await request(app).delete(`/tasks/${id}`);

    expect(res.status).toBe(204);
    expect(res.text).toBe('');
    expect(service.deleteTask).toHaveBeenCalledWith(id);
  });

  it('returns 404 for an unknown task', async () => {
    service.deleteTask.mockResolvedValue(null);

    const res = await request(app).delete(`/tasks/${id}`);

    expect(res.status).toBe(404);
  });
});
