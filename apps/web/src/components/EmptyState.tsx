import { Link } from '@tanstack/react-router';
import { Button, buttonClass } from '~/components/Button';

type EmptyStateProps = { filtered: boolean; onNewTask: () => void };

export const EmptyState = ({ filtered, onNewTask }: EmptyStateProps) => (
    <div className="rounded-lg border border-dashed border-line px-6 py-14 text-center">
        <h2 className="text-2xl font-medium tracking-tight">
            {filtered ? 'No tasks match these filters' : 'No tasks yet'}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-muted">
            {filtered
                ? 'Try another status or priority, or clear the filters to see every task.'
                : 'Add the first thing you need to get done. It takes a title and nothing else.'}
        </p>
        <div className="mt-6 flex justify-center">
            {filtered ? (
                <Link to="/" search={{}} className={buttonClass('secondary')}>
                    Clear filters
                </Link>
            ) : (
                <Button onClick={onNewTask}>Add a task</Button>
            )}
        </div>
    </div>
);
