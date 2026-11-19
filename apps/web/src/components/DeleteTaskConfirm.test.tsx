import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DeleteTaskConfirm } from './DeleteTaskConfirm';

describe('DeleteTaskConfirm', () => {
    it('names the task and warns that the delete is final', () => {
        render(
            <DeleteTaskConfirm
                title="Write docs"
                pending={false}
                onConfirm={() => {}}
                onCancel={() => {}}
            />,
        );
        expect(screen.getByText(/“Write docs” will be removed for good/)).toBeInTheDocument();
        expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
    });

    it('confirms and cancels', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        render(
            <DeleteTaskConfirm
                title="Write docs"
                pending={false}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />,
        );

        await user.click(screen.getByRole('button', { name: 'Keep task' }));
        await user.click(screen.getByRole('button', { name: 'Delete task' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('locks the delete button while deleting', () => {
        render(
            <DeleteTaskConfirm
                title="Write docs"
                pending
                onConfirm={() => {}}
                onCancel={() => {}}
            />,
        );
        expect(screen.getByRole('button', { name: 'Deleting…' })).toBeDisabled();
    });
});
