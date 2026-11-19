import type { ReactNode } from 'react';
import { AlertIcon } from '~/components/Icons';
import { errorId } from '~/utils/form.util';

type FieldProps = {
    id: string;
    label: string;
    error?: string;
    optional?: boolean;
    children: ReactNode;
};

// Label, control and error for one form field. Spread `fieldProps(id, error)` on the control.
export const Field = ({ id, label, error, optional = false, children }: FieldProps) => (
    <div className="flex min-w-0 flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium">
            {label}
            {optional && <span className="font-normal text-muted"> (optional)</span>}
        </label>
        {children}
        {error && (
            <p
                id={errorId(id)}
                className="flex items-start gap-1.5 text-sm font-medium text-danger"
            >
                <AlertIcon className="mt-0.5 size-4" />
                {error}
            </p>
        )}
    </div>
);
