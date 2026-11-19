import type { TaskFormValues, TasksSearch } from '~/types/task-form.type';
import type {
    CreateTaskInput,
    ListTasksParams,
    Task,
    TaskPriority,
    TaskStatus,
    UpdateTaskInput,
} from '~/types/tasks.type';
import { toDateInputValue, toDueDateTime } from '~/utils/date.util';

export const PAGE_SIZE = 20;

export const STATUS_LABELS: Record<TaskStatus, string> = {
    todo: 'To do',
    in_progress: 'In progress',
    done: 'Done',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

export const EMPTY_TASK_FORM: TaskFormValues = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
};

export const toFormValues = (task: Task): TaskFormValues => ({
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
    dueDate: toDateInputValue(task.dueDate),
});

export const toCreatePayload = (values: TaskFormValues): CreateTaskInput => ({
    title: values.title,
    status: values.status,
    priority: values.priority,
    ...(values.description ? { description: values.description } : {}),
    ...(values.dueDate ? { dueDate: toDueDateTime(values.dueDate) } : {}),
});

// An empty description or due date clears the stored value.
export const toUpdatePayload = (values: Partial<TaskFormValues>): UpdateTaskInput => ({
    ...(values.title === undefined ? {} : { title: values.title }),
    ...(values.status === undefined ? {} : { status: values.status }),
    ...(values.priority === undefined ? {} : { priority: values.priority }),
    ...(values.description === undefined ? {} : { description: values.description || null }),
    ...(values.dueDate === undefined
        ? {}
        : { dueDate: values.dueDate ? toDueDateTime(values.dueDate) : null }),
});

export const toListParams = ({ status, priority, page = 1 }: TasksSearch): ListTasksParams => ({
    status,
    priority,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
});

export const pageCount = (total: number): number => Math.max(1, Math.ceil(total / PAGE_SIZE));

export const taskCountLabel = (total: number, filtered: boolean): string => {
    const noun = total === 1 ? 'task' : 'tasks';
    if (!filtered) return `${total} ${noun}`;
    return `${total} ${noun} ${total === 1 ? 'matches' : 'match'} these filters`;
};

export const isFiltered = ({ status, priority }: TasksSearch): boolean =>
    status !== undefined || priority !== undefined;
