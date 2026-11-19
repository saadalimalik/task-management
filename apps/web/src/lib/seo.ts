export const SITE_NAME = 'Tasks';
export const SITE_DESCRIPTION =
    'A fast, accessible task manager. Create tasks, set priorities and due dates, and track each one from to do to done.';

type SeoInput = {
    title: string;
    description: string;
    url: string;
};

export const seoMeta = ({ title, description, url }: SeoInput) => [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
];

export const webAppJsonLd = (url: string): string =>
    JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url,
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Any',
    });

// Filters and pages are views of one document, so every variant points at the same canonical URL.
export const canonicalUrl = (siteUrl: string, path = '/'): string => new URL(path, siteUrl).href;
