import { TrashIcon } from '~/components/Icons';
import { TaskMeta } from '~/components/TaskMeta';
import type { Task } from '~/types/tasks.type';

type TaskItemProps = {
    task: Task;
    onToggleDone: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
};

export const TaskItem = ({ task, onToggleDone, onEdit, onDelete }: TaskItemProps) => {
    const done = task.status === 'done';

    return (
        <li className="border-b border-line">
            <div className="swipe-row">
                <div className="flex items-start py-1.5">
                    <label className="flex size-11 shrink-0 items-center justify-center">
                        <input
                            type="checkbox"
                            className="check"
                            checked={done}
                            onChange={() => onToggleDone(task)}
                            aria-label={`Mark “${task.title}” as done`}
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="min-h-11 min-w-0 flex-1 rounded-sm px-2 py-2 text-left transition-colors select-text active:bg-surface fine:hover:bg-surface"
                    >
                        <span className="sr-only">Edit task: </span>
                        <span
                            className={`block text-lg leading-snug ${done ? 'text-muted line-through' : ''}`}
                        >
                            {task.title}
                        </span>
                        {task.description && (
                            <span className="mt-0.5 line-clamp-2 block text-muted">
                                {task.description}
                            </span>
                        )}
                        <TaskMeta task={task} />
                    </button>
                </div>
                <div className="flex shrink-0 fine:items-start fine:py-1.5">
                    <button
                        type="button"
                        onClick={() => onDelete(task)}
                        aria-label={`Delete “${task.title}”`}
                        className="flex min-h-11 w-20 items-center justify-center bg-danger text-danger-ink transition-[scale,background-color] duration-150 active:opacity-80 fine:size-11 fine:rounded-full fine:bg-transparent fine:text-muted fine:hover:bg-surface fine:hover:text-danger fine:active:scale-90"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </li>
    );
};
