import { describe, expect, it } from 'vitest';
import { openApiDocument } from './openapi.js';

describe('openApiDocument', () => {
    it('documents every tasks operation', () => {
        expect(Object.keys(openApiDocument.paths['/api/v1/tasks'])).toEqual(['get', 'post']);
        expect(Object.keys(openApiDocument.paths['/api/v1/tasks/{id}'])).toEqual([
            'get',
            'patch',
            'delete',
        ]);
    });

    it('derives the create schema from the request validator', () => {
        expect(openApiDocument.components.schemas.CreateTask).toMatchObject({
            type: 'object',
            required: ['title'],
            additionalProperties: false,
            properties: {
                title: { type: 'string', minLength: 1, maxLength: 200 },
                status: { enum: ['todo', 'in_progress', 'done'] },
                dueDate: { type: 'string', format: 'date-time' },
            },
        });
    });

    it('only references schemas that exist', () => {
        const refs = [
            ...JSON.stringify(openApiDocument).matchAll(/#\/components\/schemas\/(\w+)/g),
        ];
        const defined = Object.keys(openApiDocument.components.schemas);

        expect(refs.length).toBeGreaterThan(0);
        for (const [, name] of refs) expect(defined).toContain(name);
    });
});
