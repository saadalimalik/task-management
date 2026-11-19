import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { fieldProps } from '~/utils/form.util';
import { Field } from './Field';

describe('Field', () => {
    it('labels its control', () => {
        render(
            <Field id="title" label="Title">
                <input {...fieldProps('title', undefined)} />
            </Field>,
        );
        expect(screen.getByLabelText('Title')).toBeInTheDocument();
    });

    it('marks an optional field in the label', () => {
        render(
            <Field id="notes" label="Notes" optional>
                <input {...fieldProps('notes', undefined)} />
            </Field>,
        );
        expect(screen.getByLabelText('Notes (optional)')).toBeInTheDocument();
    });

    it('ties the error message to the control', () => {
        render(
            <Field id="title" label="Title" error="Enter a title">
                <input {...fieldProps('title', 'Enter a title')} />
            </Field>,
        );
        const input = screen.getByLabelText('Title');
        expect(input).toBeInvalid();
        expect(input).toHaveAccessibleDescription('Enter a title');
    });
});
