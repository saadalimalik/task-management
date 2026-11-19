import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { prisma } from './lib/db.js';
import { env } from './lib/env.js';
import { logger } from './lib/logger.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFound } from './middlewares/not-found.middleware.js';
import { requestLogger } from './middlewares/request-logger.middleware.js';
import { apiRateLimiter } from './rate-limiters/api.rate-limiter.js';
import { docsRouter } from './routes/docs.route.js';
import { healthRouter } from './routes/health.route.js';
import { tasksRouter } from './routes/tasks.route.js';

const app = express();

app.set('trust proxy', env.TRUST_PROXY);
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',') }));
app.use(express.json({ limit: '100kb' }));
app.use(requestLogger);

app.use(healthRouter);
app.use(docsRouter);
app.use('/api/v1', apiRateLimiter);
app.use('/api/v1/tasks', tasksRouter);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
    logger.info(`API listening on port ${env.PORT}`);
});

const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
