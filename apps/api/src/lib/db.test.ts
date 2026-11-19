import { describe, expect, it } from 'vitest';
import { isRecordNotFoundError } from './db.js';

describe('isRecordNotFoundError', () => {
  it('is true for a P2025 error', () => {
    expect(isRecordNotFoundError(Object.assign(new Error('gone'), { code: 'P2025' }))).toBe(true);
  });

  it('is false for other errors and non-errors', () => {
    expect(isRecordNotFoundError(Object.assign(new Error('dup'), { code: 'P2002' }))).toBe(false);
    expect(isRecordNotFoundError(new Error('plain'))).toBe(false);
    expect(isRecordNotFoundError(null)).toBe(false);
  });
});
