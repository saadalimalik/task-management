import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '~/test/render-with-router';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
    it('announces the failure with a readable message', async () => {
        renderWithRouter(
            <ErrorState
                error={new Error('The tasks service is not reachable.')}
                reset={() => {}}
            />,
        );

        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent('Tasks could not load');
        expect(alert).toHaveTextContent('The tasks service is not reachable.');
    });

    it('retries on request', async () => {
        const user = userEvent.setup();
        const reset = vi.fn();
        renderWithRouter(<ErrorState error={new Error('down')} reset={reset} />);

        await user.click(await screen.findByRole('button', { name: 'Try again' }));
        expect(reset).toHaveBeenCalledTimes(1);
    });
});
