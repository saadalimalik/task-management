import { TaskItem } from '~/components/TaskItem';
import type { Task } from '~/types/tasks.type';

type TaskListProps = {
    tasks: Task[];
    onToggleDone: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
};

export const TaskList = ({ tasks, onToggleDone, onEdit, onDelete }: TaskListProps) => (
    <ul role="list" aria-label="Tasks" className="border-t border-line">
        {tasks.map((task) => (
            <TaskItem
                key={task.id}
                task={task}
                onToggleDone={onToggleDone}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ))}
    </ul>
);
