import type { RequestHandler } from 'express';
import { httpError } from '../utils/http-error.util.js';

export const notFound: RequestHandler = (req, _res, next) => {
    next(httpError(404, `Route ${req.method} ${req.path} not found`));
};
