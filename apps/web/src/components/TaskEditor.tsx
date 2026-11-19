import { TaskForm } from '~/components/TaskForm';
import { useTaskForm } from '~/hooks/useTaskForm';
import { useCreateTask, useUpdateTask } from '~/hooks/useTaskMutations';
import type { Task } from '~/types/tasks.type';
import { EMPTY_TASK_FORM, toFormValues } from '~/utils/task.util';

type TaskEditorProps = {
    task: Task | null;
    onDone: () => void;
    onDelete: (task: Task) => void;
};

// Wires the form to its state and to the create or update mutation.
export const TaskEditor = ({ task, onDone, onDelete }: TaskEditorProps) => {
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();

    const form = useTaskForm(task ? toFormValues(task) : EMPTY_TASK_FORM, (values) => {
        if (task) updateTask.mutate({ id: task.id, values }, { onSuccess: onDone });
        else createTask.mutate(values, { onSuccess: onDone });
    });

    return (
        <TaskForm
            values={form.values}
            errors={form.errors}
            pending={createTask.isPending || updateTask.isPending}
            submitLabel={task ? 'Save changes' : 'Create task'}
            autoFocusTitle={!task}
            onChange={form.setField}
            onSubmit={form.handleSubmit}
            onCancel={onDone}
            onDelete={task ? () => onDelete(task) : undefined}
        />
    );
};
