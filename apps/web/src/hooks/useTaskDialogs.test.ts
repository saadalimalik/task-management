import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { buildTask } from '~/test/fixtures';
import { useTaskDialogs } from './useTaskDialogs';

describe('useTaskDialogs', () => {
    it('starts closed', () => {
        const { result } = renderHook(() => useTaskDialogs());
        expect(result.current.open).toBeNull();
    });

    it('opens the form empty for a new task', () => {
        const { result } = renderHook(() => useTaskDialogs());

        act(() => result.current.openCreate());

        expect(result.current).toMatchObject({ open: 'form', task: null, session: 1 });
    });

    it('opens the form or the delete dialog for a task', () => {
        const task = buildTask();
        const { result } = renderHook(() => useTaskDialogs());

        act(() => result.current.openEdit(task));
        expect(result.current).toMatchObject({ open: 'form', task });

        act(() => result.current.openDelete(task));
        expect(result.current).toMatchObject({ open: 'delete', task });
    });

    it('keeps the task after closing and starts a new session on each open', () => {
        const task = buildTask();
        const { result } = renderHook(() => useTaskDialogs());

        act(() => result.current.openEdit(task));
        act(() => result.current.close('form'));
        expect(result.current).toMatchObject({ open: null, task, session: 1 });

        act(() => result.current.openEdit(task));
        expect(result.current.session).toBe(2);
    });

    it('ignores a late close from a dialog that is no longer the open one', () => {
        const task = buildTask();
        const { result } = renderHook(() => useTaskDialogs());

        act(() => result.current.openEdit(task));
        act(() => result.current.openDelete(task));
        act(() => result.current.close('form'));

        expect(result.current).toMatchObject({ open: 'delete', task });

        act(() => result.current.close('delete'));
        expect(result.current.open).toBeNull();
    });
});
