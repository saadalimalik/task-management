import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { getHealth } from './health.controller.js';

describe('getHealth', () => {
  it('reports ok with the process uptime', () => {
    const res = { json: vi.fn() };

    getHealth({} as Request, res as unknown as Response, vi.fn());

    expect(res.json).toHaveBeenCalledWith({ status: 'ok', uptime: expect.any(Number) });
  });
});
