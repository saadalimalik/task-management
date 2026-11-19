import { useCallback, useState } from 'react';
import type { Task } from '~/types/tasks.type';

export type DialogKind = 'form' | 'delete';

type DialogState = {
    open: DialogKind | null;
    // Kept after closing so the dialog's content stays put while it animates out.
    task: Task | null;
    // Changes on every open, so the form starts fresh each time.
    session: number;
};

export const useTaskDialogs = () => {
    const [state, setState] = useState<DialogState>({ open: null, task: null, session: 0 });

    const show = useCallback((open: DialogKind, task: Task | null) => {
        setState((previous) => ({ open, task, session: previous.session + 1 }));
    }, []);

    const openCreate = useCallback(() => show('form', null), [show]);
    const openEdit = useCallback((task: Task) => show('form', task), [show]);
    const openDelete = useCallback((task: Task) => show('delete', task), [show]);
    // Closes one named dialog only. A dialog's own close event can arrive after another dialog
    // has opened (edit sheet -> delete confirm), and must not shut the newer one.
    const close = useCallback((kind: DialogKind) => {
        setState((previous) => (previous.open === kind ? { ...previous, open: null } : previous));
    }, []);

    return { ...state, openCreate, openEdit, openDelete, close };
};
