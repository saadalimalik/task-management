import type { z } from 'zod';

// First message per top-level field, in schema order.
export const toFieldErrors = <T extends string>(error: z.ZodError): Partial<Record<T, string>> => {
    const errors: Partial<Record<T, string>> = {};
    for (const issue of error.issues) {
        const field = issue.path[0] as T | undefined;
        if (field !== undefined && errors[field] === undefined) errors[field] = issue.message;
    }
    return errors;
};

export const errorId = (fieldId: string): string => `${fieldId}-error`;

export const fieldProps = (id: string, error: string | undefined) => ({
    id,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? errorId(id) : undefined,
});
