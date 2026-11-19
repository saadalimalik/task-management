import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MobileActionBar } from './MobileActionBar';

describe('MobileActionBar', () => {
    it('starts a new task', async () => {
        const user = userEvent.setup();
        const onNewTask = vi.fn();
        render(<MobileActionBar onNewTask={onNewTask} />);

        await user.click(screen.getByRole('button', { name: 'New task' }));
        expect(onNewTask).toHaveBeenCalledTimes(1);
    });
});
