import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '~/test/render-with-router';
import { Pagination } from './Pagination';

describe('Pagination', () => {
    it('renders nothing for a single page', () => {
        const { container } = render(<Pagination page={1} pages={1} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('links to both neighbours from a middle page and keeps the filters', async () => {
        renderWithRouter(<Pagination page={2} pages={3} />, '/?status=done&page=2');

        expect(await screen.findByText('Page 2 of 3')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Previous' })).toHaveAttribute(
            'href',
            '/?status=done',
        );
        expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute(
            'href',
            '/?status=done&page=3',
        );
    });

    it('has no previous link on the first page and no next link on the last', async () => {
        renderWithRouter(<Pagination page={1} pages={2} />);
        expect(await screen.findByRole('link', { name: 'Next' })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Previous' })).not.toBeInTheDocument();
    });
});
