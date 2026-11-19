import { CheckIcon, ChevronDownIcon } from '~/components/Icons';
import { useDropdown } from '~/hooks/useDropdown';
import type { DropdownOption } from '~/types/dropdown.type';

type DropdownProps<T extends string> = {
    id: string;
    // Names the list for screen readers and titles the sheet on phones.
    label: string;
    options: DropdownOption<T>[];
    value: T;
    onChange: (value: T) => void;
    name?: string;
    'aria-invalid'?: true;
    'aria-describedby'?: string;
};

// The app's one dropdown. Pair it with a <label htmlFor={id}> (the Field component does this).
export const Dropdown = <T extends string>({
    id,
    label,
    options,
    value,
    onChange,
    name,
    ...aria
}: DropdownProps<T>) => {
    const {
        open,
        selected,
        selectedIndex,
        triggerRef,
        panelRef,
        listId,
        triggerProps,
        panelProps,
        optionProps,
    } = useDropdown({ options, value, onChange });

    return (
        <>
            <button
                ref={triggerRef}
                id={id}
                name={name}
                type="button"
                className="control flex items-center justify-between gap-2 text-left"
                {...triggerProps}
                {...aria}
            >
                <span className="min-w-0 truncate">{selected?.label}</span>
                <ChevronDownIcon
                    className={`size-4 text-muted transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            <div ref={panelRef} popover="manual" className="dropdown-panel" {...panelProps}>
                <p
                    aria-hidden="true"
                    className="px-3 pt-2 pb-1 text-sm font-medium text-muted sm:hidden"
                >
                    {label}
                </p>
                <ul id={listId} role="listbox" aria-label={label}>
                    {options.map((option, index) => (
                        <li
                            key={option.value}
                            className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-sm px-3 select-none aria-selected:font-medium data-active:bg-tint"
                            {...optionProps(index)}
                        >
                            {option.label}
                            {index === selectedIndex && (
                                <CheckIcon className="size-4 text-accent" />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};
