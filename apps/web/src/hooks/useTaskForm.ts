import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import type { TaskFormErrors, TaskFormValues } from '~/types/task-form.type';
import { toFieldErrors } from '~/utils/form.util';
import { taskFormSchema } from '~/validators/tasks.validator';

export const useTaskForm = (
    initialValues: TaskFormValues,
    onValid: (values: TaskFormValues) => void,
) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<TaskFormErrors>({});

    const setField = <K extends keyof TaskFormValues>(name: K, value: TaskFormValues[K]) => {
        setValues((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => (previous[name] ? { ...previous, [name]: undefined } : previous));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = taskFormSchema.safeParse(values);
        if (result.success) {
            setErrors({});
            onValid(result.data);
            return;
        }

        const fieldErrors = toFieldErrors<keyof TaskFormValues>(result.error);
        setErrors(fieldErrors);

        const invalidFields = Object.keys(fieldErrors);
        const firstInvalid = event.currentTarget.elements.namedItem(invalidFields[0] ?? '');
        if (firstInvalid instanceof HTMLElement) firstInvalid.focus();

        toast.error('Check the form', {
            description:
                invalidFields.length === 1
                    ? '1 field needs your attention.'
                    : `${invalidFields.length} fields need your attention.`,
        });
    };

    return { values, errors, setField, handleSubmit };
};
