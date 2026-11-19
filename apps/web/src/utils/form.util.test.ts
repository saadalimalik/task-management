import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { errorId, fieldProps, toFieldErrors } from './form.util';

describe('toFieldErrors', () => {
    it('keeps the first message for each field', () => {
        const schema = z.object({
            title: z
                .string()
                .min(3, 'Too short')
                .regex(/^[A-Z]/, 'Start with a capital'),
            age: z.number({ error: 'Enter a number' }),
        });
        const result = schema.safeParse({ title: 'a', age: 'x' });

        expect(result.success).toBe(false);
        expect(toFieldErrors(result.error!)).toEqual({ title: 'Too short', age: 'Enter a number' });
    });
});

describe('fieldProps', () => {
    it('links a field to its error', () => {
        expect(fieldProps('title', 'Enter a title')).toEqual({
            id: 'title',
            'aria-invalid': true,
            'aria-describedby': errorId('title'),
        });
    });

    it('adds nothing when the field is valid', () => {
        expect(fieldProps('title', undefined)).toEqual({
            id: 'title',
            'aria-invalid': undefined,
            'aria-describedby': undefined,
        });
    });
});
