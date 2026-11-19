import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useModalDialog } from './useModalDialog';

const Harness = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const { ref, onBackdropClick } = useModalDialog(open, onClose);
    return (
        <dialog ref={ref} aria-label="Sheet" onClick={onBackdropClick}>
            <button type="button">First</button>
            <button type="button" data-autofocus="">
                Preferred
            </button>
        </dialog>
    );
};

const dialog = () => screen.getByRole('dialog', { hidden: true });

describe('useModalDialog', () => {
    it('opens and closes the dialog with the flag', () => {
        const { rerender } = render(<Harness open={false} onClose={() => {}} />);
        expect(dialog()).not.toHaveAttribute('open');

        rerender(<Harness open onClose={() => {}} />);
        expect(dialog()).toHaveAttribute('open');

        rerender(<Harness open={false} onClose={() => {}} />);
        expect(dialog()).not.toHaveAttribute('open');
    });

    it('focuses the control marked for autofocus', () => {
        render(<Harness open onClose={() => {}} />);
        expect(screen.getByRole('button', { name: 'Preferred' })).toHaveFocus();
    });

    it('closes on a backdrop click but not on a click inside', () => {
        const onClose = vi.fn();
        render(<Harness open onClose={onClose} />);

        fireEvent.click(screen.getByRole('button', { name: 'First' }));
        expect(onClose).not.toHaveBeenCalled();

        fireEvent.click(dialog());
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
