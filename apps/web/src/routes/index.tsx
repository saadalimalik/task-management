import { createFileRoute } from '@tanstack/react-router';
import { AppHeader } from '~/components/AppHeader';
import { DeleteTaskConfirm } from '~/components/DeleteTaskConfirm';
import { EmptyState } from '~/components/EmptyState';
import { MobileActionBar } from '~/components/MobileActionBar';
import { ModalSheet } from '~/components/ModalSheet';
import { Pagination } from '~/components/Pagination';
import { TaskEditor } from '~/components/TaskEditor';
import { TaskFilters } from '~/components/TaskFilters';
import { TaskList } from '~/components/TaskList';
import { useFocusPark } from '~/hooks/useFocusPark';
import { useTaskDialogs } from '~/hooks/useTaskDialogs';
import { useTaskFilters } from '~/hooks/useTaskFilters';
import { useDeleteTask, useUpdateTask } from '~/hooks/useTaskMutations';
import { tasksQueryOptions, useTasks } from '~/hooks/useTasks';
import { useTheme } from '~/hooks/useTheme';
import type { Task } from '~/types/tasks.type';
import { isFiltered, pageCount, taskCountLabel } from '~/utils/task.util';
import { tasksSearchSchema } from '~/validators/tasks.validator';

export const Route = createFileRoute('/')({
    validateSearch: tasksSearchSchema,
    loaderDeps: ({ search }) => search,
    loader: ({ context, deps }) => context.queryClient.ensureQueryData(tasksQueryOptions(deps)),
    component: TasksPage,
});

function TasksPage() {
    const search = Route.useSearch();
    const { data: page } = useTasks(search);
    const dialogs = useTaskDialogs();
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();
    const focusPark = useFocusPark('task-list');
    const { theme, setTheme } = useTheme();
    const filters = useTaskFilters();

    const filtered = isFiltered(search);

    const toggleDone = (task: Task) => {
        const done = task.status === 'done';
        updateTask.mutate({
            id: task.id,
            values: { status: done ? 'todo' : 'done' },
            successMessage: done ? 'Task reopened' : 'Task done',
        });
    };

    const confirmDelete = () => {
        if (!dialogs.task) return;
        deleteTask.mutate(dialogs.task);
        focusPark.park();
        dialogs.close('delete');
    };

    return (
        <>
            <AppHeader theme={theme} onThemeChange={setTheme} onNewTask={dialogs.openCreate} />

            <main id="main" className="wrap pt-6 pb-[calc(var(--bar)+2rem)] sm:pt-10 sm:pb-16">
                <div className="board grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
                    <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
                        <p className="text-lg text-muted" role="status">
                            {taskCountLabel(page.meta.total, filtered)}
                        </p>
                        <TaskFilters
                            search={search}
                            onStatusChange={filters.setStatus}
                            onPriorityChange={filters.setPriority}
                        />
                    </aside>

                    <section
                        id="task-list"
                        aria-label="Task list"
                        tabIndex={-1}
                        className="min-w-0 outline-none lg:max-w-3xl"
                    >
                        {page.data.length > 0 ? (
                            <TaskList
                                tasks={page.data}
                                onToggleDone={toggleDone}
                                onEdit={dialogs.openEdit}
                                onDelete={dialogs.openDelete}
                            />
                        ) : (
                            <EmptyState filtered={filtered} onNewTask={dialogs.openCreate} />
                        )}
                        <Pagination page={search.page ?? 1} pages={pageCount(page.meta.total)} />
                    </section>
                </div>
            </main>

            <MobileActionBar onNewTask={dialogs.openCreate} />

            <ModalSheet
                open={dialogs.open === 'form'}
                onClose={() => dialogs.close('form')}
                title={dialogs.task ? 'Edit task' : 'New task'}
            >
                <TaskEditor
                    key={dialogs.session}
                    task={dialogs.task}
                    onDone={() => dialogs.close('form')}
                    onDelete={dialogs.openDelete}
                />
            </ModalSheet>

            <ModalSheet
                open={dialogs.open === 'delete'}
                onClose={() => {
                    dialogs.close('delete');
                    focusPark.release();
                }}
                title="Delete task?"
            >
                <DeleteTaskConfirm
                    title={dialogs.task?.title ?? ''}
                    pending={deleteTask.isPending}
                    onConfirm={confirmDelete}
                    onCancel={() => dialogs.close('delete')}
                />
            </ModalSheet>
        </>
    );
}
