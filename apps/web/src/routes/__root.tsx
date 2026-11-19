import type { QueryClient } from '@tanstack/react-query';
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { SkipLink } from '~/components/SkipLink';
import { Toaster } from '~/components/Toaster';
import { SITE_DESCRIPTION, SITE_NAME, canonicalUrl, seoMeta, webAppJsonLd } from '~/lib/seo';
import { useTheme } from '~/hooks/useTheme';
import { getSiteContextFn } from '~/server/site.functions';
import appCss from '~/styles/app.css?url';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    loader: () => getSiteContextFn(),
    head: ({ loaderData }) => {
        const siteUrl = loaderData?.siteUrl ?? 'http://localhost:3001';
        return {
            meta: [
                { charSet: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1, viewport-fit=cover',
                },
                { name: 'color-scheme', content: 'light dark' },
                ...seoMeta({
                    title: `${SITE_NAME}: plan, prioritise and finish your work`,
                    description: SITE_DESCRIPTION,
                    url: canonicalUrl(siteUrl),
                }),
            ],
            links: [
                { rel: 'stylesheet', href: appCss },
                { rel: 'canonical', href: canonicalUrl(siteUrl) },
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
                { rel: 'manifest', href: '/site.webmanifest' },
            ],
            scripts: [
                { type: 'application/ld+json', children: webAppJsonLd(canonicalUrl(siteUrl)) },
            ],
        };
    },
    shellComponent: RootDocument,
    component: Outlet,
});

const THEME_COLORS = { light: '#ffffff', dark: '#0a0d14' } as const;

function RootDocument({ children }: { children: ReactNode }) {
    const { theme } = useTheme();

    return (
        <html lang="en" data-theme={theme === 'system' ? undefined : theme}>
            <head>
                {/* The router keeps one meta per name, so the theme colours are written here. */}
                {theme === 'system' ? (
                    <>
                        <meta
                            name="theme-color"
                            content={THEME_COLORS.light}
                            media="(prefers-color-scheme: light)"
                        />
                        <meta
                            name="theme-color"
                            content={THEME_COLORS.dark}
                            media="(prefers-color-scheme: dark)"
                        />
                    </>
                ) : (
                    <meta name="theme-color" content={THEME_COLORS[theme]} />
                )}
                <HeadContent />
            </head>
            <body>
                <SkipLink />
                {children}
                <Toaster theme={theme} />
                <Scripts />
            </body>
        </html>
    );
}
