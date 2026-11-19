import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { TasksSearch } from '~/types/task-form.type';
import { TaskFilters } from './TaskFilters';

const setup = (search: TasksSearch = {}) => {
    const onStatusChange = vi.fn();
    const onPriorityChange = vi.fn();
    render(
        <TaskFilters
            search={search}
            onStatusChange={onStatusChange}
            onPriorityChange={onPriorityChange}
        />,
    );
    return { user: userEvent.setup(), onStatusChange, onPriorityChange };
};

describe('TaskFilters', () => {
    it('is a search landmark with a labelled dropdown per filter', () => {
        setup();

        expect(screen.getByRole('search', { name: 'Filter tasks' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent('All statuses');
        expect(screen.getByRole('combobox', { name: 'Priority' })).toHaveTextContent(
            'Any priority',
        );
    });

    it('shows the filters in use', () => {
        setup({ status: 'in_progress', priority: 'high' });

        expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent('In progress');
        expect(screen.getByRole('combobox', { name: 'Priority' })).toHaveTextContent('High');
    });

    it('lists every status and reports the one chosen', async () => {
        const { user, onStatusChange } = setup();

        await user.click(screen.getByRole('combobox', { name: 'Status' }));
        expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
            'All statuses',
            'To do',
            'In progress',
            'Done',
        ]);
        await user.click(screen.getByRole('option', { name: 'Done' }));

        expect(onStatusChange).toHaveBeenCalledExactlyOnceWith('done');
    });

    it('reports a chosen priority', async () => {
        const { user, onPriorityChange } = setup();

        await user.click(screen.getByRole('combobox', { name: 'Priority' }));
        await user.click(screen.getByRole('option', { name: 'Low' }));

        expect(onPriorityChange).toHaveBeenCalledExactlyOnceWith('low');
    });

    it('reports no filter when the first option is chosen', async () => {
        const { user, onStatusChange } = setup({ status: 'done' });

        await user.click(screen.getByRole('combobox', { name: 'Status' }));
        await user.click(screen.getByRole('option', { name: 'All statuses' }));

        expect(onStatusChange).toHaveBeenCalledExactlyOnceWith(undefined);
    });
});
