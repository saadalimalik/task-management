import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { buildTask } from '~/test/fixtures';
import type { Task } from '~/types/tasks.type';
import { TaskItem } from './TaskItem';

const renderItem = (task: Task) => {
    const handlers = { onToggleDone: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() };
    render(
        <ul>
            <TaskItem task={task} {...handlers} />
        </ul>,
    );
    return handlers;
};

describe('TaskItem', () => {
    it('names each control after the task', () => {
        renderItem(buildTask({ description: 'Three sections' }));

        expect(
            screen.getByRole('checkbox', { name: 'Mark “Write docs” as done' }),
        ).not.toBeChecked();
        expect(
            screen.getByRole('button', { name: /^Edit task:\s*Write docs/ }),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete “Write docs”' })).toBeInTheDocument();
        expect(screen.getByText('Three sections')).toBeInTheDocument();
    });

    it('checks the box for a finished task', () => {
        renderItem(buildTask({ status: 'done' }));
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('reports toggle, edit and delete with the task', async () => {
        const user = userEvent.setup();
        const task = buildTask();
        const { onToggleDone, onEdit, onDelete } = renderItem(task);

        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: /^Edit task/ }));
        await user.click(screen.getByRole('button', { name: /^Delete/ }));

        expect(onToggleDone).toHaveBeenCalledExactlyOnceWith(task);
        expect(onEdit).toHaveBeenCalledExactlyOnceWith(task);
        expect(onDelete).toHaveBeenCalledExactlyOnceWith(task);
    });

    it('works from the keyboard', async () => {
        const user = userEvent.setup();
        const { onToggleDone, onEdit } = renderItem(buildTask());

        await user.tab();
        await user.keyboard(' ');
        await user.tab();
        await user.keyboard('{Enter}');

        expect(onToggleDone).toHaveBeenCalledTimes(1);
        expect(onEdit).toHaveBeenCalledTimes(1);
    });
});
