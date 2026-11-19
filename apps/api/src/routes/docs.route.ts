import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { getOpenApiDocument } from '../controllers/docs.controller.js';
import { openApiDocument } from '../lib/openapi.js';

export const docsRouter: Router = Router();

docsRouter.get('/openapi.json', getOpenApiDocument);
docsRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
