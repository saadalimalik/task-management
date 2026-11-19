import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTaskFn, updateTaskFn } from '~/server/tasks.functions';
import { buildTask } from '~/test/fixtures';
import type { Task } from '~/types/tasks.type';
import { TaskEditor } from './TaskEditor';

vi.mock('~/server/tasks.functions', () => ({
    createTaskFn: vi.fn(),
    updateTaskFn: vi.fn(),
    deleteTaskFn: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }));

const renderEditor = (task: Task | null) => {
    const handlers = { onDone: vi.fn(), onDelete: vi.fn() };
    render(
        <QueryClientProvider client={new QueryClient()}>
            <TaskEditor task={task} {...handlers} />
        </QueryClientProvider>,
    );
    return handlers;
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('TaskEditor', () => {
    it('creates a task from an empty form and then closes', async () => {
        const user = userEvent.setup();
        vi.mocked(createTaskFn).mockResolvedValue(buildTask());
        const { onDone } = renderEditor(null);

        await user.type(screen.getByLabelText('Title'), 'Write docs');
        await user.click(screen.getByRole('button', { name: 'Create task' }));

        await waitFor(() => expect(onDone).toHaveBeenCalledTimes(1));
        expect(createTaskFn).toHaveBeenCalledWith({
            data: {
                title: 'Write docs',
                description: '',
                status: 'todo',
                priority: 'medium',
                dueDate: '',
            },
        });
    });

    it('does not call the server while the form is invalid', async () => {
        const user = userEvent.setup();
        const { onDone } = renderEditor(null);

        await user.click(screen.getByRole('button', { name: 'Create task' }));

        expect(screen.getByLabelText('Title')).toHaveAccessibleDescription('Enter a title');
        expect(createTaskFn).not.toHaveBeenCalled();
        expect(onDone).not.toHaveBeenCalled();
    });

    it('starts from the task and saves the edit', async () => {
        const user = userEvent.setup();
        const task = buildTask({ priority: 'low' });
        vi.mocked(updateTaskFn).mockResolvedValue(task);
        const { onDone } = renderEditor(task);

        expect(screen.getByLabelText('Title')).toHaveValue('Write docs');
        await user.click(screen.getByRole('combobox', { name: 'Status' }));
        await user.click(screen.getByRole('option', { name: 'Done' }));
        await user.click(screen.getByRole('button', { name: 'Save changes' }));

        await waitFor(() => expect(onDone).toHaveBeenCalledTimes(1));
        expect(updateTaskFn).toHaveBeenCalledWith({
            data: {
                id: task.id,
                values: {
                    title: 'Write docs',
                    description: '',
                    status: 'done',
                    priority: 'low',
                    dueDate: '',
                },
            },
        });
    });

    it('hands the task to the delete flow', async () => {
        const user = userEvent.setup();
        const task = buildTask();
        const { onDelete } = renderEditor(task);

        await user.click(screen.getByRole('button', { name: 'Delete task' }));
        expect(onDelete).toHaveBeenCalledExactlyOnceWith(task);
    });
});
