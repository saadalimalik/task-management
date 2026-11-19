import { useCallback, useRef } from 'react';

// When the control that had focus is removed (a deleted row), the browser drops focus on
// <body> and keyboard and screen reader users lose their place. `park` asks for focus to
// move to a stable element; `release` performs it once the dialog has finished closing.
export const useFocusPark = (elementId: string) => {
    const pending = useRef(false);

    const park = useCallback(() => {
        pending.current = true;
    }, []);

    const release = useCallback(() => {
        if (!pending.current) return;
        pending.current = false;
        document.getElementById(elementId)?.focus();
    }, [elementId]);

    return { park, release };
};
