import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { EMPTY_TASK_FORM } from '~/utils/task.util';
import { TaskForm } from './TaskForm';

const renderForm = (props: Partial<ComponentProps<typeof TaskForm>> = {}) => {
    const handlers = {
        onChange: vi.fn(),
        onSubmit: vi.fn((event: { preventDefault: () => void }) => event.preventDefault()),
        onCancel: vi.fn(),
    };
    render(
        <TaskForm
            values={EMPTY_TASK_FORM}
            errors={{}}
            pending={false}
            submitLabel="Create task"
            {...handlers}
            {...props}
        />,
    );
    return handlers;
};

describe('TaskForm', () => {
    it('gives every field a visible label', () => {
        renderForm();
        expect(screen.getByLabelText('Title')).toBeRequired();
        expect(screen.getByLabelText('Description (optional)')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent('To do');
        expect(screen.getByRole('combobox', { name: 'Priority' })).toHaveTextContent('Medium');
        expect(screen.getByLabelText('Due date (optional)')).toHaveAttribute('type', 'date');
    });

    it('reports edits by field name', async () => {
        const user = userEvent.setup();
        const { onChange } = renderForm();

        await user.type(screen.getByLabelText('Title'), 'W');
        await user.click(screen.getByRole('combobox', { name: 'Priority' }));
        await user.click(screen.getByRole('option', { name: 'High' }));
        fireEvent.change(screen.getByLabelText('Due date (optional)'), {
            target: { value: '2026-12-01' },
        });

        expect(onChange).toHaveBeenCalledWith('title', 'W');
        expect(onChange).toHaveBeenCalledWith('priority', 'high');
        expect(onChange).toHaveBeenCalledWith('dueDate', '2026-12-01');
    });

    it('shows each error on its own field', () => {
        renderForm({ errors: { title: 'Enter a title', dueDate: 'Enter a valid date' } });

        expect(screen.getByLabelText('Title')).toHaveAccessibleDescription('Enter a title');
        expect(screen.getByLabelText('Due date (optional)')).toHaveAccessibleDescription(
            'Enter a valid date',
        );
        expect(screen.getByRole('combobox', { name: 'Status' })).not.toHaveAttribute(
            'aria-invalid',
        );
    });

    it('submits and cancels', async () => {
        const user = userEvent.setup();
        const { onSubmit, onCancel } = renderForm();

        await user.click(screen.getByRole('button', { name: 'Create task' }));
        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('locks the submit button while saving', () => {
        renderForm({ pending: true });
        expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    });

    it('offers delete only when a handler is given', async () => {
        const user = userEvent.setup();
        const onDelete = vi.fn();
        renderForm({ onDelete });

        await user.click(screen.getByRole('button', { name: 'Delete task' }));
        expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('has no delete button for a new task', () => {
        renderForm();
        expect(screen.queryByRole('button', { name: 'Delete task' })).not.toBeInTheDocument();
    });
});
