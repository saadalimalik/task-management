import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'quiet';

const BASE =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 text-base font-medium ' +
    'transition-[scale,opacity,background-color] duration-150 active:scale-[0.97] ' +
    'disabled:pointer-events-none disabled:opacity-60';

const VARIANTS: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-accent-ink fine:hover:opacity-90',
    secondary: 'border border-line bg-bg text-ink fine:hover:bg-surface',
    danger: 'bg-danger text-danger-ink fine:hover:opacity-90',
    quiet: 'text-ink fine:hover:bg-surface',
};

// Shared by <Button> and by links that must look like one.
export const buttonClass = (variant: ButtonVariant = 'secondary', className = ''): string =>
    `${BASE} ${VARIANTS[variant]} ${className}`.trim();

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

export const Button = ({ variant, className, type = 'button', ...props }: ButtonProps) => (
    <button type={type} className={buttonClass(variant, className)} {...props} />
);
