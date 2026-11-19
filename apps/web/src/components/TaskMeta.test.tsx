import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { buildTask } from '~/test/fixtures';
import { TaskMeta } from './TaskMeta';

describe('TaskMeta', () => {
    it('writes the priority out in words', () => {
        render(<TaskMeta task={buildTask({ priority: 'high' })} />);
        expect(screen.getByText('High priority')).toBeInTheDocument();
    });

    it('names the in-progress status only', () => {
        const { rerender } = render(<TaskMeta task={buildTask({ status: 'in_progress' })} />);
        expect(screen.getByText('In progress')).toBeInTheDocument();

        rerender(<TaskMeta task={buildTask({ status: 'todo' })} />);
        expect(screen.queryByText('To do')).not.toBeInTheDocument();
    });

    it('shows an upcoming due date', () => {
        render(<TaskMeta task={buildTask({ dueDate: '2999-01-05T00:00:00.000Z' })} />);
        expect(screen.getByText('Due Jan 5, 2999')).toBeInTheDocument();
    });

    it('says overdue in words for an open task past its date', () => {
        render(<TaskMeta task={buildTask({ dueDate: '2020-01-05T00:00:00.000Z' })} />);
        expect(screen.getByText('Overdue since Jan 5, 2020')).toBeInTheDocument();
    });

    it('never calls a finished task overdue', () => {
        render(
            <TaskMeta task={buildTask({ status: 'done', dueDate: '2020-01-05T00:00:00.000Z' })} />,
        );
        expect(screen.getByText('Due Jan 5, 2020')).toBeInTheDocument();
    });
});
