import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.url(),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
    CORS_ORIGIN: z.string().default('*'),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
    // Number of reverse proxies in front of the API whose X-Forwarded-For is trusted.
    // Keep 0 when clients reach the API directly, or they could forge their address.
    TRUST_PROXY: z.coerce.number().int().min(0).default(0),
    // Shared with the web app. A caller that presents it may say which end user it is calling
    // for, so rate limits apply per user. Unset means every caller is judged by its own address.
    INTERNAL_PROXY_SECRET: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z.string().min(32).optional(),
    ),
});

export type Env = z.infer<typeof envSchema>;

export const parseEnv = (source: Record<string, string | undefined>): Env => {
    const result = envSchema.safeParse(source);
    if (!result.success) {
        throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
    }
    return result.data;
};

export const env = parseEnv(process.env);
