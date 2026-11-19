import { useId } from 'react';
import type { ReactNode } from 'react';
import { CloseIcon } from '~/components/Icons';
import { useModalDialog } from '~/hooks/useModalDialog';

type ModalSheetProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
};

export const ModalSheet = ({ open, onClose, title, children }: ModalSheetProps) => {
    const { ref, onBackdropClick } = useModalDialog(open, onClose);
    const titleId = useId();

    return (
        <dialog
            ref={ref}
            className="sheet"
            aria-labelledby={titleId}
            onClose={onClose}
            onClick={onBackdropClick}
        >
            <div className="flex max-h-[92dvh] flex-col">
                <div
                    aria-hidden="true"
                    className="mx-auto mt-2 h-1 w-10 rounded-full bg-line sm:hidden"
                />
                <div className="flex items-center justify-between gap-4 pt-2 pr-2 pl-5 sm:pt-4 sm:pr-4 sm:pl-6">
                    <h2 id={titleId} className="text-xl font-medium tracking-tight">
                        {title}
                    </h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="flex size-11 items-center justify-center rounded-full transition-[scale] duration-150 active:scale-90 fine:hover:bg-surface"
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className="overflow-y-auto overscroll-contain px-5 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6">
                    {children}
                </div>
            </div>
        </dialog>
    );
};
