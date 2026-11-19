import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeSwitcher } from './ThemeSwitcher';

describe('ThemeSwitcher', () => {
    it('offers the three choices as a named radio group with the current one checked', () => {
        render(<ThemeSwitcher theme="dark" onChange={() => {}} />);

        expect(screen.getByRole('group', { name: 'Theme' })).toBeInTheDocument();
        expect(screen.getAllByRole('radio').map((radio) => radio.getAttribute('value'))).toEqual([
            'system',
            'light',
            'dark',
        ]);
        expect(screen.getByRole('radio', { name: 'Dark' })).toBeChecked();
        expect(screen.getByRole('radio', { name: 'Match device' })).not.toBeChecked();
    });

    it('reports the chosen theme', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<ThemeSwitcher theme="system" onChange={onChange} />);

        await user.click(screen.getByRole('radio', { name: 'Light' }));

        expect(onChange).toHaveBeenCalledExactlyOnceWith('light');
    });

    it('moves between choices with the arrow keys', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<ThemeSwitcher theme="system" onChange={onChange} />);

        await user.tab();
        await user.keyboard('{ArrowRight}');

        expect(onChange).toHaveBeenCalledExactlyOnceWith('light');
    });
});
