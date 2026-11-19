import { getRouteApi } from '@tanstack/react-router';
import { useSyncExternalStore } from 'react';
import type { ThemePreference } from '~/types/theme.type';
import { parseTheme, themeCookie } from '~/utils/theme.util';

const rootRoute = getRouteApi('__root__');
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

// In the browser the <html data-theme> attribute is the single source of truth.
const readTheme = (): ThemePreference => parseTheme(document.documentElement.dataset.theme);

export const setTheme = (preference: ThemePreference) => {
    if (preference === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = preference;
    document.cookie = themeCookie(preference);
    listeners.forEach((listener) => listener());
};

// The server renders with the theme saved in the cookie, so the first paint is already right.
export const useTheme = () => {
    const { theme: savedTheme } = rootRoute.useLoaderData();
    const theme = useSyncExternalStore(subscribe, readTheme, () => savedTheme);
    return { theme, setTheme };
};
