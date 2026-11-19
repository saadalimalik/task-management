import type { ReactNode } from 'react';

type IconProps = { className?: string };

const Icon = ({ className = 'size-5', children }: IconProps & { children: ReactNode }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={`shrink-0 ${className}`}
    >
        {children}
    </svg>
);

export const PlusIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M12 5v14M5 12h14" />
    </Icon>
);

export const CloseIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
);

export const TrashIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 001 1h8a1 1 0 001-1l1-12M9 7V4h6v3" />
    </Icon>
);

export const AlertIcon = (props: IconProps) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.5v.01" />
    </Icon>
);

export const ChevronLeftIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M15 6l-6 6 6 6" />
    </Icon>
);

export const ChevronRightIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M9 6l6 6-6 6" />
    </Icon>
);

export const ChevronDownIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M6 9l6 6 6-6" />
    </Icon>
);

export const CheckIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M4.5 12.5l5 5L19.5 7" />
    </Icon>
);

export const SunIcon = (props: IconProps) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </Icon>
);

export const MoonIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
    </Icon>
);

export const MonitorIcon = (props: IconProps) => (
    <Icon {...props}>
        <rect x="3" y="4.5" width="18" height="12" rx="2" />
        <path d="M8.5 20h7M12 16.5V20" />
    </Icon>
);

export const LogoMark = ({ className = 'size-7' }: IconProps) => (
    <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
        className={`shrink-0 ${className}`}
    >
        <rect width="32" height="32" rx="8" className="fill-accent" />
        <path
            d="M9 16.5l4.5 4.5L23 11.5"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-accent-ink"
        />
    </svg>
);
