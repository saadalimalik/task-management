import {
    RouterProvider,
    createMemoryHistory,
    createRootRoute,
    createRouter,
} from '@tanstack/react-router';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { tasksSearchSchema } from '~/validators/tasks.validator';

// Renders components that use <Link> inside a real in-memory router.
export const renderWithRouter = (ui: ReactElement, initialUrl = '/') => {
    const rootRoute = createRootRoute({ component: () => ui, validateSearch: tasksSearchSchema });
    const router = createRouter({
        routeTree: rootRoute,
        history: createMemoryHistory({ initialEntries: [initialUrl] }),
    });
    render(<RouterProvider router={router as never} />);
    return router;
};
