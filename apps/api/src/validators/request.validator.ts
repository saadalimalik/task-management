import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { httpError } from '../utils/http-error.util.js';

type RequestSchemas = Partial<Record<'params' | 'query' | 'body', ZodType>>;

const REQUEST_PARTS = ['params', 'query', 'body'] as const;

// Parsed values land on res.locals[part]; express 5 exposes req.query as read-only.
export const validateRequest =
  (schemas: RequestSchemas): RequestHandler =>
  (req, res, next) => {
    for (const part of REQUEST_PARTS) {
      const schema = schemas[part];
      if (!schema) continue;

      const result = schema.safeParse(req[part]);
      if (!result.success) {
        const details = result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        next(httpError(400, `Invalid request ${part}`, details));
        return;
      }
      res.locals[part] = result.data;
    }
    next();
  };
