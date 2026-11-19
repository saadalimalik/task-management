export type HttpError = Error & {
  status: number;
  details?: unknown;
};
