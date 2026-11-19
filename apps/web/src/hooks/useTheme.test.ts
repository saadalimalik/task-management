import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { setTheme, useTheme } from './useTheme';

vi.mock('@tanstack/react-router', () => ({
    getRouteApi: () => ({ useLoaderData: () => ({ theme: 'system' }) }),
}));

const html = document.documentElement;

afterEach(() => {
    act(() => setTheme('system'));
});

describe('useTheme', () => {
    it('reads the theme from the document', () => {
        html.dataset.theme = 'dark';
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe('dark');
    });

    it('applies a choice to the document, saves it and updates every reader', () => {
        const first = renderHook(() => useTheme());
        const second = renderHook(() => useTheme());

        act(() => first.result.current.setTheme('light'));

        expect(html.dataset.theme).toBe('light');
        expect(document.cookie).toContain('theme=light');
        expect(first.result.current.theme).toBe('light');
        expect(second.result.current.theme).toBe('light');
    });

    it('returns to the device setting by clearing the attribute and the cookie', () => {
        const { result } = renderHook(() => useTheme());

        act(() => result.current.setTheme('dark'));
        act(() => result.current.setTheme('system'));

        expect(html.dataset.theme).toBeUndefined();
        expect(document.cookie).not.toContain('theme=');
        expect(result.current.theme).toBe('system');
    });
});
