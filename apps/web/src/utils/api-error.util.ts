import type { ApiError } from '~/types/api-error.type';

export const apiError = (status: number, message: string): ApiError =>
    Object.assign(new Error(message), { status });

// Only 4xx messages written by the API reach the user. Everything else gets fixed wording.
export const toUserMessage = (status: number, apiMessage?: unknown): string => {
    if (status === 429) return 'Too many requests. Wait a moment and try again.';
    if (status === 404) return 'That task no longer exists.';
    if (status >= 400 && status < 500 && typeof apiMessage === 'string' && apiMessage) {
        return apiMessage;
    }
    return 'Something went wrong on our side. Try again in a moment.';
};

const FALLBACK_MESSAGE = 'Something went wrong. Try again.';

// Messages that are serialised validation dumps are not fit to show.
export const toErrorMessage = (error: unknown): string => {
    if (!(error instanceof Error) || !error.message) return FALLBACK_MESSAGE;
    return /^[[{]/.test(error.message.trim()) ? FALLBACK_MESSAGE : error.message;
};
