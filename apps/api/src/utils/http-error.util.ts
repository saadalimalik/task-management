import type { HttpError } from '../types/http-error.type.js';

export const httpError = (status: number, message: string, details?: unknown): HttpError =>
    Object.assign(new Error(message), { status, ...(details === undefined ? {} : { details }) });

// Also matches errors raised by express body parsing, which carry a numeric `status`.
export const isHttpError = (error: unknown): error is HttpError =>
    error instanceof Error &&
    'status' in error &&
    typeof error.status === 'number' &&
    error.status >= 400 &&
    error.status < 600;
