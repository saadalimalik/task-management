import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown } from './Dropdown';

const options = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

const setup = (value = 'medium') => {
    const onChange = vi.fn();
    render(
        <>
            <label htmlFor="priority">Priority</label>
            <Dropdown
                id="priority"
                label="Priority"
                options={options}
                value={value}
                onChange={onChange}
            />
            <button type="button">Elsewhere</button>
        </>,
    );
    const trigger = screen.getByRole('combobox', { name: 'Priority' });
    const active = () =>
        document.getElementById(trigger.getAttribute('aria-activedescendant') ?? '')?.textContent;
    return { user: userEvent.setup(), onChange, trigger, active };
};

describe('Dropdown', () => {
    it('is a labelled, collapsed combobox showing the current value', () => {
        const { trigger } = setup();

        expect(trigger).toHaveTextContent('Medium');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
        expect(trigger).not.toHaveAttribute('aria-activedescendant');
    });

    it('opens on click with the current value active and marked selected', async () => {
        const { user, trigger, active } = setup();

        await user.click(trigger);

        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        const listbox = screen.getByRole('listbox', { name: 'Priority' });
        expect(trigger).toHaveAttribute('aria-controls', listbox.id);
        expect(within(listbox).getAllByRole('option')).toHaveLength(3);
        expect(within(listbox).getByRole('option', { name: 'Medium' })).toHaveAttribute(
            'aria-selected',
            'true',
        );
        expect(active()).toBe('Medium');
    });

    it('chooses an option on click, closes and keeps focus on the trigger', async () => {
        const { user, trigger, onChange } = setup();

        await user.click(trigger);
        await user.click(screen.getByRole('option', { name: 'High' }));

        expect(onChange).toHaveBeenCalledExactlyOnceWith('high');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveFocus();
    });

    it('does not report a change when the current value is chosen again', async () => {
        const { user, trigger, onChange } = setup();

        await user.click(trigger);
        await user.click(screen.getByRole('option', { name: 'Medium' }));

        expect(onChange).not.toHaveBeenCalled();
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('works from the keyboard: arrows move, Enter chooses', async () => {
        const { user, trigger, onChange, active } = setup();

        await user.tab();
        expect(trigger).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(active()).toBe('Medium');
        await user.keyboard('{ArrowDown}');
        expect(active()).toBe('High');
        await user.keyboard('{ArrowDown}');
        expect(active()).toBe('High');
        await user.keyboard('{Home}');
        expect(active()).toBe('Low');
        await user.keyboard('{Enter}');

        expect(onChange).toHaveBeenCalledExactlyOnceWith('low');
    });

    it('chooses with Space', async () => {
        const { user, onChange } = setup('low');

        await user.tab();
        await user.keyboard('{Enter}{ArrowDown} ');

        expect(onChange).toHaveBeenCalledExactlyOnceWith('medium');
    });

    it('chooses the active option when the user tabs away', async () => {
        const { user, onChange } = setup('low');

        await user.tab();
        await user.keyboard('{ArrowDown}{ArrowDown}');
        await user.tab();

        expect(onChange).toHaveBeenCalledExactlyOnceWith('medium');
        expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus();
    });

    it('jumps to an option by typing its first letters', async () => {
        const { user, onChange, active } = setup('low');

        await user.tab();
        await user.keyboard('h');
        expect(active()).toBe('High');
        await user.keyboard('{Enter}');

        expect(onChange).toHaveBeenCalledExactlyOnceWith('high');
    });

    it('closes on Escape without changing the value', async () => {
        const { user, trigger, onChange } = setup();

        await user.click(trigger);
        await user.keyboard('{ArrowDown}{Escape}');

        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('closes when the user presses somewhere else', async () => {
        const { user, trigger, onChange } = setup();

        await user.click(trigger);
        await user.click(screen.getByRole('button', { name: 'Elsewhere' }));

        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('passes validation state to the trigger', () => {
        render(
            <Dropdown
                id="status"
                label="Status"
                options={options}
                value="low"
                onChange={() => {}}
                aria-invalid
                aria-describedby="status-error"
            />,
        );
        const trigger = screen.getByRole('combobox');
        expect(trigger).toHaveAttribute('aria-invalid', 'true');
        expect(trigger).toHaveAttribute('aria-describedby', 'status-error');
    });
});
