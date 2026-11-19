import { Button } from '~/components/Button';
import { PlusIcon } from '~/components/Icons';

type MobileActionBarProps = { onNewTask: () => void };

// The main action sits in thumb reach on phones. The header carries it from 40rem up.
export const MobileActionBar = ({ onNewTask }: MobileActionBarProps) => (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-bg px-[max(1rem,env(safe-area-inset-left))] pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <Button variant="primary" className="w-full" onClick={onNewTask}>
            <PlusIcon />
            New task
        </Button>
    </div>
);
