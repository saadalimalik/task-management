import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '~/test/render-with-router';
import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
    it('links home, starts a new task and switches theme', async () => {
        const user = userEvent.setup();
        const onNewTask = vi.fn();
        const onThemeChange = vi.fn();
        renderWithRouter(
            <AppHeader theme="system" onThemeChange={onThemeChange} onNewTask={onNewTask} />,
        );

        expect(await screen.findByRole('link', { name: 'Tasks' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('heading', { level: 1, name: 'Tasks' })).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'New task' }));
        expect(onNewTask).toHaveBeenCalledTimes(1);

        await user.click(screen.getByRole('radio', { name: 'Dark' }));
        expect(onThemeChange).toHaveBeenCalledExactlyOnceWith('dark');
    });
});
