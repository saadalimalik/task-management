import { describe, expect, it } from 'vitest';
import { clampIndex, findByPrefix, placePanel } from './dropdown.util';

const options = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'hold', label: 'Hold' },
];

describe('clampIndex', () => {
    it('keeps an index inside the list', () => {
        expect(clampIndex(-1, 3)).toBe(0);
        expect(clampIndex(1, 3)).toBe(1);
        expect(clampIndex(9, 3)).toBe(2);
        expect(clampIndex(2, 0)).toBe(0);
    });
});

describe('findByPrefix', () => {
    it('finds an option by what was typed, ignoring case', () => {
        expect(findByPrefix(options, 'm', 0)).toBe(1);
        expect(findByPrefix(options, 'HO', 0)).toBe(3);
    });

    it('steps to the next match when a letter is repeated, and wraps round', () => {
        expect(findByPrefix(options, 'h', 0)).toBe(2);
        expect(findByPrefix(options, 'h', 2)).toBe(3);
        expect(findByPrefix(options, 'h', 3)).toBe(2);
    });

    it('returns -1 when nothing matches', () => {
        expect(findByPrefix(options, 'z', 0)).toBe(-1);
        expect(findByPrefix(options, '', 0)).toBe(-1);
    });
});

describe('placePanel', () => {
    const trigger = { top: 100, bottom: 144, left: 20, width: 240 };

    it('opens below the trigger when there is room', () => {
        expect(placePanel(trigger, 200, 800)).toEqual({ top: 150, left: 20, width: 240 });
    });

    it('opens above when the list does not fit below and there is more room above', () => {
        expect(placePanel({ ...trigger, top: 600, bottom: 644 }, 200, 700)).toEqual({
            top: 394,
            left: 20,
            width: 240,
        });
    });

    it('never places the list off the top of the screen', () => {
        expect(placePanel({ ...trigger, top: 150, bottom: 194 }, 300, 300).top).toBe(6);
    });
});
