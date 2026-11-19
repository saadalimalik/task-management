import { createFileRoute } from '@tanstack/react-router';
import { env } from '~/lib/env.server';
import { canonicalUrl } from '~/lib/seo';

export const Route = createFileRoute('/sitemap.xml')({
    server: {
        handlers: {
            GET: () =>
                new Response(
                    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${canonicalUrl(env.SITE_URL)}</loc></url>\n</urlset>\n`,
                    { headers: { 'content-type': 'application/xml; charset=utf-8' } },
                ),
        },
    },
});
