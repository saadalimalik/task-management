import type { DropdownOption } from '~/types/dropdown.type';

export const clampIndex = (index: number, length: number): number =>
    Math.min(Math.max(index, 0), Math.max(length - 1, 0));

// Finds the next option whose label starts with what the user typed, searching after `from`
// and wrapping round, so repeating a letter steps through the options that share it.
export const findByPrefix = <T extends string>(
    options: DropdownOption<T>[],
    prefix: string,
    from: number,
): number => {
    const needle = prefix.toLowerCase();
    if (!needle) return -1;
    for (let step = 1; step <= options.length; step++) {
        const index = (from + step) % options.length;
        if (options[index]?.label.toLowerCase().startsWith(needle)) return index;
    }
    return -1;
};

type Rect = { top: number; bottom: number; left: number; width: number };

const GAP = 6;

// Opens below the trigger, or above it when the list would not fit below and fits better above.
export const placePanel = (trigger: Rect, panelHeight: number, viewportHeight: number) => {
    const roomBelow = viewportHeight - trigger.bottom;
    const openUp = roomBelow < panelHeight + GAP && trigger.top > roomBelow;
    return {
        top: openUp ? Math.max(GAP, trigger.top - panelHeight - GAP) : trigger.bottom + GAP,
        left: trigger.left,
        width: trigger.width,
    };
};
