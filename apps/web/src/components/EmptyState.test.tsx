import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '~/test/render-with-router';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
    it('invites a first task when nothing exists', async () => {
        const user = userEvent.setup();
        const onNewTask = vi.fn();
        renderWithRouter(<EmptyState filtered={false} onNewTask={onNewTask} />);

        expect(await screen.findByRole('heading', { name: 'No tasks yet' })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Add a task' }));
        expect(onNewTask).toHaveBeenCalledTimes(1);
    });

    it('offers to clear the filters when they hide everything', async () => {
        renderWithRouter(<EmptyState filtered onNewTask={() => {}} />, '/?status=done');

        expect(
            await screen.findByRole('heading', { name: 'No tasks match these filters' }),
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', '/');
    });
});
