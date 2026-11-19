import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { env } from '~/lib/env.server';
import { THEME_COOKIE, parseTheme } from '~/utils/theme.util';

// What the document shell needs before it can render: the public origin and the saved theme.
export const getSiteContextFn = createServerFn({ method: 'GET' }).handler(() => ({
    siteUrl: env.SITE_URL,
    theme: parseTheme(getCookie(THEME_COOKIE)),
}));
