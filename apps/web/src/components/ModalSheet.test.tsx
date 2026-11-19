import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ModalSheet } from './ModalSheet';

describe('ModalSheet', () => {
    it('is a dialog named by its title', () => {
        render(
            <ModalSheet open onClose={() => {}} title="New task">
                <p>Body</p>
            </ModalSheet>,
        );
        expect(screen.getByRole('dialog', { name: 'New task' })).toHaveAttribute('open');
        expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('closes from the close button', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(
            <ModalSheet open onClose={onClose} title="New task">
                <p>Body</p>
            </ModalSheet>,
        );

        await user.click(screen.getByRole('button', { name: 'Close' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('reports a close that the browser started, such as Escape', () => {
        const onClose = vi.fn();
        render(
            <ModalSheet open onClose={onClose} title="New task">
                <p>Body</p>
            </ModalSheet>,
        );

        fireEvent(screen.getByRole('dialog'), new Event('close'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
