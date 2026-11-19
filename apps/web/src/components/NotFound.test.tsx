import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '~/test/render-with-router';
import { NotFound } from './NotFound';

describe('NotFound', () => {
    it('explains and links back to the tasks', async () => {
        renderWithRouter(<NotFound />);

        expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Go to your tasks' })).toHaveAttribute('href', '/');
    });
});
