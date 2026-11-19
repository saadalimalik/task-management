import type { ThemePreference } from '~/types/theme.type';

export const THEME_COOKIE = 'theme';
export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// The cookie comes from the browser, so anything unexpected means "no saved choice".
export const parseTheme = (value: unknown): ThemePreference =>
    value === 'light' || value === 'dark' ? value : 'system';

// Choosing `system` removes the cookie.
export const themeCookie = (preference: ThemePreference): string =>
    preference === 'system'
        ? `${THEME_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
        : `${THEME_COOKIE}=${preference}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
