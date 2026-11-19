import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useFocusPark } from './useFocusPark';

const addHeading = () => {
    const heading = document.createElement('h1');
    heading.id = 'heading';
    heading.tabIndex = -1;
    document.body.append(heading);
    return heading;
};

afterEach(() => {
    document.body.innerHTML = '';
});

describe('useFocusPark', () => {
    it('moves focus on release after a park', () => {
        const heading = addHeading();
        const { result } = renderHook(() => useFocusPark('heading'));

        result.current.park();
        expect(document.activeElement).not.toBe(heading);

        result.current.release();
        expect(document.activeElement).toBe(heading);
    });

    it('does nothing on release without a park, and parks only once', () => {
        const heading = addHeading();
        const { result } = renderHook(() => useFocusPark('heading'));

        result.current.release();
        expect(document.activeElement).not.toBe(heading);

        result.current.park();
        result.current.release();
        heading.blur();
        result.current.release();
        expect(document.activeElement).not.toBe(heading);
    });
});
