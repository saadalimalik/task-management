import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TasksSearch } from '~/types/task-form.type';
import { useTaskFilters } from './useTaskFilters';

const navigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => navigate }));

// Runs the search updater the hook handed to the router against a current search.
const nextSearch = (current: TasksSearch): TasksSearch => {
    const { to, search } = navigate.mock.calls[0]![0] as {
        to: string;
        search: (previous: TasksSearch) => TasksSearch;
    };
    expect(to).toBe('/');
    return search(current);
};

beforeEach(() => {
    navigate.mockClear();
});

describe('useTaskFilters', () => {
    it('sets the status, keeps the priority and returns to page one', () => {
        const { result } = renderHook(() => useTaskFilters());

        result.current.setStatus('done');

        expect(nextSearch({ priority: 'high', page: 3 })).toEqual({
            priority: 'high',
            status: 'done',
            page: undefined,
        });
    });

    it('sets the priority, keeps the status and returns to page one', () => {
        const { result } = renderHook(() => useTaskFilters());

        result.current.setPriority('low');

        expect(nextSearch({ status: 'todo', page: 2 })).toEqual({
            status: 'todo',
            priority: 'low',
            page: undefined,
        });
    });

    it('clears a filter', () => {
        const { result } = renderHook(() => useTaskFilters());

        result.current.setStatus(undefined);

        expect(nextSearch({ status: 'done' })).toEqual({ status: undefined, page: undefined });
    });
});
