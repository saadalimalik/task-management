import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { validateRequest } from './request.validator.js';

const run = (schemas: Parameters<typeof validateRequest>[0], req: Partial<Request>) => {
  const res = { locals: {} } as Response;
  const next = vi.fn();
  validateRequest(schemas)(req as Request, res, next);
  return { res, next };
};

describe('validateRequest', () => {
  it('stores parsed values on res.locals and continues', () => {
    const { res, next } = run(
      { body: z.object({ count: z.coerce.number() }), params: z.object({ id: z.string() }) },
      { body: { count: '3' }, params: { id: 'abc' } },
    );

    expect(res.locals).toEqual({ body: { count: 3 }, params: { id: 'abc' } });
    expect(next).toHaveBeenCalledExactlyOnceWith();
  });

  it('forwards a 400 with issue details on invalid input', () => {
    const { res, next } = run({ body: z.object({ title: z.string() }) }, { body: { title: 7 } });

    expect(res.locals).toEqual({});
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0]?.[0]).toMatchObject({
      status: 400,
      message: 'Invalid request body',
      details: [{ path: 'title', message: expect.any(String) }],
    });
  });
});
