import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { openApiDocument } from '../lib/openapi.js';
import { getOpenApiDocument } from './docs.controller.js';

describe('getOpenApiDocument', () => {
  it('responds with the OpenAPI document', () => {
    const res = { json: vi.fn() };

    getOpenApiDocument({} as Request, res as unknown as Response, vi.fn());

    expect(res.json).toHaveBeenCalledWith(openApiDocument);
  });
});
