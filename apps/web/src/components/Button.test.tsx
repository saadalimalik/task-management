import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button, buttonClass } from './Button';

describe('Button', () => {
    it('is a plain button unless told to submit', () => {
        render(<Button>Save</Button>);
        expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
    });

    it('keeps a 44px minimum height in every variant', () => {
        for (const variant of ['primary', 'secondary', 'danger', 'quiet'] as const) {
            expect(buttonClass(variant)).toContain('min-h-11');
        }
    });

    it('appends extra classes', () => {
        expect(buttonClass('primary', 'w-full')).toMatch(/bg-accent.* w-full$/);
    });
});
