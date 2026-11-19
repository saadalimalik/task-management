import { useNavigate } from '@tanstack/react-router';
import type { TaskPriority, TaskStatus } from '~/types/tasks.type';

// Filters live in the URL, so each view can be linked, reloaded and server-rendered.
// Changing one always returns to the first page.
export const useTaskFilters = () => {
    const navigate = useNavigate();

    const setStatus = (status: TaskStatus | undefined) =>
        navigate({ to: '/', search: (previous) => ({ ...previous, status, page: undefined }) });

    const setPriority = (priority: TaskPriority | undefined) =>
        navigate({ to: '/', search: (previous) => ({ ...previous, priority, page: undefined }) });

    return { setStatus, setPriority };
};
