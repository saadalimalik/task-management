import { createFileRoute } from '@tanstack/react-router';
import { env } from '~/lib/env.server';
import { canonicalUrl } from '~/lib/seo';

export const Route = createFileRoute('/robots.txt')({
    server: {
        handlers: {
            GET: () =>
                new Response(
                    `User-agent: *\nAllow: /\n\nSitemap: ${canonicalUrl(env.SITE_URL, '/sitemap.xml')}\n`,
                    { headers: { 'content-type': 'text/plain; charset=utf-8' } },
                ),
        },
    },
});
