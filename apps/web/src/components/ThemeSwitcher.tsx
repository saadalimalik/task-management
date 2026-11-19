import { useId } from 'react';
import type { ReactNode } from 'react';
import { MonitorIcon, MoonIcon, SunIcon } from '~/components/Icons';
import type { ThemePreference } from '~/types/theme.type';
import { THEME_PREFERENCES } from '~/utils/theme.util';

const OPTIONS: Record<ThemePreference, { label: string; icon: ReactNode }> = {
    system: { label: 'Match device', icon: <MonitorIcon /> },
    light: { label: 'Light', icon: <SunIcon /> },
    dark: { label: 'Dark', icon: <MoonIcon /> },
};

type ThemeSwitcherProps = {
    theme: ThemePreference;
    onChange: (theme: ThemePreference) => void;
};

// Native radios: one tab stop, arrow keys move between options, and the state is announced.
export const ThemeSwitcher = ({ theme, onChange }: ThemeSwitcherProps) => {
    const name = useId();

    return (
        <fieldset className="flex rounded-full border border-line p-0.5">
            <legend className="sr-only">Theme</legend>
            {THEME_PREFERENCES.map((preference) => (
                <label
                    key={preference}
                    title={OPTIONS[preference].label}
                    className="flex size-11 cursor-pointer items-center justify-center rounded-full text-muted transition-[scale,background-color,color] duration-150 active:scale-90 has-checked:bg-selected has-checked:text-selected-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent fine:hover:text-ink fine:has-checked:hover:text-selected-ink"
                >
                    <input
                        type="radio"
                        name={name}
                        value={preference}
                        checked={theme === preference}
                        onChange={() => onChange(preference)}
                        className="sr-only"
                    />
                    {OPTIONS[preference].icon}
                    <span className="sr-only">{OPTIONS[preference].label}</span>
                </label>
            ))}
        </fieldset>
    );
};
