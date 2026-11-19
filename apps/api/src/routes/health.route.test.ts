import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { healthRouter } from './health.route.js';

describe('GET /health', () => {
  it('responds ok', async () => {
    const res = await request(express().use(healthRouter)).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
