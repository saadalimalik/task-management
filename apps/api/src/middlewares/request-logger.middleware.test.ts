import { EventEmitter } from 'node:events';
import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { logger } from '../lib/logger.js';
import { requestLogger } from './request-logger.middleware.js';

describe('requestLogger', () => {
  it('logs method, path, status and duration once the response finishes', () => {
    const logHttp = vi.spyOn(logger, 'http');
    const res = Object.assign(new EventEmitter(), { statusCode: 201 });
    const next = vi.fn();

    requestLogger(
      { method: 'POST', originalUrl: '/api/v1/tasks' } as Request,
      res as unknown as Response,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(logHttp).not.toHaveBeenCalled();

    res.emit('finish');

    expect(logHttp).toHaveBeenCalledWith('request', {
      method: 'POST',
      path: '/api/v1/tasks',
      status: 201,
      durationMs: expect.any(Number),
    });
  });
});
