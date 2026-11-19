import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { addToastHost, useToastHost } from './toast-host';

describe('toast host', () => {
    it('follows the most recently opened host and falls back as they close', () => {
        const first = document.createElement('dialog');
        const second = document.createElement('dialog');
        const { result } = renderHook(() => useToastHost());

        expect(result.current).toBeNull();

        let removeFirst = () => {};
        let removeSecond = () => {};
        act(() => {
            removeFirst = addToastHost(first);
        });
        expect(result.current).toBe(first);

        act(() => {
            removeSecond = addToastHost(second);
        });
        expect(result.current).toBe(second);

        act(() => removeSecond());
        expect(result.current).toBe(first);

        act(() => removeFirst());
        expect(result.current).toBeNull();
    });
});
