import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    API_URL: z.url().default('http://localhost:3000'),
    SITE_URL: z.url().default('http://localhost:3001'),
    // Shared with the API. Proves this server may report which end user it is calling for.
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
