import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';
import { addToastHost } from '~/lib/toast-host';

// Drives a native <dialog> from an `open` flag. The browser supplies the focus trap,
// Escape handling, focus return and the inert background.
export const useModalDialog = (open: boolean, onClose: () => void) => {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog || !open) return;

        if (!dialog.open) dialog.showModal();
        // The browser focuses the first control, which is the close button. Prefer the marked one.
        dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus();
        const removeToastHost = addToastHost(dialog);

        return () => {
            removeToastHost();
            if (dialog.open) dialog.close();
        };
    }, [open]);

    const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
        if (event.target === ref.current) onClose();
    };

    return { ref, onBackdropClick };
};
