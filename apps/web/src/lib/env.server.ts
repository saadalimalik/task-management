import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    API_URL: z.url().default('http://localhost:3000'),
    SITE_URL: z.url().default('http://localhost:3001'),
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
