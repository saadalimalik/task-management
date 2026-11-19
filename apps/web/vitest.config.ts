import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [viteReact()],
    resolve: { tsconfigPaths: true },
    test: {
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
        setupFiles: ['src/test/setup.ts'],
        env: {
            API_URL: 'http://api.test',
            SITE_URL: 'https://tasks.test',
            INTERNAL_PROXY_SECRET: 'test-proxy-secret-of-at-least-32-chars',
        },
    },
});
