import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default defineConfig({
    server: { port: 3001 },
    resolve: { tsconfigPaths: true },
    plugins: [
        tailwindcss(),
        tanstackStart(),
        viteReact(),
        nitro({ routeRules: { '/**': { headers: securityHeaders } } }),
    ],
});
