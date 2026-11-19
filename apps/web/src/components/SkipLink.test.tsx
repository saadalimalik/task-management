import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
    it('jumps to the main content', () => {
        render(<SkipLink />);
        expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
            'href',
            '#main',
        );
    });
});
