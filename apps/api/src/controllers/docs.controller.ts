import type { RequestHandler } from 'express';
import { openApiDocument } from '../lib/openapi.js';

export const getOpenApiDocument: RequestHandler = (_req, res) => {
    res.json(openApiDocument);
};
