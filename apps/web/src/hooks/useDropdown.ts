import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { DropdownOption } from '~/types/dropdown.type';
import { clampIndex, findByPrefix, placePanel } from '~/utils/dropdown.util';

const TYPEAHEAD_RESET_MS = 600;
const OPEN_KEYS = ['ArrowDown', 'ArrowUp', 'Enter', ' '];

type UseDropdownArgs<T extends string> = {
    options: DropdownOption<T>[];
    value: T;
    onChange: (value: T) => void;
};

// Behaviour of a select-only combobox (WAI-ARIA pattern): focus stays on the trigger, the
// active option is tracked with aria-activedescendant, and the list lives in the top layer.
export const useDropdown = <T extends string>({ options, value, onChange }: UseDropdownArgs<T>) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const typed = useRef({ text: '', at: 0 });
    const baseId = useId();

    const listId = `${baseId}-list`;
    const optionId = (index: number) => `${baseId}-option-${index}`;
    const selectedIndex = clampIndex(
        options.findIndex((option) => option.value === value),
        options.length,
    );

    const close = useCallback(() => setOpen(false), []);

    const openAt = (index: number) => {
        setActiveIndex(clampIndex(index, options.length));
        setOpen(true);
    };

    const choose = (index: number) => {
        const option = options[index];
        if (option && option.value !== value) onChange(option.value);
        close();
    };

    const typeAhead = (key: string, from: number) => {
        const now = Date.now();
        const text = now - typed.current.at > TYPEAHEAD_RESET_MS ? key : typed.current.text + key;
        typed.current = { text, at: now };
        // One repeated letter steps through matches; a longer word searches from the top.
        const repeated = [...text].every((letter) => letter === text[0]);
        const match = repeated
            ? findByPrefix(options, text[0] ?? '', from)
            : findByPrefix(options, text, -1);
        if (match !== -1) openAt(match);
    };

    useEffect(() => {
        const panel = panelRef.current;
        const trigger = triggerRef.current;
        if (!open || !panel || !trigger) return;

        panel.showPopover();
        const { top, left, width } = placePanel(
            trigger.getBoundingClientRect(),
            panel.offsetHeight,
            window.innerHeight,
        );
        panel.style.setProperty('--dropdown-top', `${top}px`);
        panel.style.setProperty('--dropdown-left', `${left}px`);
        panel.style.setProperty('--dropdown-width', `${width}px`);

        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (!panel.contains(target) && !trigger.contains(target)) close();
        };
        // The list is positioned once, so anything that moves the trigger closes it.
        const onScroll = (event: Event) => {
            if (!panel.contains(event.target as Node)) close();
        };

        document.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('resize', close);
        window.addEventListener('scroll', onScroll, true);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('resize', close);
            window.removeEventListener('scroll', onScroll, true);
            if (panel.isConnected) panel.hidePopover();
        };
    }, [open, close]);

    useEffect(() => {
        if (open)
            document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: 'nearest' });
        // optionId only depends on baseId, which never changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, activeIndex]);

    const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        const { key } = event;
        const printable = key.length === 1 && key !== ' ' && !event.ctrlKey && !event.metaKey;

        if (!open) {
            if (OPEN_KEYS.includes(key)) {
                event.preventDefault();
                openAt(selectedIndex);
            } else if (key === 'Home' || key === 'End') {
                event.preventDefault();
                openAt(key === 'Home' ? 0 : options.length - 1);
            } else if (printable) {
                typeAhead(key, selectedIndex);
            }
            return;
        }

        if (key === 'Tab') {
            choose(activeIndex);
            return;
        }
        if (printable) {
            typeAhead(key, activeIndex);
            return;
        }

        const handlers: Record<string, () => void> = {
            ArrowDown: () => setActiveIndex((index) => clampIndex(index + 1, options.length)),
            ArrowUp: () =>
                event.altKey
                    ? choose(activeIndex)
                    : setActiveIndex((index) => clampIndex(index - 1, options.length)),
            Home: () => setActiveIndex(0),
            End: () => setActiveIndex(options.length - 1),
            Enter: () => choose(activeIndex),
            ' ': () => choose(activeIndex),
            Escape: close,
        };
        const handler = handlers[key];
        if (!handler) return;
        // Also stops Escape from closing a dialog the dropdown sits in.
        event.preventDefault();
        event.stopPropagation();
        handler();
    };

    return {
        open,
        activeIndex,
        selectedIndex,
        selected: options[selectedIndex],
        triggerRef,
        panelRef,
        listId,
        optionId,
        triggerProps: {
            role: 'combobox' as const,
            'aria-haspopup': 'listbox' as const,
            'aria-expanded': open,
            'aria-controls': listId,
            'aria-activedescendant': open ? optionId(activeIndex) : undefined,
            onClick: () => (open ? close() : openAt(selectedIndex)),
            onKeyDown,
        },
        // Keeps focus on the trigger when an option is pressed.
        panelProps: { onMouseDown: (event: MouseEvent) => event.preventDefault() },
        optionProps: (index: number) => ({
            id: optionId(index),
            role: 'option' as const,
            'aria-selected': index === selectedIndex,
            'data-active': index === activeIndex ? '' : undefined,
            onClick: () => choose(index),
            onPointerMove: () => setActiveIndex(index),
        }),
    };
};
