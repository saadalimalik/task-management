import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { docsRouter } from './docs.route.js';

const app = express().use(docsRouter);

describe('docs routes', () => {
  it('serves the OpenAPI document as JSON', async () => {
    const res = await request(app).get('/openapi.json');

    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.1.0');
    expect(Object.keys(res.body.paths)).toContain('/api/v1/tasks');
  });

  it('serves Swagger UI', async () => {
    const res = await request(app).get('/docs/');

    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger-ui');
  });
});
