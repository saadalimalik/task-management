import { useId } from 'react';
import type { FormEvent } from 'react';
import { Button } from '~/components/Button';
import { Dropdown } from '~/components/Dropdown';
import { Field } from '~/components/Field';
import type { TaskFormErrors, TaskFormValues } from '~/types/task-form.type';
import { fieldProps } from '~/utils/form.util';
import { PRIORITY_LABELS, STATUS_LABELS } from '~/utils/task.util';
import { TASK_PRIORITIES, TASK_STATUSES } from '~/validators/tasks.validator';

const STATUS_OPTIONS = TASK_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));
const PRIORITY_OPTIONS = TASK_PRIORITIES.map((value) => ({
    value,
    label: PRIORITY_LABELS[value],
}));

type TaskFormProps = {
    values: TaskFormValues;
    errors: TaskFormErrors;
    pending: boolean;
    submitLabel: string;
    autoFocusTitle?: boolean;
    onChange: <K extends keyof TaskFormValues>(name: K, value: TaskFormValues[K]) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    onDelete?: () => void;
};

export const TaskForm = ({
    values,
    errors,
    pending,
    submitLabel,
    autoFocusTitle = false,
    onChange,
    onSubmit,
    onCancel,
    onDelete,
}: TaskFormProps) => {
    const id = useId();

    return (
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
            <Field id={`${id}-title`} label="Title" error={errors.title}>
                <input
                    {...fieldProps(`${id}-title`, errors.title)}
                    name="title"
                    type="text"
                    className="control"
                    value={values.title}
                    onChange={(event) => onChange('title', event.target.value)}
                    aria-required="true"
                    data-autofocus={autoFocusTitle ? '' : undefined}
                    autoComplete="off"
                    autoCapitalize="sentences"
                    enterKeyHint="done"
                />
            </Field>

            <Field id={`${id}-description`} label="Description" error={errors.description} optional>
                <textarea
                    {...fieldProps(`${id}-description`, errors.description)}
                    name="description"
                    rows={3}
                    className="control resize-y"
                    value={values.description}
                    onChange={(event) => onChange('description', event.target.value)}
                    autoCapitalize="sentences"
                />
            </Field>

            <div className="grid grid-cols-1 gap-5 min-[22rem]:grid-cols-2">
                <Field id={`${id}-status`} label="Status" error={errors.status}>
                    <Dropdown
                        {...fieldProps(`${id}-status`, errors.status)}
                        name="status"
                        label="Status"
                        options={STATUS_OPTIONS}
                        value={values.status}
                        onChange={(status) => onChange('status', status)}
                    />
                </Field>

                <Field id={`${id}-priority`} label="Priority" error={errors.priority}>
                    <Dropdown
                        {...fieldProps(`${id}-priority`, errors.priority)}
                        name="priority"
                        label="Priority"
                        options={PRIORITY_OPTIONS}
                        value={values.priority}
                        onChange={(priority) => onChange('priority', priority)}
                    />
                </Field>
            </div>

            <Field id={`${id}-dueDate`} label="Due date" error={errors.dueDate} optional>
                <input
                    {...fieldProps(`${id}-dueDate`, errors.dueDate)}
                    name="dueDate"
                    type="date"
                    className="control"
                    value={values.dueDate}
                    onChange={(event) => onChange('dueDate', event.target.value)}
                />
            </Field>

            <div className="mt-1 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                {onDelete && (
                    <Button variant="quiet" className="text-danger sm:mr-auto" onClick={onDelete}>
                        Delete task
                    </Button>
                )}
                <Button className="sm:ml-auto" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={pending}>
                    {pending ? 'Saving…' : submitLabel}
                </Button>
            </div>
        </form>
    );
};
