import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from './env.js';

export const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});

// Prisma reports "record to update/delete does not exist" as P2025.
export const isRecordNotFoundError = (error: unknown): boolean =>
    typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025';
