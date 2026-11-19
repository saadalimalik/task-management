import { describe, expect, it } from 'vitest';
import { canonicalUrl, seoMeta, webAppJsonLd } from './seo';

describe('seoMeta', () => {
    const meta = seoMeta({
        title: 'Tasks',
        description: 'A task manager.',
        url: 'https://tasks.test/',
    });

    it('sets the title, description and indexing', () => {
        expect(meta).toContainEqual({ title: 'Tasks' });
        expect(meta).toContainEqual({ name: 'description', content: 'A task manager.' });
        expect(meta).toContainEqual({ name: 'robots', content: 'index, follow' });
    });

    it('sets the share tags', () => {
        expect(meta).toContainEqual({ property: 'og:title', content: 'Tasks' });
        expect(meta).toContainEqual({ property: 'og:url', content: 'https://tasks.test/' });
        expect(meta).toContainEqual({ name: 'twitter:card', content: 'summary' });
    });
});

describe('webAppJsonLd', () => {
    it('describes the site as a web application', () => {
        expect(JSON.parse(webAppJsonLd('https://tasks.test/'))).toMatchObject({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            url: 'https://tasks.test/',
        });
    });
});

describe('canonicalUrl', () => {
    it('resolves a path against the site origin', () => {
        expect(canonicalUrl('https://tasks.test')).toBe('https://tasks.test/');
        expect(canonicalUrl('https://tasks.test', '/sitemap.xml')).toBe(
            'https://tasks.test/sitemap.xml',
        );
    });
});
