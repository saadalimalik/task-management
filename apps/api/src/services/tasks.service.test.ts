import { beforeEach, describe, expect, it, vi } from 'vitest';

const taskModel = vi.hoisted(() => ({
  findMany: vi.fn(),
  count: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('../lib/db.js', () => ({
  prisma: { task: taskModel },
  isRecordNotFoundError: (error: { code?: string }) => error.code === 'P2025',
}));

const { createTask, deleteTask, getTaskById, listTasks, updateTask } =
  await import('./tasks.service.js');

const task = { id: 'task-1', title: 'Write docs' };
const notFound = Object.assign(new Error('Record not found'), { code: 'P2025' });
const dbDown = new Error('connection refused');

beforeEach(() => {
  vi.resetAllMocks();
});

describe('listTasks', () => {
  it('returns a filtered page with the total count', async () => {
    taskModel.findMany.mockResolvedValue([task]);
    taskModel.count.mockResolvedValue(7);

    const result = await listTasks({ status: 'todo', priority: undefined, limit: 5, offset: 10 });

    expect(result).toEqual({ tasks: [task], total: 7 });
    expect(taskModel.findMany).toHaveBeenCalledWith({
      where: { status: 'todo', priority: undefined },
      take: 5,
      skip: 10,
      orderBy: { createdAt: 'desc' },
    });
    expect(taskModel.count).toHaveBeenCalledWith({
      where: { status: 'todo', priority: undefined },
    });
  });
});

describe('getTaskById', () => {
  it('looks the task up by id', async () => {
    taskModel.findUnique.mockResolvedValue(task);

    await expect(getTaskById('task-1')).resolves.toEqual(task);
    expect(taskModel.findUnique).toHaveBeenCalledWith({ where: { id: 'task-1' } });
  });
});

describe('createTask', () => {
  it('persists the given fields', async () => {
    taskModel.create.mockResolvedValue(task);

    await expect(createTask({ title: 'Write docs' })).resolves.toEqual(task);
    expect(taskModel.create).toHaveBeenCalledWith({ data: { title: 'Write docs' } });
  });
});

describe('updateTask', () => {
  it('updates and returns the task', async () => {
    taskModel.update.mockResolvedValue({ ...task, status: 'done' });

    await expect(updateTask('task-1', { status: 'done' })).resolves.toEqual({
      ...task,
      status: 'done',
    });
    expect(taskModel.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { status: 'done' },
    });
  });

  it('returns null when the task does not exist', async () => {
    taskModel.update.mockRejectedValue(notFound);
    await expect(updateTask('missing', { status: 'done' })).resolves.toBeNull();
  });

  it('rethrows other database errors', async () => {
    taskModel.update.mockRejectedValue(dbDown);
    await expect(updateTask('task-1', { status: 'done' })).rejects.toBe(dbDown);
  });
});

describe('deleteTask', () => {
  it('deletes and returns the task', async () => {
    taskModel.delete.mockResolvedValue(task);

    await expect(deleteTask('task-1')).resolves.toEqual(task);
    expect(taskModel.delete).toHaveBeenCalledWith({ where: { id: 'task-1' } });
  });

  it('returns null when the task does not exist', async () => {
    taskModel.delete.mockRejectedValue(notFound);
    await expect(deleteTask('missing')).resolves.toBeNull();
  });

  it('rethrows other database errors', async () => {
    taskModel.delete.mockRejectedValue(dbDown);
    await expect(deleteTask('task-1')).rejects.toBe(dbDown);
  });
});
