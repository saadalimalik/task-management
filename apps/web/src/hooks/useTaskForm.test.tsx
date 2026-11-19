import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import type { TaskFormValues } from '~/types/task-form.type';
import { EMPTY_TASK_FORM } from '~/utils/task.util';
import { useTaskForm } from './useTaskForm';

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

const onValid = vi.fn<(values: TaskFormValues) => void>();

const Harness = ({ initial = EMPTY_TASK_FORM }: { initial?: TaskFormValues }) => {
    const form = useTaskForm(initial, onValid);
    return (
        <form noValidate onSubmit={form.handleSubmit}>
            <input
                aria-label="Title"
                name="title"
                value={form.values.title}
                onChange={(event) => form.setField('title', event.target.value)}
            />
            <input
                aria-label="Due date"
                name="dueDate"
                value={form.values.dueDate}
                onChange={(event) => form.setField('dueDate', event.target.value)}
            />
            <output aria-label="Errors">{JSON.stringify(form.errors)}</output>
            <button type="submit">Save</button>
        </form>
    );
};

const errors = () => JSON.parse(screen.getByLabelText('Errors').textContent ?? '{}');

beforeEach(() => {
    vi.clearAllMocks();
});

describe('useTaskForm', () => {
    it('submits trimmed values when the form is valid', async () => {
        const user = userEvent.setup();
        render(<Harness />);

        await user.type(screen.getByLabelText('Title'), '  Write docs  ');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(onValid).toHaveBeenCalledExactlyOnceWith({
            ...EMPTY_TASK_FORM,
            title: 'Write docs',
        });
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('blocks an invalid form, focuses the first bad field and raises a toast', async () => {
        const user = userEvent.setup();
        render(<Harness />);

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(onValid).not.toHaveBeenCalled();
        expect(errors()).toEqual({ title: 'Enter a title' });
        expect(screen.getByLabelText('Title')).toHaveFocus();
        expect(toast.error).toHaveBeenCalledWith('Check the form', {
            description: '1 field needs your attention.',
        });
    });

    it('counts every invalid field in the toast', async () => {
        const user = userEvent.setup();
        render(<Harness initial={{ ...EMPTY_TASK_FORM, dueDate: 'tomorrow' }} />);

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(errors()).toEqual({ title: 'Enter a title', dueDate: 'Enter a valid date' });
        expect(toast.error).toHaveBeenCalledWith('Check the form', {
            description: '2 fields need your attention.',
        });
    });

    it('clears a field error as soon as the field changes', async () => {
        const user = userEvent.setup();
        render(<Harness />);

        await user.click(screen.getByRole('button', { name: 'Save' }));
        await user.type(screen.getByLabelText('Title'), 'W');

        expect(errors()).toEqual({});
    });
});
