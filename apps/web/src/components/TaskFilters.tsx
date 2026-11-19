import { useId } from 'react';
import { Dropdown } from '~/components/Dropdown';
import { Field } from '~/components/Field';
import type { DropdownOption } from '~/types/dropdown.type';
import type { TasksSearch } from '~/types/task-form.type';
import type { TaskPriority, TaskStatus } from '~/types/tasks.type';
import { PRIORITY_LABELS, STATUS_LABELS } from '~/utils/task.util';
import { TASK_PRIORITIES, TASK_STATUSES } from '~/validators/tasks.validator';

// The dropdown needs a value for "no filter".
const ANY = 'any';
type Any = typeof ANY;

const STATUS_OPTIONS: DropdownOption<TaskStatus | Any>[] = [
    { value: ANY, label: 'All statuses' },
    ...TASK_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] })),
];

const PRIORITY_OPTIONS: DropdownOption<TaskPriority | Any>[] = [
    { value: ANY, label: 'Any priority' },
    ...TASK_PRIORITIES.map((value) => ({ value, label: PRIORITY_LABELS[value] })),
];

const unlessAny = <T extends string>(value: T | Any): T | undefined =>
    value === ANY ? undefined : value;

type TaskFiltersProps = {
    search: TasksSearch;
    onStatusChange: (status: TaskStatus | undefined) => void;
    onPriorityChange: (priority: TaskPriority | undefined) => void;
};

export const TaskFilters = ({ search, onStatusChange, onPriorityChange }: TaskFiltersProps) => {
    const id = useId();

    return (
        <div
            role="search"
            aria-label="Filter tasks"
            className="grid grid-cols-1 gap-4 min-[22rem]:grid-cols-2 lg:grid-cols-1"
        >
            <Field id={`${id}-status`} label="Status">
                <Dropdown
                    id={`${id}-status`}
                    label="Status"
                    options={STATUS_OPTIONS}
                    value={search.status ?? ANY}
                    onChange={(value) => onStatusChange(unlessAny(value))}
                />
            </Field>
            <Field id={`${id}-priority`} label="Priority">
                <Dropdown
                    id={`${id}-priority`}
                    label="Priority"
                    options={PRIORITY_OPTIONS}
                    value={search.priority ?? ANY}
                    onChange={(value) => onPriorityChange(unlessAny(value))}
                />
            </Field>
        </div>
    );
};
