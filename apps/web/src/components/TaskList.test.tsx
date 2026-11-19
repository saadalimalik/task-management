import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { buildTask } from '~/test/fixtures';
import { TaskList } from './TaskList';

describe('TaskList', () => {
    it('renders one named list item per task, in order', () => {
        const tasks = [
            buildTask({ id: '11111111-1111-4111-8111-111111111111', title: 'First' }),
            buildTask({ id: '22222222-2222-4222-8222-222222222222', title: 'Second' }),
        ];
        render(
            <TaskList
                tasks={tasks}
                onToggleDone={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
            />,
        );

        const items = within(screen.getByRole('list', { name: 'Tasks' })).getAllByRole('listitem');
        expect(
            items.map((item) => within(item).getByRole('checkbox').getAttribute('aria-label')),
        ).toEqual(['Mark “First” as done', 'Mark “Second” as done']);
    });
});
