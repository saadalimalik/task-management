import { Link } from '@tanstack/react-router';
import { Button } from '~/components/Button';
import { LogoMark, PlusIcon } from '~/components/Icons';
import { ThemeSwitcher } from '~/components/ThemeSwitcher';
import type { ThemePreference } from '~/types/theme.type';

type AppHeaderProps = {
    theme: ThemePreference;
    onThemeChange: (theme: ThemePreference) => void;
    onNewTask: () => void;
};

export const AppHeader = ({ theme, onThemeChange, onNewTask }: AppHeaderProps) => (
    <header className="sticky top-0 z-10 border-b border-line bg-bg pt-[env(safe-area-inset-top)]">
        <div className="wrap flex h-14 items-center justify-between gap-4 sm:h-16">
            {/* The page's one h1: the app name. */}
            <h1>
                <Link
                    to="/"
                    className="-ml-1 flex min-h-11 items-center gap-2.5 rounded-sm px-1 text-xl font-medium tracking-tight"
                >
                    <LogoMark />
                    Tasks
                </Link>
            </h1>
            <div className="flex items-center gap-3">
                <ThemeSwitcher theme={theme} onChange={onThemeChange} />
                <Button variant="primary" className="max-sm:hidden" onClick={onNewTask}>
                    <PlusIcon />
                    New task
                </Button>
            </div>
        </div>
    </header>
);
