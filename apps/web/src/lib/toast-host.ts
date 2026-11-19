import { useSyncExternalStore } from 'react';

// A modal <dialog> sits in the browser's top layer and makes the rest of the page inert.
// Toasts shown while one is open must render inside it, or they end up dimmed, unclickable
// and silent to screen readers. Open dialogs register here; the Toaster follows the latest.
const hosts: HTMLElement[] = [];
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

export const addToastHost = (host: HTMLElement): (() => void) => {
    hosts.push(host);
    notify();
    return () => {
        const index = hosts.lastIndexOf(host);
        if (index !== -1) hosts.splice(index, 1);
        notify();
    };
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const getHost = () => hosts.at(-1) ?? null;

export const useToastHost = (): HTMLElement | null =>
    useSyncExternalStore(subscribe, getHost, () => null);
