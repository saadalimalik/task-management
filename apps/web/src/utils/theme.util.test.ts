import { describe, expect, it } from 'vitest';
import { parseTheme, themeCookie } from './theme.util';

describe('parseTheme', () => {
    it('keeps a saved light or dark choice', () => {
        expect(parseTheme('light')).toBe('light');
        expect(parseTheme('dark')).toBe('dark');
    });

    it('treats anything else as no saved choice', () => {
        expect(parseTheme(undefined)).toBe('system');
        expect(parseTheme('system')).toBe('system');
        expect(parseTheme('"><script>')).toBe('system');
        expect(parseTheme(['dark'])).toBe('system');
    });
});

describe('themeCookie', () => {
    it('saves a choice for a year, site-wide', () => {
        expect(themeCookie('dark')).toBe('theme=dark; Path=/; Max-Age=31536000; SameSite=Lax');
    });

    it('removes the cookie for system', () => {
        expect(themeCookie('system')).toBe('theme=; Path=/; Max-Age=0; SameSite=Lax');
    });
});
