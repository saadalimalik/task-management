import type { Task } from '~/types/tasks.type';
import { formatDueDate, isOverdue } from '~/utils/date.util';
import { PRIORITY_LABELS, STATUS_LABELS } from '~/utils/task.util';

type TaskMetaProps = { task: Task };

// Every fact is written out in words, so nothing depends on colour alone.
export const TaskMeta = ({ task }: TaskMetaProps) => {
    const overdue = task.status !== 'done' && isOverdue(task.dueDate);

    return (
        <span className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted">
            {task.status === 'in_progress' && (
                <span className="font-medium text-ink">{STATUS_LABELS.in_progress}</span>
            )}
            <span>{PRIORITY_LABELS[task.priority]} priority</span>
            {task.dueDate && (
                <span className={overdue ? 'font-medium text-danger' : undefined}>
                    {overdue ? 'Overdue since' : 'Due'} {formatDueDate(task.dueDate)}
                </span>
            )}
        </span>
    );
};
